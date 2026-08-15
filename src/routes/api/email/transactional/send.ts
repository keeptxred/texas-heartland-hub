import * as React from 'react'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { render } from 'react-email'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { TEMPLATES } from '@/lib/email-templates/registry'

type EmailSendBinding = {
  send(message: {
    to: string | { email: string; name?: string }
    from: string | { email: string; name?: string }
    subject: string
    html?: string
    text?: string
    headers?: Record<string, string>
  }): Promise<{ messageId?: string } | unknown>
}

const FROM_ADDRESS = 'noreply@keeptxred.com'
const FROM_NAME = 'Keep TX Red'

function redactEmail(email: string | null | undefined): string {
  if (!email) return '***'
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return '***'
  return `${localPart[0]}***@${domain}`
}

function emailBinding(): EmailSendBinding | null {
  const binding = (cloudflareEnv as unknown as { EMAIL?: EmailSendBinding }).EMAIL
  return binding?.send ? binding : null
}

export const Route = createFileRoute('/api/email/transactional/send')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('Missing required email environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.slice('Bearer '.length).trim()
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Internal services such as the Stripe webhook authenticate with the
        // service-role key. Interactive callers may use a normal Supabase user JWT.
        if (token !== supabaseServiceKey) {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser(token)
          if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }
        }

        let templateName: string
        let recipientEmail: string
        let idempotencyKey: string
        let templateData: Record<string, any> = {}
        try {
          const body = await request.json()
          templateName = body.templateName || body.template_name
          recipientEmail = body.recipientEmail || body.recipient_email
          idempotencyKey = body.idempotencyKey || body.idempotency_key || crypto.randomUUID()
          if (body.templateData && typeof body.templateData === 'object') {
            templateData = body.templateData
          }
        } catch {
          return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 })
        }

        if (!templateName) {
          return Response.json({ error: 'templateName is required' }, { status: 400 })
        }

        const template = TEMPLATES[templateName]
        if (!template) {
          return Response.json(
            {
              error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
            },
            { status: 404 },
          )
        }

        const effectiveRecipient = template.to || recipientEmail
        if (!effectiveRecipient) {
          return Response.json(
            { error: 'recipientEmail is required unless the template defines a fixed recipient' },
            { status: 400 },
          )
        }

        const binding = emailBinding()
        if (!binding) {
          console.error('Cloudflare EMAIL binding is unavailable')
          return Response.json(
            { error: 'Email service is not configured' },
            { status: 503 },
          )
        }

        const messageId = crypto.randomUUID()
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function'
            ? template.subject(templateData)
            : template.subject

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: templateName,
          recipient_email: effectiveRecipient,
          status: 'pending',
          metadata: { provider: 'cloudflare-email-service', idempotency_key: idempotencyKey },
        })

        try {
          const result = await binding.send({
            to: effectiveRecipient,
            from: { email: FROM_ADDRESS, name: FROM_NAME },
            subject,
            html,
            text,
            headers: {
              'X-KTR-Message-ID': messageId,
              'X-KTR-Idempotency-Key': idempotencyKey,
            },
          })

          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: 'sent',
            metadata: { provider: 'cloudflare-email-service' },
          })

          console.log('Transactional email sent through Cloudflare Email Service', {
            templateName,
            recipient_redacted: redactEmail(effectiveRecipient),
          })

          return Response.json({ success: true, provider: 'cloudflare-email-service', result })
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Cloudflare Email Service send failed', {
            templateName,
            recipient_redacted: redactEmail(effectiveRecipient),
            error: message,
          })

          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: 'failed',
            error_message: message.slice(0, 1000),
            metadata: { provider: 'cloudflare-email-service' },
          })

          return Response.json({ error: 'Email delivery failed' }, { status: 502 })
        }
      },
    },
  },
})
