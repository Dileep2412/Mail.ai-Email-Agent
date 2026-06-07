import { useState } from 'react'
import { supabase } from './supabase'

export default function Auth() {
  const [authMethod, setAuthMethod] = useState('password')
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const resetMessages = () => {
    setMessage('')
    setStatus('')
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    resetMessages()

    if (!email.trim() || !password) {
      setMessage('Please provide both email and password.')
      setStatus('error')
      return
    }

    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        setMessage(error.message)
        setStatus('error')
      } else {
        setMessage('Welcome back! Redirecting to your dashboard...')
        setStatus('success')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password })
      if (error) {
        setMessage(error.message)
        setStatus('error')
      } else {
        setMessage('Account created successfully. Check your inbox to confirm your email.')
        setStatus('success')
      }
    }
    setLoading(false)
  }

  const handleSendOtp = async (event) => {
    event.preventDefault()
    resetMessages()

    if (!email.trim()) {
      setMessage('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })

    if (error) {
      setMessage(error.message)
      setStatus('error')
    } else {
      setStep('otp')
      setMessage('OTP sent to your email!')
      setStatus('success')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    resetMessages()

    if (!otp.trim() || otp.trim().length !== 6) {
      setMessage('Enter the 6-digit code sent to your email.')
      setStatus('error')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    })

    if (error) {
      setMessage('Invalid OTP. Please check the code and try again.')
      setStatus('error')
    } else {
      setMessage('OTP verified! Logging you in...')
      setStatus('success')
    }
    setLoading(false)
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    resetMessages()
  }

  const handleMethodChange = (method) => {
    setAuthMethod(method)
    setStep('email')
    setOtp('')
    resetMessages()
  }

  return (
    <div className="auth-page">
      <div className="auth-shell glass-card">
        <div className="auth-brand">Mail.ai</div>
        <p className="auth-subtitle">Your AI-powered email assistant</p>

        <div className="auth-card">
          <div className="auth-toggle">
            <button type="button" className={authMethod === 'password' ? 'active' : ''} onClick={() => handleMethodChange('password')}>
              Password
            </button>
            <button type="button" className={authMethod === 'otp' ? 'active' : ''} onClick={() => handleMethodChange('otp')}>
              OTP
            </button>
          </div>

          {authMethod === 'password' ? (
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <label className="auth-field">
                <span>Email</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  required
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </label>

              <div className="auth-toggle auth-toggle-secondary">
                <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                  Login
                </button>
                <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
                  Sign up
                </button>
              </div>

              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : mode === 'login' ? 'Login' : 'Sign up'}
              </button>

              {message && (
                <div className={`auth-message ${status === 'success' ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </form>
          ) : (
            <form className="auth-form" onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}>
              {step === 'email' ? (
                <>
                  <label className="auth-field">
                    <span>Email</span>
                    <input
                      className="auth-input"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoFocus
                      required
                    />
                  </label>

                  <button className="auth-button" type="submit" disabled={loading}>
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="auth-step-label">Enter the 6-digit code sent to your email</div>

                  <label className="auth-field">
                    <span>OTP code</span>
                    <input
                      className="auth-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      autoFocus
                      required
                    />
                  </label>

                  <div className="auth-form-actions">
                    <button type="button" className="auth-back" onClick={handleBack}>
                      Back
                    </button>
                    <button className="auth-button" type="submit" disabled={loading}>
                      {loading ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                </>
              )}

              {message && (
                <div className={`auth-message ${status === 'success' ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
