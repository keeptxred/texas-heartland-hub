import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Item {
  description: string
  quantity: number
  amount: string
  currency: string
}

interface Shipping {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface Props {
  orderId?: string
  customerName?: string
  items?: Item[]
  total?: string
  currency?: string
  shipping?: Shipping
}

const Email = ({
  orderId = '',
  customerName = 'Patriot',
  items = [],
  total = '0.00',
  currency = 'USD',
  shipping,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for your Keep Texas Red order</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Keep Texas Red</Heading>
        <Text style={muted}>Order confirmation</Text>

        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thanks for supporting Keep Texas Red. We&apos;ve received your order and it&apos;s
          being sent to our print partner for fulfillment. You&apos;ll typically receive
          your gear within 3–7 business days.
        </Text>

        <Section style={card}>
          <Text style={label}>Order number</Text>
          <Text style={mono}>{orderId}</Text>
        </Section>

        <Heading as="h2" style={h2}>Items</Heading>
        {items.map((item, i) => (
          <Section key={i} style={row}>
            <Text style={itemLine}>
              {item.quantity}× {item.description}
            </Text>
            <Text style={itemPrice}>
              {item.currency} {item.amount}
            </Text>
          </Section>
        ))}
        <Hr style={hr} />
        <Section style={row}>
          <Text style={totalLabel}>Total</Text>
          <Text style={totalValue}>
            {currency} {total}
          </Text>
        </Section>

        {shipping ? (
          <>
            <Heading as="h2" style={h2}>Shipping to</Heading>
            <Text style={text}>
              {shipping.name}
              <br />
              {shipping.line1}
              {shipping.line2 ? (
                <>
                  <br />
                  {shipping.line2}
                </>
              ) : null}
              <br />
              {shipping.city}, {shipping.state} {shipping.postal_code}
              <br />
              {shipping.country}
            </Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={muted}>
          Questions? Reply to this email and we&apos;ll help you out.
        </Text>
        <Text style={muted}>God bless Texas.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    data?.orderId ? `Your Keep Texas Red order (${String(data.orderId).slice(-8)})` : 'Your Keep Texas Red order',
  displayName: 'Order confirmation',
  previewData: {
    orderId: 'cs_test_abc123',
    customerName: 'Sam Houston',
    items: [
      { description: 'Keep Texas Red — Classic Tee / Red / L', quantity: 1, amount: '24.99', currency: 'USD' },
      { description: 'Lone Star Structured Cap / Black', quantity: 2, amount: '58.00', currency: 'USD' },
    ],
    total: '82.99',
    currency: 'USD',
    shipping: {
      name: 'Sam Houston',
      line1: '1100 Congress Ave',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'US',
    },
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { color: '#B91C1C', fontSize: '22px', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '0.02em' }
const h2 = { color: '#0F172A', fontSize: '16px', fontWeight: 700, margin: '28px 0 12px 0' }
const text = { color: '#111827', fontSize: '15px', lineHeight: '22px', margin: '10px 0' }
const muted = { color: '#6B7280', fontSize: '13px', lineHeight: '20px', margin: '10px 0' }
const label = { color: '#6B7280', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px 0' }
const mono = { color: '#111827', fontSize: '13px', fontFamily: 'Menlo, Consolas, monospace', margin: 0 }
const card = { background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px', margin: '16px 0' }
const row = { display: 'flex', justifyContent: 'space-between', margin: '4px 0' }
const itemLine = { color: '#111827', fontSize: '14px', margin: 0 }
const itemPrice = { color: '#111827', fontSize: '14px', margin: 0, fontWeight: 600 }
const totalLabel = { color: '#111827', fontSize: '15px', fontWeight: 700, margin: 0 }
const totalValue = { color: '#B91C1C', fontSize: '16px', fontWeight: 700, margin: 0 }
const hr = { borderColor: '#E5E7EB', margin: '18px 0' }