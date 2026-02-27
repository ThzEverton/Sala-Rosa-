import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { getTurmasAbertas, getAgendamentoById, entrarNaTurma, getServicos, getServicosVisiveis, getUsers, createAgendamento, getSlotsParaDia } from '../../services/api.js'
import { formatarData, formatarMoeda, hoje } from '../../utils/dateUtils.js'
import { cn } from '../../utils/cn.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function TurmasPage() {
  const { user, isGerente, isConsultora } = useAuth()
  const [turmas, setTurmas] = useState([])
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [idTurma, setIdTurma] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [criarModalOpen, setCriarModalOpen] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [t, sv] = await Promise.all([getTurmasAbertas(), getServicos()])
    setTurmas(t)
    setServicos(sv)
    setLoading(false)
  }

  function getServicoNome(id) {
    return servicos.find((s) => s.id === id)?.nome || 'Servico'
  }

  function getServicoPreco(id) {
    return servicos.find((s) => s.id === id)?.preco || 0
  }

  function jaParticipa(turma) {
    return turma.participantes.some((p) => p.userId === user.id)
  }

  async function handleEntrar(turma) {
    setEntrando(true)
    try {
      await entrarNaTurma(turma.id, user.id, user.nome)
      toast.success('Voce entrou na turma com sucesso!')
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
    setEntrando(false)
  }

  async function handleEntrarPorId() {
    const id = idTurma.trim()
    if (!id) { toast.error('Digite o ID da turma'); return }
    setEntrando(true)
    try {
      const turma = await getAgendamentoById(id)
      if (!turma) { toast.error('Turma nao encontrada'); setEntrando(false); return }
      if (turma.tipo !== 'turma') { toast.error('Este ID nao e de uma turma'); setEntrando(false); return }
      await entrarNaTurma(id, user.id, user.nome)
      toast.success('Voce entrou na turma com sucesso!')
      setIdTurma('')
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
    setEntrando(false)
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal-900">Turmas</h2>
          <p className="font-body text-sm text-charcoal-500">Participe de aulas e workshops em grupo</p>
        </div>
        <Button onClick={() => setCriarModalOpen(true)}>Criar Turma</Button>
      </div>

      {/* Entrar por ID */}
      <div className="bg-white rounded-xl border border-charcoal-100 p-6 mb-6">
        <h3 className="font-body font-semibold text-charcoal-900 mb-3">Entrar em uma turma por ID</h3>
        <p className="font-body text-sm text-charcoal-500 mb-4">Recebeu um ID de turma? Cole aqui para entrar diretamente.</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={idTurma}
            onChange={(e) => setIdTurma(e.target.value)}
            placeholder="Ex: a2, a5..."
            className="flex-1 px-4 py-2.5 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
          />
          <Button onClick={handleEntrarPorId} disabled={entrando}>
            {entrando ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </div>

      {/* Turmas Abertas */}
      <h3 className="font-body font-semibold text-charcoal-900 mb-4">Turmas Abertas</h3>

      {turmas.length === 0 ? (
        <div className="bg-white rounded-xl border border-charcoal-100 p-12 text-center">
          <p className="font-body text-charcoal-400">Nenhuma turma aberta no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turmas.map((turma) => {
            const participa = jaParticipa(turma)
            const cheia = turma.participantes.length >= 5
            return (
              <div key={turma.id} className="bg-white rounded-xl border border-charcoal-100 p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-body font-semibold text-charcoal-900">{getServicoNome(turma.servicoId)}</h4>
                    <p className="font-body text-xs text-charcoal-400 mt-0.5">ID: {turma.id}</p>
                  </div>
                  <Badge variant="info">Turma</Badge>
                </div>

                <div className="flex flex-col gap-1.5 font-body text-sm text-charcoal-600">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatarData(turma.data)} as {turma.horaInicio}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                    {turma.participantes.length}/5 participantes
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                    {formatarMoeda(getServicoPreco(turma.servicoId))}
                  </div>
                </div>

                {turma.participantes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {turma.participantes.map((p) => (
                      <span
                        key={p.userId}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-body',
                          p.userId === user.id ? 'bg-rosa-100 text-rosa-700 font-medium' : 'bg-charcoal-100 text-charcoal-600'
                        )}
                      >
                        {p.nome}{p.userId === user.id ? ' (voce)' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {turma.observacao && (
                  <p className="font-body text-xs text-charcoal-400 italic">{turma.observacao}</p>
                )}

                <div className="mt-auto pt-2">
                  {participa ? (
                    <Badge variant="success">Voce ja esta nesta turma</Badge>
                  ) : cheia ? (
                    <Badge variant="danger">Turma cheia</Badge>
                  ) : (
                    <Button size="sm" onClick={() => handleEntrar(turma)} disabled={entrando} className="w-full">
                      Entrar nesta turma
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CriarTurmaModal
        open={criarModalOpen}
        onClose={() => setCriarModalOpen(false)}
        user={user}
        isConsultora={isConsultora}
        isGerente={isGerente}
        onSuccess={() => { setCriarModalOpen(false); carregar() }}
      />
    </div>
  )
}

function CriarTurmaModal({ open, onClose, user, isConsultora, isGerente, onSuccess }) {
  const [servicos, setServicos] = useState([])
  const [users, setUsers] = useState([])
  const [servicoId, setServicoId] = useState('')
  const [data, setData] = useState(hoje())
  const [slots, setSlots] = useState([])
  const [horaInicio, setHoraInicio] = useState('')
  const [observacao, setObservacao] = useState('')
  const [participantesIds, setParticipantesIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (open) {
      getServicosVisiveis(isConsultora || isGerente).then(setServicos)
      getUsers().then((u) => setUsers(u.filter((x) => x.ativo && x.perfil === 'cliente' && x.id !== user.id)))
      setServicoId('')
      setData(hoje())
      setHoraInicio('')
      setObservacao('')
      setParticipantesIds([])
    }
  }, [open, isConsultora, isGerente, user.id])

  useEffect(() => {
    if (open && data) {
      setLoadingSlots(true)
      getSlotsParaDia(data).then((s) => {
        setSlots(s.filter((sl) => sl.estado === 'disponivel'))
        setLoadingSlots(false)
      })
    }
  }, [open, data])

  function toggleParticipante(id) {
    setParticipantesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!servicoId) { toast.error('Selecione um servico'); return }
    if (!horaInicio) { toast.error('Selecione um horario'); return }

    const allParts = [
      { userId: user.id, nome: user.nome },
      ...participantesIds.map((id) => {
        const u = users.find((x) => x.id === id)
        return { userId: id, nome: u?.nome || '' }
      }),
    ]

    if (allParts.length < 2) {
      toast.error('Turma precisa de no minimo 2 participantes (voce + pelo menos 1)')
      return
    }
    if (allParts.length > 5) {
      toast.error('Turma aceita no maximo 5 participantes')
      return
    }

    setSubmitting(true)
    try {
      await createAgendamento({
        tipo: 'turma',
        servicoId,
        data,
        horaInicio,
        participantes: allParts,
        observacao,
        criadoPor: user.id,
      })
      toast.success('Turma criada com sucesso! Compartilhe o ID com outras pessoas.')
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
    setSubmitting(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Criar Turma" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Servico</label>
          <select
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
          >
            <option value="">Selecione...</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} {s.exclusivoParaConsultora ? '(Exclusivo)' : ''} - R$ {s.preco}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
          />
        </div>

        <div>
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Horario</label>
          {loadingSlots ? (
            <p className="font-body text-sm text-charcoal-400">Carregando slots...</p>
          ) : slots.length === 0 ? (
            <p className="font-body text-sm text-charcoal-400">Nenhum horario disponivel nesta data.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((sl) => (
                <button
                  key={sl.horario}
                  type="button"
                  onClick={() => setHoraInicio(sl.horario)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border-2 font-body text-sm font-medium transition-colors',
                    horaInicio === sl.horario
                      ? 'border-rosa-500 bg-rosa-50 text-rosa-700'
                      : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-300'
                  )}
                >
                  {sl.horario}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">
            Convidar participantes (voce ja esta incluso - min 2 total, max 5)
          </label>
          <div className="max-h-40 overflow-y-auto border border-charcoal-200 rounded-lg divide-y divide-charcoal-50">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-3 px-3 py-2 hover:bg-charcoal-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={participantesIds.includes(u.id)}
                  onChange={() => toggleParticipante(u.id)}
                  className="rounded border-charcoal-300 text-rosa-500 focus:ring-rosa-300"
                />
                <span className="font-body text-sm text-charcoal-700">{u.nome}</span>
                {u.isConsultora && <Badge variant="rosa">Consultora</Badge>}
              </label>
            ))}
          </div>
          <p className="font-body text-xs text-charcoal-400 mt-1">
            Participantes selecionados: {participantesIds.length + 1} (voce + {participantesIds.length})
          </p>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Observacao</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 resize-none"
            placeholder="Opcional..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'Criando...' : 'Criar Turma'}</Button>
        </div>
      </form>
    </Modal>
  )
}
