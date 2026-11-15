import { useState } from 'react'
import { Brand } from '../../components/layout/Brand'
import { Field } from '../../components/form/Field'

export function LoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = (event) => setCredentials({ ...credentials, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try { await onLogin(credentials) } catch (loginError) { setError(loginError.message) } finally { setLoading(false) }
  }
  return <main className="login-screen"><form className="login-box" onSubmit={submit}><Brand /><h1>Bem-vindo de volta</h1><p>Entre para acompanhar a operação da sua barbearia.</p><Field label="E-mail" name="email" type="email" value={credentials.email} onChange={update} required /><Field label="Senha" name="password" type="password" value={credentials.password} onChange={update} required />{error && <p className="form-error" role="alert">{error}</p>}<button className="primary" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar no sistema'}</button></form></main>
}
