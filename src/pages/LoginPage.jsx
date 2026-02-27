import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import { toast } from '../components/ui/Toast.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = login(email, senha)
      if (!res.ok) {
        toast.error(res.message)
        return
      }
      toast.success('Bem-vinda!')
      navigate('/app', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rosa-500 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-heading font-bold text-xl">SR</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-2">Entrar</h1>
          <p className="font-body text-charcoal-500 text-sm">Use seu e-mail e senha</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-charcoal-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm text-charcoal-700 block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="font-body text-sm text-charcoal-700 block mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
                placeholder="••••••••"
              />
            </div>

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="flex justify-between pt-2">
              <span className="font-body text-xs text-charcoal-500">Não tem conta?</span>
              <Link to="/register" className="font-body text-xs text-rosa-600 hover:underline">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}