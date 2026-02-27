import { useState, useEffect } from 'react'
import { getFinanceiro, marcarComoPago } from '../../services/api.js'
import { formatarData, formatarMoeda } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function FinanceiroPage() {
  const [financeiro, setFinanceiro] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [pagarModal, setPagarModal] = useState(null)
  const [formaPgto, setFormaPgto] = useState('pix')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const f = await getFinanceiro()
    setFinanceiro(f)
    setLoading(false)
  }

  const filtered = financeiro.filter((f) => {
    if (filtroStatus && f.status !== filtroStatus) return false
    return true
  }).sort((a, b) => b.data.localeCompare(a.data))

  const totalPago = financeiro.filter((f) => f.status === 'pago').reduce((s, f) => s + f.valor, 0)
  const totalPendente = financeiro.filter((f) => f.status === 'pendente').reduce((s, f) => s + f.valor, 0)

  async function handlePagar() {
    try {
      await marcarComoPago(pagarModal.id, formaPgto)
      toast.success('Pagamento registrado!')
      setPagarModal(null)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-charcoal-900 mb-6">Financeiro</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-emerald-600 mb-1">Total Recebido</p>
          <p className="font-heading text-2xl font-bold text-emerald-700">{formatarMoeda(totalPago)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-amber-600 mb-1">Total Pendente</p>
          <p className="font-heading text-2xl font-bold text-amber-700">{formatarMoeda(totalPendente)}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 bg-white">
          <option value="">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
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
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm text-charcoal-700">{formatarData(f.data)}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-900">{f.descricao}</td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-charcoal-900 text-right">{formatarMoeda(f.valor)}</td>
                  <td className="px-4 py-3 text-center font-body text-sm text-charcoal-500">{f.formaPagamento || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={f.status === 'pago' ? 'success' : 'warning'}>{f.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {f.status === 'pendente' && (
                      <Button variant="ghost" size="sm" onClick={() => { setPagarModal(f); setFormaPgto('pix') }}>Marcar Pago</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhum lancamento encontrado.</p>
          )}
        </div>
      </div>

      <Modal open={!!pagarModal} onClose={() => setPagarModal(null)} title="Registrar Pagamento">
        <div className="flex flex-col gap-4">
          <p className="font-body text-sm text-charcoal-700">
            {pagarModal?.descricao} - <strong>{formatarMoeda(pagarModal?.valor)}</strong>
          </p>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Forma de Pagamento</label>
            <select value={formaPgto} onChange={(e) => setFormaPgto(e.target.value)} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartao</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setPagarModal(null)}>Cancelar</Button>
            <Button onClick={handlePagar}>Confirmar Pagamento</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
