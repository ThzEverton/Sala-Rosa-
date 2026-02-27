import { useState, useEffect } from 'react'
import { getServicos, createServico, updateServico } from '../../services/api.js'
import { formatarMoeda } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function ServicosAdminPage() {
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', duracao: 60, exclusivoParaConsultora: false })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const s = await getServicos()
    setServicos(s)
    setLoading(false)
  }

  function openNew() {
    setEditItem(null)
    setForm({ nome: '', descricao: '', preco: '', duracao: 60, exclusivoParaConsultora: false })
    setModalOpen(true)
  }

  function openEdit(s) {
    setEditItem(s)
    setForm({ nome: s.nome, descricao: s.descricao, preco: s.preco, duracao: s.duracao, exclusivoParaConsultora: s.exclusivoParaConsultora })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.preco) { toast.error('Preencha nome e preco'); return }
    try {
      if (editItem) {
        await updateServico(editItem.id, { ...form, preco: Number(form.preco), duracao: Number(form.duracao) })
        toast.success('Servico atualizado')
      } else {
        await createServico({ ...form, preco: Number(form.preco), duracao: Number(form.duracao) })
        toast.success('Servico criado')
      }
      setModalOpen(false)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleToggle(s) {
    await updateServico(s.id, { ativo: !s.ativo })
    toast.success(s.ativo ? 'Servico desativado' : 'Servico ativado')
    carregar()
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">Servicos</h2>
        <Button onClick={openNew}>Novo Servico</Button>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Descricao</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Preco</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Duracao</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Exclusivo</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {servicos.map((s) => (
                <tr key={s.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">{s.nome}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-500 max-w-xs truncate">{s.descricao}</td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-charcoal-900 text-right">{formatarMoeda(s.preco)}</td>
                  <td className="px-4 py-3 font-body text-sm text-center text-charcoal-600">{s.duracao} min</td>
                  <td className="px-4 py-3 text-center">
                    {s.exclusivoParaConsultora && <Badge variant="rosa">Exclusivo</Badge>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={s.ativo ? 'success' : 'danger'}>{s.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(s)} className={s.ativo ? 'text-red-500' : 'text-emerald-500'}>
                        {s.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Editar Servico' : 'Novo Servico'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Nome</label>
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Descricao</label>
            <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 resize-none" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Preco (R$)</label>
              <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
            </div>
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Duracao (min)</label>
              <select value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.exclusivoParaConsultora} onChange={(e) => setForm({ ...form, exclusivoParaConsultora: e.target.checked })} className="rounded border-charcoal-300 text-rosa-500 focus:ring-rosa-300" />
            <span className="font-body text-sm text-charcoal-700">Exclusivo para Consultoras</span>
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editItem ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
