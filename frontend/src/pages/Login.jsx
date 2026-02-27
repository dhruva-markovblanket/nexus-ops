import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight, ShieldAlert } from 'lucide-react'

const ID_REGEX = /^\d{2}(SUU|TCH|ADM)[A-Z]{3}\d{3}$/
const PASSWORD_REGEX = /^\d{8}$/

export default function Login() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function validateInputs() {
    if (!id || typeof id !== 'string') return 'ID is required'
    if (id.length !== 11) return 'ID must be exactly 11 characters'
    if (!ID_REGEX.test(id)) return 'ID format invalid (e.g., 23ADMSCI123)'
    if (!password || typeof password !== 'string') return 'Password is required'
    if (!PASSWORD_REGEX.test(password)) return 'Password must be DDMMYYYY (8 digits)'
    return null
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const vErr = validateInputs()
    if (vErr) return setError(vErr)

    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      localStorage.setItem('nexus_user_id', id)

      // Artificial delay for premium feel
      setTimeout(() => {
        if (data.role === 'student') return navigate('/student')
        if (data.role === 'teacher') return navigate('/teacher')
        if (data.role === 'admin') return navigate('/admin')
        setError('Unknown role')
        setIsLoading(false)
      }, 600)
    } catch {
      setError('Network error. Is the backend running?')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background animated elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-5%',
          zIndex: 0
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel"
        style={{
          padding: '3rem',
          width: '100%',
          maxWidth: '440px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          >
            <Lock color="white" size={24} />
          </motion.div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Nexus Ops</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Secure organizational access portal</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Corporate ID
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                placeholder="e.g. 23ADMSCI123"
                value={id}
                onChange={(e) => setId(e.target.value.trim().toUpperCase())}
                style={{ paddingLeft: '2.75rem' }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Security Pin (DOB)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="password"
                placeholder="DDMMYYYY"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                style={{ paddingLeft: '2.75rem', letterSpacing: password ? '2px' : 'normal' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldAlert size={16} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          Protected by Nexus Enterprise Security Node v2.4
        </div>
      </motion.div>
    </div>
  )
}
