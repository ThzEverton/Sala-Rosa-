import { useState, useEffect } from 'react'
import { getMovimentacoes, getProdutos, createMovimentacao } from '../../services/api.js'
import { formatarData, hoje } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ produtoId: '', tipo: 'entrada', quantidade: 1, observacao: '' })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [m, p] = await Promise.all([getMovimentacoes(), getProdutos()])
    setMovimentacoes(m)
    setProdutos(p)
    setLoading(false)
  }

  function getProdutoNome(id) {
    return produtos.find((p) => p.id === id)?.nome || id
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.produtoId) { toast.error('Selecione um produto'); return }
    try {
      await createMovimentacao({
        ...form,
        quantidade: form.tipo === 'saida' ? form.quantidade : form.tipo === 'ajuste' ? Number(form.quantidade) : form.quantidade,
        data: hoje(),
        vendaId: null,
      })
      toast.success('Movimentacao registrada')
      setModalOpen(false)
      setForm({ produtoId: '', tipo: 'entrada', quantidade: 1, observacao: '' })
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const sorted = [...movimentacoes].sort((a, b) => b.data.localeCompare(a.data))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">Movimentacoes de Estoque</h2>
        <Button onClick={() => setModalOpen(true)}>Nova Movimentacao</Button>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Observacao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {sorted.map((m) => (
                <tr key={m.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm text-charcoal-700">{formatarData(m.data)}</td>
                  <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">{getProdutoNome(m.produtoId)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={m.tipo === 'entrada' ? 'success' : m.tipo === 'saida' ? 'danger' : 'warning'}>
                      {m.tipo}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-center text-charcoal-900">{m.quantidade}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-500">{m.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhuma movimentacao.</p>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Movimentacao">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Produto</label>
            <select value={form.produtoId} onChange={(e) => setForm({ ...form, produtoId: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
              <option value="">Selecione...</option>
              {produtos.filter((p) => p.ativo).map((p) => (
                <option key={p.id} value={p.id}>{p.nome} (estoque: {p.estoqueAtual})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="entrada">Entrada</option>
                <option value="saida">Saida</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Quantidade</label>
              <input type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Observacao</label>
            <input type="text" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" placeholder="Opcional..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
