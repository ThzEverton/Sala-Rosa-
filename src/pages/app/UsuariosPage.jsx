import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, toggleUserAtivo } from '../../services/api.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function UsuariosPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', perfil: 'cliente', isConsultora: false })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const u = await getUsers()
    setUsers(u)
    setLoading(false)
  }

  function openNew() {
    setEditUser(null)
    setForm({ nome: '', email: '', telefone: '', perfil: 'cliente', isConsultora: false })
    setModalOpen(true)
  }

  function openEdit(u) {
    setEditUser(u)
    setForm({ nome: u.nome, email: u.email, telefone: u.telefone, perfil: u.perfil, isConsultora: u.isConsultora })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.email) { toast.error('Preencha nome e email'); return }
    try {
      if (editUser) {
        await updateUser(editUser.id, form)
        toast.success('Usuario atualizado')
      } else {
        await createUser(form)
        toast.success('Usuario criado')
      }
      setModalOpen(false)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleToggle(u) {
    await toggleUserAtivo(u.id)
    toast.success(u.ativo ? 'Usuario desativado' : 'Usuario ativado')
    carregar()
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">Usuarios</h2>
        <Button onClick={openNew}>Novo Usuario</Button>
      </div>

      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Telefone</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Perfil</th>
                <th className="px-4 py-3 text-center font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-charcoal-50/50">
                  <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">
                    {u.nome}
                    {u.isConsultora && <Badge variant="rosa" className="ml-2">Consultora</Badge>}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-600">{u.email}</td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal-600">{u.telefone}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.perfil === 'gerente' ? 'info' : 'default'}>{u.perfil}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.ativo ? 'success' : 'danger'}>{u.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(u)} className={u.ativo ? 'text-red-500 hover:text-red-700' : 'text-emerald-500 hover:text-emerald-700'}>
                        {u.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Editar Usuario' : 'Novo Usuario'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Nome</label>
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Telefone</label>
            <input type="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Perfil</label>
              <select value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value="cliente">Cliente</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isConsultora} onChange={(e) => setForm({ ...form, isConsultora: e.target.checked })} className="rounded border-charcoal-300 text-rosa-500 focus:ring-rosa-300" />
                <span className="font-body text-sm text-charcoal-700">Consultora</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editUser ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
