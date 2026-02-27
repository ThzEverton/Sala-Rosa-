import { useState, useEffect } from 'react'
import { getProdutos, createProduto, updateProduto, getMovimentacoes, createMovimentacao } from '../../services/api.js'
import { formatarMoeda, formatarData, hoje } from '../../utils/dateUtils.js'
import { cn } from '../../utils/cn.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function ProdutosPage() {
  const [tab, setTab] = useState('produtos')
  const [produtos, setProdutos] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const [produtoModalOpen, setProdutoModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [produtoForm, setProdutoForm] = useState({ nome: '', unidade: 'un', estoqueAtual: 0, estoqueMinimo: 5, preco: '' })

  const [movModalOpen, setMovModalOpen] = useState(false)
  const [movForm, setMovForm] = useState({ produtoId: '', tipo: 'entrada', quantidade: 1, observacao: '' })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [p, m] = await Promise.all([getProdutos(), getMovimentacoes()])
    setProdutos(p)
    setMovimentacoes(m)
    setLoading(false)
  }

  // Produto handlers
  function openNewProduto() {
    setEditItem(null)
    setProdutoForm({ nome: '', unidade: 'un', estoqueAtual: 0, estoqueMinimo: 5, preco: '' })
    setProdutoModalOpen(true)
  }

  function openEditProduto(p) {
    setEditItem(p)
    setProdutoForm({ nome: p.nome, unidade: p.unidade, estoqueAtual: p.estoqueAtual, estoqueMinimo: p.estoqueMinimo, preco: p.preco })
    setProdutoModalOpen(true)
  }

  async function handleProdutoSubmit(e) {
    e.preventDefault()
    if (!produtoForm.nome || !produtoForm.preco) { toast.error('Preencha nome e preco'); return }
    try {
      const data = { ...produtoForm, preco: Number(produtoForm.preco), estoqueAtual: Number(produtoForm.estoqueAtual), estoqueMinimo: Number(produtoForm.estoqueMinimo) }
      if (editItem) {
        await updateProduto(editItem.id, data)
        toast.success('Produto atualizado')
      } else {
        await createProduto(data)
        toast.success('Produto criado')
      }
      setProdutoModalOpen(false)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Movimentacao handlers
  async function handleMovSubmit(e) {
    e.preventDefault()
    if (!movForm.produtoId) { toast.error('Selecione um produto'); return }
    try {
      await createMovimentacao({
        ...movForm,
        quantidade: Number(movForm.quantidade),
        data: hoje(),
        vendaId: null,
      })
      toast.success('Movimentacao registrada')
      setMovModalOpen(false)
      setMovForm({ produtoId: '', tipo: 'entrada', quantidade: 1, observacao: '' })
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  function getProdutoNome(id) {
    return produtos.find((p) => p.id === id)?.nome || id
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const estoqueBaixo = produtos.filter((p) => p.ativo && p.estoqueAtual <= p.estoqueMinimo)
  const sortedMov = [...movimentacoes].sort((a, b) => b.data.localeCompare(a.data))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">Produtos & Estoque</h2>
        <div className="flex gap-2">
          {tab === 'produtos' && <Button onClick={openNewProduto}>Novo Produto</Button>}
          {tab === 'movimentacoes' && <Button onClick={() => setMovModalOpen(true)}>Nova Movimentacao</Button>}
        </div>
      </div>

      {/* Estoque Baixo Alert */}
      {estoqueBaixo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-body font-semibold text-amber-800 mb-2">Produtos com estoque baixo</h3>
          <div className="flex flex-wrap gap-2">
            {estoqueBaixo.map((p) => (
              <Badge key={p.id} variant="warning">{p.nome}: {p.estoqueAtual}/{p.estoqueMinimo}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-charcoal-100 rounded-lg p-1 w-fit">
        {[
          { key: 'produtos', label: 'Produtos' },
          { key: 'movimentacoes', label: 'Movimentacoes' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-md font-body text-sm font-medium transition-colors',
              tab === t.key
                ? 'bg-white text-charcoal-900 shadow-sm'
                : 'text-charcoal-500 hover:text-charcoal-700'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Produtos */}
      {tab === 'produtos' && (
        <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Unidade</th>
                  <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Minimo</th>
                  <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Preco</th>
                  <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                {produtos.map((p) => {
                  const baixo = p.estoqueAtual <= p.estoqueMinimo
                  return (
                    <tr key={p.id} className="hover:bg-charcoal-50/50">
                      <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">{p.nome}</td>
                      <td className="px-4 py-3 font-body text-sm text-center text-charcoal-500">{p.unidade}</td>
                      <td className={`px-4 py-3 font-body text-sm font-bold text-center ${baixo ? 'text-red-600' : 'text-charcoal-900'}`}>{p.estoqueAtual}</td>
                      <td className="px-4 py-3 font-body text-sm text-center text-charcoal-500">{p.estoqueMinimo}</td>
                      <td className="px-4 py-3 font-body text-sm text-right text-charcoal-900">{formatarMoeda(p.preco)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={p.ativo ? (baixo ? 'warning' : 'success') : 'danger'}>
                          {!p.ativo ? 'Inativo' : baixo ? 'Estoque Baixo' : 'OK'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditProduto(p)}>Editar</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {produtos.length === 0 && (
              <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhum produto cadastrado.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Movimentacoes */}
      {tab === 'movimentacoes' && (
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
                {sortedMov.map((m) => (
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
            {sortedMov.length === 0 && (
              <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhuma movimentacao.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Produto */}
      <Modal open={produtoModalOpen} onClose={() => setProdutoModalOpen(false)} title={editItem ? 'Editar Produto' : 'Novo Produto'}>
        <form onSubmit={handleProdutoSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Nome</label>
            <input type="text" value={produtoForm.nome} onChange={(e) => setProdutoForm({ ...produtoForm, nome: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Unidade</label>
              <select value={produtoForm.unidade} onChange={(e) => setProdutoForm({ ...produtoForm, unidade: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="un">Unidade</option>
                <option value="kit">Kit</option>
                <option value="cx">Caixa</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Preco (R$)</label>
              <input type="number" step="0.01" value={produtoForm.preco} onChange={(e) => setProdutoForm({ ...produtoForm, preco: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Estoque Atual</label>
              <input type="number" value={produtoForm.estoqueAtual} onChange={(e) => setProdutoForm({ ...produtoForm, estoqueAtual: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Estoque Minimo</label>
              <input type="number" value={produtoForm.estoqueMinimo} onChange={(e) => setProdutoForm({ ...produtoForm, estoqueMinimo: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setProdutoModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editItem ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Movimentacao */}
      <Modal open={movModalOpen} onClose={() => setMovModalOpen(false)} title="Nova Movimentacao">
        <form onSubmit={handleMovSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Produto</label>
            <select value={movForm.produtoId} onChange={(e) => setMovForm({ ...movForm, produtoId: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
              <option value="">Selecione...</option>
              {produtos.filter((p) => p.ativo).map((p) => (
                <option key={p.id} value={p.id}>{p.nome} (estoque: {p.estoqueAtual})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Tipo</label>
              <select value={movForm.tipo} onChange={(e) => setMovForm({ ...movForm, tipo: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="entrada">Entrada</option>
                <option value="saida">Saida</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Quantidade</label>
              <input type="number" value={movForm.quantidade} onChange={(e) => setMovForm({ ...movForm, quantidade: Number(e.target.value) })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Observacao</label>
            <input type="text" value={movForm.observacao} onChange={(e) => setMovForm({ ...movForm, observacao: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" placeholder="Opcional..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setMovModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
