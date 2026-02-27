import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { getSlotsParaDia, getServicosVisiveis, getUsers, createAgendamento } from '../../services/api.js'
import { hoje } from '../../utils/dateUtils.js'
import { cn } from '../../utils/cn.js'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function AgendaPage() {
  const { user, isGerente, isConsultora } = useAuth()
  const [data, setData] = useState(hoje())
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => { carregarSlots() }, [data])

  async function carregarSlots() {
    setLoading(true)
    const s = await getSlotsParaDia(data)
    setSlots(s)
    setLoading(false)
  }

  function handleSlotClick(slot) {
    if (slot.estado !== 'disponivel') return
    setSelectedSlot(slot)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal-900">Agenda</h2>
          <p className="font-body text-sm text-charcoal-500">Visualize e gerencie os horarios disponiveis</p>
        </div>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="px-4 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 bg-white"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.horario}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.estado !== 'disponivel'}
              className={cn(
                'p-4 rounded-xl border-2 text-center transition-all font-body',
                slot.estado === 'disponivel' && 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:shadow-md cursor-pointer',
                slot.estado === 'bloqueado' && 'border-charcoal-200 bg-charcoal-50 opacity-50 cursor-not-allowed',
                slot.estado === 'ocupado' && 'border-rosa-200 bg-rosa-50 cursor-not-allowed',
              )}
            >
              <div className="font-bold text-lg text-charcoal-900">{slot.horario}</div>
              <Badge
                variant={slot.estado === 'disponivel' ? 'success' : slot.estado === 'bloqueado' ? 'default' : 'rosa'}
              >
                {slot.estado === 'disponivel' ? 'Livre' : slot.estado === 'bloqueado' ? 'Bloqueado' : 'Ocupado'}
              </Badge>
              {slot.agendamento && (
                <div className="mt-2 text-xs text-charcoal-500">
                  {slot.agendamento.participantes[0]?.nome}
                </div>
              )}
            </button>
          ))}
          {slots.length === 0 && (
            <div className="col-span-full text-center py-12 font-body text-charcoal-400">
              Nenhum slot configurado para este dia.
            </div>
          )}
        </div>
      )}

      <AgendarModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={selectedSlot}
        data={data}
        user={user}
        isGerente={isGerente}
        isConsultora={isConsultora}
        onSuccess={() => { setModalOpen(false); carregarSlots() }}
      />
    </div>
  )
}

function AgendarModal({ open, onClose, slot, data, user, isGerente, isConsultora, onSuccess }) {
  const [servicos, setServicos] = useState([])
  const [users, setUsers] = useState([])
  const [servicoId, setServicoId] = useState('')
  const [tipo, setTipo] = useState('individual')
  const [participantesIds, setParticipantesIds] = useState([])
  const [observacao, setObservacao] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      getServicosVisiveis(isConsultora || isGerente).then(setServicos)
      getUsers().then((u) => setUsers(u.filter((x) => x.ativo && x.perfil === 'cliente')))
      setServicoId('')
      setTipo('individual')
      setParticipantesIds([])
      setObservacao('')
    }
  }, [open, isConsultora, isGerente])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!servicoId) { toast.error('Selecione um servico'); return }
    let parts = []
    if (isGerente) {
      if (tipo === 'individual') {
        if (participantesIds.length !== 1) { toast.error('Selecione 1 participante para individual'); return }
      } else {
        if (participantesIds.length < 2) { toast.error('Turma precisa de no minimo 2 participantes'); return }
        if (participantesIds.length > 5) { toast.error('Turma aceita no maximo 5 participantes'); return }
      }
      parts = participantesIds.map((id) => {
        const u = users.find((x) => x.id === id)
        return { userId: id, nome: u?.nome || '' }
      })
    } else {
      parts = [{ userId: user.id, nome: user.nome }]
    }

    setSubmitting(true)
    try {
      await createAgendamento({
        tipo,
        servicoId,
        data,
        horaInicio: slot.horario,
        participantes: parts,
        observacao,
        criadoPor: user.id,
      })
      toast.success('Agendamento criado com sucesso!')
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
    setSubmitting(false)
  }

  function toggleParticipante(id) {
    setParticipantesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={`Agendar - ${slot?.horario || ''}`} size="md">
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
          <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Tipo</label>
          <div className="flex gap-3">
            {['individual', 'turma'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 font-body text-sm font-medium capitalize transition-colors',
                  tipo === t ? 'border-rosa-500 bg-rosa-50 text-rosa-700' : 'border-charcoal-200 text-charcoal-500 hover:border-charcoal-300'
                )}
              >
                {t} ({t === 'individual' ? '1h' : '2h'})
              </button>
            ))}
          </div>
        </div>

        {isGerente && (
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">
              Participantes {tipo === 'turma' ? '(min 2, max 5)' : '(selecione 1)'}
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
          </div>
        )}

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
          <Button type="submit" disabled={submitting}>{submitting ? 'Salvando...' : 'Confirmar Agendamento'}</Button>
        </div>
      </form>
    </Modal>
  )
}
