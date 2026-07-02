import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({
    meta: [
      { title: 'Unsubscribe · Keep Texas Red' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  component: UnsubscribePage,
})

type Status = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error'

function UnsubscribePage() {
  const [status, setStatus] = useState<Status>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    setToken(t)
    if (!t) {
      setStatus('invalid')
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid) setStatus('valid')
        else if (data?.reason === 'already_unsubscribed') setStatus('already')
        else setStatus('invalid')
      })
      .catch(() => setStatus('error'))
  }, [])

  const confirm = async () => {
    if (!token) return
    setSubmitting(true)
    try {
      const res = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (data?.success) setStatus('success')
      else if (data?.reason === 'already_unsubscribed') setStatus('already')
      else setStatus('error')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
        <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
          Keep Texas Red
        </div>
        <h1 className="font-display text-2xl mb-4">Email preferences</h1>

        {status === 'loading' && <p className="text-muted-foreground">Checking your link…</p>}

        {status === 'valid' && (
          <>
            <p className="text-muted-foreground mb-6">
              Confirm you want to unsubscribe from Keep Texas Red emails.
            </p>
            <button
              onClick={confirm}
              disabled={submitting}
              className="inline-flex rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Unsubscribing…' : 'Confirm unsubscribe'}
            </button>
          </>
        )}

        {status === 'success' && (
          <p className="text-muted-foreground">You&apos;ve been unsubscribed. Thanks for reading.</p>
        )}
        {status === 'already' && (
          <p className="text-muted-foreground">This email address is already unsubscribed.</p>
        )}
        {status === 'invalid' && (
          <p className="text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
        )}
        {status === 'error' && (
          <p className="text-muted-foreground">Something went wrong. Please try again later.</p>
        )}
      </div>
    </div>
  )
}