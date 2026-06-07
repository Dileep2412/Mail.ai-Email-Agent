import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const formatDate = (value) => {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const stripHtml = (value) => {
  if (!value) return ''
  return value.replace(/<[^>]*>/g, '').trim()
}

const previewBody = (body) => {
  const cleaned = stripHtml(body)
  if (!cleaned) return 'No email body available.'
  return cleaned.length > 120 ? `${cleaned.slice(0, 120)}...` : cleaned
}

const recipientInitial = (email) => {
  if (!email) return 'M'
  return email.trim().charAt(0).toUpperCase() || 'M'
}

export default function Dashboard() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('sent_emails')
        .select('*')
        .order('sent_at', { ascending: false })

      if (error) {
        setError(error.message)
        setEmails([])
      } else {
        setEmails(data ?? [])
      }
      setLoading(false)
    }

    loadEmails()
  }, [])

  return (
    <div className="dashboard-shell">
      <div className="dashboard-top">
        <div>
          <div className="dashboard-brand" />
          <p className="dashboard-description">Review and track every message created with Mail.ai.</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✉️</div>
          <div>
            <div className="stat-label">Total sent</div>
            <div className="stat-value">{emails.length}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-empty">Loading sent emails…</div>
      ) : error ? (
        <div className="dashboard-error">{error}</div>
      ) : emails.length === 0 ? (
        <div className="dashboard-empty">
          No sent messages yet. Send your first email from the chat to populate this dashboard.
        </div>
      ) : (
        <div className="email-grid">
          {emails.map((email, index) => (
            <div key={email.id ?? index} className="email-card">
              <div className="email-card-header">
                <div className="recipient-badge">{recipientInitial(email.to_email)}</div>
                <div className="email-recipient">
                  <label>To</label>
                  <span>{email.to_email || 'Unknown recipient'}</span>
                </div>
                <div className="email-date">{formatDate(email.sent_at)}</div>
              </div>

              <div className="email-subject">{email.subject || 'No subject'}</div>
              <div className="email-preview">{previewBody(email.body)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
