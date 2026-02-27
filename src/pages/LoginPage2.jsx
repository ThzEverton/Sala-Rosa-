import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'

export default function LoginPage() {
  const [selectedPerfil, setSelectedPerfil] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const perfis = [
    { key: 'gerente', nome: 'Gerente', desc: 'Acesso total ao sistema', icon: 'G' },
    { key: 'cliente', nome: 'Cliente', desc: 'Agendar e acompanhar servicos', icon: 'C' },
    { key: 'consultora', nome: 'Consultora', desc: 'Cliente com servicos exclusivos', icon: 'CO' },
  ]

  function handleLogin() {
    if (!selectedPerfil) return
    login(selectedPerfil)
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rosa-500 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-heading font-bold text-xl">SR</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-2">Entrar na Sala Rosa</h1>
          <p className="font-body text-charcoal-500 text-sm">Selecione seu perfil para acessar o sistema</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-charcoal-100">
          <div className="flex flex-col gap-3 mb-6">
            {perfis.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPerfil(p.key)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${selectedPerfil === p.key
                  ? 'border-rosa-500 bg-rosa-50'
                  : 'border-charcoal-100 hover:border-rosa-200'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${selectedPerfil === p.key ? 'bg-rosa-500 text-white' : 'bg-charcoal-100 text-charcoal-600'
                  }`}>
                  {p.icon}
                </div>
                <div>
                  <span className="font-body font-medium text-charcoal-900 block">{p.nome}</span>
                  <span className="font-body text-xs text-charcoal-400">{p.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedPerfil}
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </div>

        <p className="text-center mt-6 font-body text-xs text-charcoal-400">
          Este e um sistema de demonstracao com dados mockados.
        </p>
      </div>
    </div>
  )
}
