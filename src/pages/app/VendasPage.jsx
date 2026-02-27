import { useState, useEffect } from 'react'
import { getVendas, getServicos, getProdutos, createVenda } from '../../services/api.js'
import { formatarData, formatarMoeda, hoje } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function VendasPage() {
  const [vendas, setVendas] = useState([])
  const [servicos, setServicos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [v, s, p] = await Promise.all([getVendas(), getServicos(), getProdutos()])
    setVendas(v)
    setServicos(s)
    setProdutos(p)
    setLoading(false)
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">Vendas</h2>
        <Button onClick={() => setModalOpen(true)}>Nova Venda</Button>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Itens</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {vendas.map((v) => (
                <tr key={v.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">{v.id}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-700">{formatarData(v.data)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {v.itens.map((item, i) => (
                        <Badge key={i} variant={item.tipo === 'servico' ? 'rosa' : 'info'}>
                          {item.nome} x{item.quantidade}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-charcoal-900 text-right">{formatarMoeda(v.valorTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendas.length === 0 && (
            <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhuma venda registrada.</p>
          )}
        </div>
      </div>

      <NovaVendaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        servicos={servicos}
        produtos={produtos}
        onSuccess={() => { setModalOpen(false); carregar() }}
      />
    </div>
  )
}

function NovaVendaModal({ open, onClose, servicos, produtos, onSuccess }) {
  const [itens, setItens] = useState([])
  const [submitting, setSubmitting] = useState(false)

  function addItem() {
    setItens([...itens, { tipo: 'produto', referenciaId: '', nome: '', quantidade: 1, valorUnitario: 0 }])
  }

  function updateItem(idx, field, value) {
    const newItens = [...itens]
    newItens[idx][field] = value
    if (field === 'referenciaId') {
      const list = newItens[idx].tipo === 'produto' ? produtos : servicos
      const found = list.find((x) => x.id === value)
      if (found) {
        newItens[idx].nome = found.nome
        newItens[idx].valorUnitario = found.preco
      }
    }
    setItens(newItens)
  }

  function removeItem(idx) {
    setItens(itens.filter((_, i) => i !== idx))
  }

  const valorTotal = itens.reduce((s, i) => s + i.valorUnitario * i.quantidade, 0)

  async function handleSubmit(e) {
    e.preventDefault()
    if (itens.length === 0) { toast.error('Adicione pelo menos 1 item'); return }
    setSubmitting(true)
    try {
      await createVenda({ data: hoje(), itens, valorTotal, atendimentoId: null, criadoPor: 'u1' })
      toast.success('Venda registrada com sucesso!')
      setItens([])
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
    setSubmitting(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova Venda" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {itens.map((item, idx) => (
          <div key={idx} className="flex flex-wrap items-end gap-3 p-3 bg-charcoal-50 rounded-lg">
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Tipo</label>
              <select value={item.tipo} onChange={(e) => { updateItem(idx, 'tipo', e.target.value); updateItem(idx, 'referenciaId', '') }} className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="produto">Produto</option>
                <option value="servico">Servico</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="font-body text-xs text-charcoal-500 block mb-1">Item</label>
              <select value={item.referenciaId} onChange={(e) => updateItem(idx, 'referenciaId', e.target.value)} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="">Selecione...</option>
                {(item.tipo === 'produto' ? produtos : servicos).filter((x) => x.ativo).map((x) => (
                  <option key={x.id} value={x.id}>{x.nome} - {formatarMoeda(x.preco)}</option>
                ))}
              </select>
            </div>
            <div className="w-20">
              <label className="font-body text-xs text-charcoal-500 block mb-1">Qtd</label>
              <input type="number" min="1" value={item.quantidade} onChange={(e) => updateItem(idx, 'quantidade', Number(e.target.value))} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
            <div className="font-body text-sm font-medium text-charcoal-900 py-2">{formatarMoeda(item.valorUnitario * item.quantidade)}</div>
            <button type="button" onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addItem}>Adicionar Item</Button>

        <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
          <span className="font-heading text-lg font-bold text-charcoal-900">Total: {formatarMoeda(valorTotal)}</span>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Salvando...' : 'Registrar Venda'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
