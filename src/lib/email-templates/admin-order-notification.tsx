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
  customerEmail?: string
  items?: Item[]
  total?: string
  currency?: string
  shipping?: Shipping
  printifyOrderId?: string | null
}

const Email = ({
  orderId = '',
  customerName = '',
  customerEmail = '',
  items = [],
  total = '0.00',
  currency = 'USD',
  shipping,
  printifyOrderId,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Keep Texas Red order — {customerName || customerEmail}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New order received</Heading>
        <Text style={muted}>Keep Texas Red shop</Text>

        <Section style={card}>
          <Text style={row}><b>Customer:</b> {customerName}</Text>
          <Text style={row}><b>Email:</b> {customerEmail}</Text>
          <Text style={row}><b>Total:</b> {currency} {total}</Text>
          <Text style={row}><b>Stripe session:</b> {orderId}</Text>
          <Text style={row}>
            <b>Printify order:</b>{' '}
            {printifyOrderId ? printifyOrderId : 'Not submitted (check logs)'}
          </Text>
        </Section>

        <Heading as="h2" style={h2}>Items</Heading>
        {items.map((item, i) => (
          <Text key={i} style={itemLine}>
            {item.quantity}× {item.description} — {item.currency} {item.amount}
          </Text>
        ))}

        {shipping ? (
          <>
            <Heading as="h2" style={h2}>Ship to</Heading>
            <Text style={itemLine}>
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
          Fulfillment is handled automatically by Printify. This is an internal
          notification.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `New order · ${data?.customerName || data?.customerEmail || 'Keep Texas Red'} · ${data?.currency ?? 'USD'} ${data?.total ?? ''}`.trim(),
  displayName: 'Admin order notification',
  previewData: {
    orderId: 'cs_test_abc123',
    customerName: 'Sam Houston',
    customerEmail: 'sam@example.com',
    items: [
      { description: 'Keep Texas Red — Classic Tee / Red / L', quantity: 1, amount: '24.99', currency: 'USD' },
    ],
    total: '24.99',
    currency: 'USD',
    shipping: {
      name: 'Sam Houston',
      line1: '1100 Congress Ave',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'US',
    },
    printifyOrderId: 'pf_5f9d2c7b',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { color: '#0F172A', fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }
const h2 = { color: '#0F172A', fontSize: '15px', fontWeight: 700, margin: '20px 0 8px 0' }
const muted = { color: '#6B7280', fontSize: '12px', margin: '4px 0' }
const card = { background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px 14px', margin: '14px 0' }
const row = { color: '#111827', fontSize: '13px', margin: '4px 0' }
const itemLine = { color: '#111827', fontSize: '13px', margin: '4px 0' }
const hr = { borderColor: '#E5E7EB', margin: '18px 0' }