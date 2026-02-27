import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { getAgendamentos, getFinanceiro, getProdutos } from '../../services/api.js'
import { formatarMoeda, formatarData, hoje } from '../../utils/dateUtils.js'
import Badge from '../../components/ui/Badge.jsx'

export default function DashboardPage() {
  const { user, isGerente, isConsultora } = useAuth()
  const [agendamentos, setAgendamentos] = useState([])
  const [financ, setFinanc] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAgendamentos(), getFinanceiro(), getProdutos()]).then(([ag, fi, pr]) => {
      setAgendamentos(ag)
      setFinanc(fi)
      setProdutos(pr)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const hj = hoje()
  const meusAg = isGerente ? agendamentos : agendamentos.filter((a) => a.participantes.some((p) => p.userId === user.id))
  const agHoje = agendamentos.filter((a) => a.data === hj && a.status !== 'cancelado')
  const meusProximos = meusAg.filter((a) => a.data >= hj && a.status !== 'cancelado').sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio))
  const meuFinanc = isGerente ? financ : financ.filter((f) => f.userId === user.id)
  const pendentes = meuFinanc.filter((f) => f.status === 'pendente')
  const vendasHoje = financ.filter((f) => f.data === hj && f.vendaId && f.status === 'pago')
  const receitaMes = financ.filter((f) => f.status === 'pago').reduce((s, f) => s + f.valor, 0)
  const estoqueBaixo = produtos.filter((p) => p.estoqueAtual <= p.estoqueMinimo)

  if (isGerente) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Agendamentos Hoje" value={agHoje.length} color="rosa" />
          <Card title="Vendas Hoje (pago)" value={formatarMoeda(vendasHoje.reduce((s, f) => s + f.valor, 0))} color="green" />
          <Card title="Estoque Baixo" value={estoqueBaixo.length} color={estoqueBaixo.length > 0 ? 'amber' : 'green'} />
          <Card title="Receita do Mes (pago)" value={formatarMoeda(receitaMes)} color="blue" />
        </div>

        <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100">
            <h3 className="font-heading font-semibold text-charcoal-900">Proximos Agendamentos</h3>
          </div>
          <div className="divide-y divide-charcoal-50">
            {meusProximos.slice(0, 6).map((a) => (
              <div key={a.id} className="px-6 py-3 flex items-center gap-4">
                <div className="text-center shrink-0 w-14">
                  <div className="font-body text-xs text-charcoal-400">{formatarData(a.data)}</div>
                  <div className="font-body font-bold text-charcoal-900">{a.horaInicio}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-charcoal-900 truncate">
                    {a.participantes.map((p) => p.nome).join(', ')}
                  </p>
                  <p className="font-body text-xs text-charcoal-400">{a.tipo === 'turma' ? 'Turma' : 'Individual'}</p>
                </div>
                <Badge variant={a.status === 'confirmado' ? 'success' : a.status === 'pendente' ? 'warning' : 'default'}>
                  {a.status}
                </Badge>
              </div>
            ))}
            {meusProximos.length === 0 && (
              <p className="px-6 py-8 text-center font-body text-sm text-charcoal-400">Nenhum agendamento proximo.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Cliente / Consultora
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-1">
          Ola, {user.nome.split(' ')[0]}!
        </h2>
        <p className="font-body text-charcoal-500 text-sm">
          {isConsultora ? 'Consultora' : 'Cliente'} - Confira seu resumo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card title="Proximos Agendamentos" value={meusProximos.length} color="rosa" />
        <Card title="Pagamentos Pendentes" value={pendentes.length} color={pendentes.length > 0 ? 'amber' : 'green'} />
        <Card title="Total Historico" value={meusAg.length} color="blue" />
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal-100">
          <h3 className="font-heading font-semibold text-charcoal-900">Meus Proximos Agendamentos</h3>
        </div>
        <div className="divide-y divide-charcoal-50">
          {meusProximos.slice(0, 5).map((a) => (
            <div key={a.id} className="px-6 py-3 flex items-center gap-4">
              <div className="text-center shrink-0 w-14">
                <div className="font-body text-xs text-charcoal-400">{formatarData(a.data)}</div>
                <div className="font-body font-bold text-charcoal-900">{a.horaInicio}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-charcoal-900">{a.tipo === 'turma' ? 'Turma' : 'Individual'}</p>
              </div>
              <Badge variant={a.status === 'confirmado' ? 'success' : 'warning'}>{a.status}</Badge>
            </div>
          ))}
          {meusProximos.length === 0 && (
            <p className="px-6 py-8 text-center font-body text-sm text-charcoal-400">Nenhum agendamento proximo.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, color }) {
  const colors = {
    rosa: 'bg-rosa-50 border-rosa-200 text-rosa-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="font-body text-xs font-medium uppercase tracking-wider opacity-80 mb-1">{title}</p>
      <p className="font-heading text-2xl font-bold">{value}</p>
    </div>
  )
}
