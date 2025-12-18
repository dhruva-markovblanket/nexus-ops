import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ID_REGEX = /^\d{2}(SUU|TCH|ADM)[A-Z]{3}\d{3}$/
const PASSWORD_REGEX = /^\d{8}$/

export default function Login() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function validateInputs() {
    if (!id || typeof id !== 'string') return 'ID is required'
    if (id.length !== 11) return 'ID must be exactly 11 characters'
    if (!ID_REGEX.test(id)) return 'ID format invalid. Expected YY(ROLE)DEPT###'
    if (!password || typeof password !== 'string') return 'Password is required'
    if (!PASSWORD_REGEX.test(password)) return 'Password must be DDMMYYYY (8 digits)'
    return null
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const vErr = validateInputs()
    if (vErr) return setError(vErr)

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        return setError(data.error || 'Login failed')
      }

      // store id for dashboards
      localStorage.setItem('nexus_user_id', id)

      if (data.role === 'student') return navigate('/student')
      if (data.role === 'teacher') return navigate('/teacher')
      if (data.role === 'admin') return navigate('/admin')

      setError('Unknown role')
    } catch {
      setError('Network error')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>ID</label>
          <br />
          <input value={id} onChange={(e) => setId(e.target.value.trim())} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password (DDMMYYYY)</label>
          <br />
          <input value={password} onChange={(e) => setPassword(e.target.value.trim())} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Sign in</button>
        </div>
        {error && (
          <div style={{ marginTop: 12, color: 'red' }}>{error}</div>
        )}
      </form>
    </div>
  )
}
