import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import {
  getAgendamentos,
  getAgendamentosDoUsuario,
  cancelarAgendamento,
  remarcarAgendamento,
  getServicos,
} from '../../services/api.js'
import { formatarData, podeCancelarOuRemarcar } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function AgendamentosPage() {
  const { user, isGerente } = useAuth()

  const [agendamentos, setAgendamentos] = useState([])
  const [servicos, setServicos] = useState([])

  const [filtroData, setFiltroData] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const [loading, setLoading] = useState(true)

  const [remarcarModal, setRemarcarModal] = useState(null)
  const [novaData, setNovaData] = useState('')
  const [novaHora, setNovaHora] = useState('')

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function carregar() {
    setLoading(true)
    try {
      const [ag, sv] = await Promise.all([
        isGerente ? getAgendamentos() : getAgendamentosDoUsuario(user.id),
        getServicos(),
      ])
      setAgendamentos(ag || [])
      setServicos(sv || [])
    } finally {
      setLoading(false)
    }
  }

  const filtered = (agendamentos || [])
    .filter((a) => {
      if (filtroData && a.data !== filtroData) return false
      if (filtroTipo && a.tipo !== filtroTipo) return false
      if (filtroStatus && a.status !== filtroStatus) return false
      return true
    })
    .sort((a, b) => b.data.localeCompare(a.data) || b.horaInicio.localeCompare(a.horaInicio))

  function getServicoNome(id) {
    return servicos.find((s) => s.id === id)?.nome || 'Servico'
  }

  async function handleCancelar(ag) {
    if (!podeCancelarOuRemarcar(ag.data)) {
      toast.error('Cancelamento permitido apenas ate 23:59 de D-2')
      return
    }
    try {
      await cancelarAgendamento(ag.id)
      toast.success('Agendamento cancelado')
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleRemarcar() {
    if (!novaData || !novaHora) {
      toast.error('Preencha data e hora')
      return
    }
    try {
      await remarcarAgendamento(remarcarModal.id, novaData, novaHora)
      toast.success('Agendamento remarcado')
      setRemarcarModal(null)
      carregar()
    } catch (err) {
      toast.error(err.message)
    }
  }

  // REGRA: SOMENTE GERENTE ENVIA LEMBRETE
  function handleLembrete(ag) {
    if (!isGerente) {
      toast.error('Apenas a gerente pode enviar lembretes.')
      return
    }

    const clientes = (ag.participantes || []).filter((p) => p.userId !== user.id)

    const msgBase =
      `Olá! Lembrete: você tem um agendamento na Sala Rosa ` +
      `no dia ${formatarData(ag.data)} às ${ag.horaInicio}. Até lá!`

    // sem telefone no mock: abre WhatsApp com texto (você escolhe o contato)
    if (clientes.length <= 1) {
      window.open(`https://wa.me/?text=${encodeURIComponent(msgBase)}`, '_blank')
      return
    }

    // turma: abre 1 aba por cliente
    clientes.forEach(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(msgBase)}`, '_blank')
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="font-body text-charcoal-400">Carregando...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-900">
          {isGerente ? 'Agendamentos' : 'Meus Agendamentos'}
        </h2>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 bg-white"
        />

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 bg-white"
        >
          <option value="">Todos os tipos</option>
          <option value="individual">Individual</option>
          <option value="turma">Turma</option>
        </select>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300 bg-white"
        >
          <option value="">Todos os status</option>
          <option value="confirmado">Confirmado</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluido</option>
        </select>

        {(filtroData || filtroTipo || filtroStatus) && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              setFiltroData('')
              setFiltroTipo('')
              setFiltroStatus('')
            }}
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Horario</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Servico</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Participantes</th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-charcoal-50">
              {filtered.map((a) => {
                const podeAlterar =
                  podeCancelarOuRemarcar(a.data) &&
                  a.status !== 'cancelado' &&
                  a.status !== 'concluido'

                return (
                  <tr key={a.id} className="hover:bg-charcoal-50/50">
                    <td className="px-4 py-3 font-body text-sm text-charcoal-700">{formatarData(a.data)}</td>

                    <td className="px-4 py-3 font-body text-sm font-medium text-charcoal-900">
                      {a.horaInicio} - {a.horaFim}
                    </td>

                    <td className="px-4 py-3 font-body text-sm text-charcoal-700">{getServicoNome(a.servicoId)}</td>

                    <td className="px-4 py-3">
                      <Badge variant={a.tipo === 'turma' ? 'info' : 'default'}>{a.tipo}</Badge>
                    </td>

                    <td className="px-4 py-3 font-body text-sm text-charcoal-600">
                      {(a.participantes || []).map((p) => p.nome).join(', ')}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          a.status === 'confirmado'
                            ? 'success'
                            : a.status === 'cancelado'
                              ? 'danger'
                              : a.status === 'concluido'
                                ? 'info'
                                : 'warning'
                        }
                      >
                        {a.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {podeAlterar && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => {
                                setRemarcarModal(a)
                                setNovaData(a.data)
                                setNovaHora(a.horaInicio)
                              }}
                            >
                              Remarcar
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => handleCancelar(a)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          </>
                        )}

                        {!podeAlterar && a.status !== 'cancelado' && a.status !== 'concluido' && (
                          <span
                            className="font-body text-xs text-charcoal-400"
                            title="Cancelamento/remarcacao permitido apenas ate D-2"
                          >
                            Prazo expirado
                          </span>
                        )}

                        {/* SOMENTE GERENTE */}
                        {isGerente && (
                          <Button variant="ghost" size="sm" type="button" onClick={() => handleLembrete(a)}>
                            Lembrete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center py-12 font-body text-sm text-charcoal-400">Nenhum agendamento encontrado.</p>
          )}
        </div>
      </div>

      <Modal open={!!remarcarModal} onClose={() => setRemarcarModal(null)} title="Remarcar Agendamento">
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Nova Data</label>
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-charcoal-700 block mb-1">Novo Horario</label>
            <input
              type="time"
              value={novaHora}
              onChange={(e) => setNovaHora(e.target.value)}
              className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-rosa-300"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setRemarcarModal(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleRemarcar}>
              Confirmar Remarcacao
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}