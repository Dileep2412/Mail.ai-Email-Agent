import { useState, useRef, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import Dashboard from './Dashboard'

const sessionId = Math.random().toString(36).substring(2)

const initialMessages = [
  {
    role: 'ai',
    text: 'Welcome to Mail.ai — your AI-powered email assistant. Ask for a new draft, follow-up, or subject line and get instant results.',
  },
]

const getDisplayName = (email) => {
  if (!email) return 'User'
  const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')
  return name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : 'User'
}

export default function App() {
  const [view, setView] = useState('chat')
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch((import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + '/api/chat', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId, userId: user?.id }),
      })
      const data = await res.json()
      const reply = data?.reply || 'Mail.ai could not generate a response. Please try again.'
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Sorry, I could not connect to the AI service. Verify your backend and try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!user) {
    return <Auth />
  }

  const displayName = getDisplayName(user.email)
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-group">
          <div className="brand-mark">Mail.ai</div>
          <span className="status-pill">Online</span>
        </div>

        <div className="header-right">
          <div className="hello">
            Hi, <strong>{displayName}</strong>
          </div>
          <div className="header-actions">
            <button type="button" className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}>
              Chat
            </button>
            <button type="button" className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
              Dashboard
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {view === 'dashboard' ? (
        <Dashboard />
      ) : (
        <main className="chat-panel">
          <section className="hero-card">
            <div className="hero-title">Your inbox assistant is ready.</div>
            <div className="hero-subtitle">
              Chat with Mail.ai to draft better emails, organize follow-ups, and stay in control of every conversation.
            </div>
          </section>

          <section className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                {msg.role === 'ai' && <div className="avatar avatar-ai">AI</div>}
                <div className="message-bubble">
                  <div className="message-meta">{msg.role === 'ai' ? 'Mail.ai' : `You · ${displayName}`}</div>
                  <div>{msg.text}</div>
                </div>
                {msg.role === 'user' && <div className="avatar avatar-user">{userInitial}</div>}
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Mail.ai is composing your reply…</span>
              </div>
            )}

            <div ref={bottomRef} />
          </section>

          <section className="composer-bar">
            <input
              className="compose-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Mail.ai to write a message, follow-up, or subject line..."
            />
            <button className="compose-button" type="button" onClick={sendMessage} disabled={loading}>
              📩 Send
            </button>
          </section>
        </main>
      )}
    </div>
  )
}
