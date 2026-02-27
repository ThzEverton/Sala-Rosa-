import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { getFinanceiroDoUsuario } from '../../services/api.js'
import { formatarData, formatarMoeda } from '../../utils/dateUtils.js'
import Badge from '../../components/ui/Badge.jsx'

export default function MeuFinanceiroPage() {
  const { user } = useAuth()
  const [financeiro, setFinanceiro] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFinanceiroDoUsuario(user.id).then((f) => { setFinanceiro(f); setLoading(false) })
  }, [user.id])

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const totalPago = financeiro.filter((f) => f.status === 'pago').reduce((s, f) => s + f.valor, 0)
  const totalPendente = financeiro.filter((f) => f.status === 'pendente').reduce((s, f) => s + f.valor, 0)

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-charcoal-900 mb-6">Meu Financeiro</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-emerald-600 mb-1">Total Pago</p>
          <p className="font-heading text-2xl font-bold text-emerald-700">{formatarMoeda(totalPago)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-amber-600 mb-1">Total Pendente</p>
          <p className="font-heading text-2xl font-bold text-amber-700">{formatarMoeda(totalPendente)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Descricao</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Valor</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Pagamento</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {financeiro.sort((a, b) => b.data.localeCompare(a.data)).map((f) => (
                <tr key={f.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm text-charcoal-700">{formatarData(f.data)}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-900">{f.descricao}</td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-charcoal-900 text-right">{formatarMoeda(f.valor)}</td>
                  <td className="px-4 py-3 text-center font-body text-sm text-charcoal-500">{f.formaPagamento || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={f.status === 'pago' ? 'success' : 'warning'}>{f.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {financeiro.length === 0 && (
            <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhum lancamento encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
