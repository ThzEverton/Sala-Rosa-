import { useState, useEffect } from 'react'
import { getHorarioConfig, updateHorarioConfig, getExcecoesDia, setExcecaoDia, removeExcecaoDia, getSlotsParaDia, toggleBloqueioSlot, getBloqueiosSlot } from '../../services/api.js'
import { hoje, formatarData } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { toast } from '../../components/ui/Toast.jsx'
import { cn } from '../../utils/cn.js'

export default function HorariosPage() {
  const [config, setConfig] = useState(null)
  const [excecoes, setExcecoes] = useState([])
  const [dataSel, setDataSel] = useState(hoje())
  const [slots, setSlots] = useState([])
  const [excIni, setExcIni] = useState('')
  const [excFim, setExcFim] = useState('')
  const [loading, setLoading] = useState(true)
  const [editConfig, setEditConfig] = useState(false)
  const [newInicio, setNewInicio] = useState('')
  const [newFim, setNewFim] = useState('')
  const [newDuracao, setNewDuracao] = useState(60)

  useEffect(() => {
    carregarTudo()
  }, [])

  useEffect(() => {
    carregarSlotsDia()
  }, [dataSel])

  async function carregarTudo() {
    const [cfg, exc] = await Promise.all([getHorarioConfig(), getExcecoesDia()])
    setConfig(cfg)
    setExcecoes(exc)
    setNewInicio(cfg.horaInicioPadrao)
    setNewFim(cfg.horaFimPadrao)
    setNewDuracao(cfg.duracaoSlotMinutos)
    setLoading(false)
  }

  async function carregarSlotsDia() {
    const s = await getSlotsParaDia(dataSel)
    setSlots(s)
    const exc = await getExcecoesDia()
    setExcecoes(exc)
    const excDia = exc.find((e) => e.data === dataSel)
    setExcIni(excDia?.horaInicioExcecao || '')
    setExcFim(excDia?.horaFimExcecao || '')
  }

  async function salvarConfig() {
    await updateHorarioConfig({ horaInicioPadrao: newInicio, horaFimPadrao: newFim, duracaoSlotMinutos: Number(newDuracao) })
    setConfig({ horaInicioPadrao: newInicio, horaFimPadrao: newFim, duracaoSlotMinutos: Number(newDuracao) })
    setEditConfig(false)
    toast.success('Horario padrao atualizado')
    carregarSlotsDia()
  }

  async function aplicarExcecao() {
    await setExcecaoDia({ data: dataSel, horaInicioExcecao: excIni || null, horaFimExcecao: excFim || null })
    toast.success('Excecao aplicada para ' + formatarData(dataSel))
    carregarSlotsDia()
  }

  async function removerExcecao() {
    await removeExcecaoDia(dataSel)
    setExcIni('')
    setExcFim('')
    toast.success('Excecao removida')
    carregarSlotsDia()
  }

  async function handleToggleBloqueio(slot) {
    const bloqueado = await toggleBloqueioSlot(dataSel, slot.horario)
    toast.success(bloqueado ? `Slot ${slot.horario} bloqueado` : `Slot ${slot.horario} desbloqueado`)
    carregarSlotsDia()
  }

  if (loading) return <div className="flex items-center justify-center h-40"><span className="font-body text-charcoal-400">Carregando...</span></div>

  const excDia = excecoes.find((e) => e.data === dataSel)

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-charcoal-900 mb-6">Horarios & Bloqueios</h2>

      {/* Config Padrao */}
      <div className="bg-white rounded-xl border border-charcoal-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-charcoal-900">Horario Padrao</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditConfig(!editConfig)}>
            {editConfig ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
        {!editConfig ? (
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="font-body text-xs text-charcoal-400 block">Inicio</span>
              <span className="font-body font-medium text-charcoal-900">{config.horaInicioPadrao}</span>
            </div>
            <div>
              <span className="font-body text-xs text-charcoal-400 block">Fim</span>
              <span className="font-body font-medium text-charcoal-900">{config.horaFimPadrao}</span>
            </div>
            <div>
              <span className="font-body text-xs text-charcoal-400 block">Duracao do Slot</span>
              <span className="font-body font-medium text-charcoal-900">{config.duracaoSlotMinutos} min</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Inicio</label>
              <input type="time" value={newInicio} onChange={(e) => setNewInicio(e.target.value)} className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Fim</label>
              <input type="time" value={newFim} onChange={(e) => setNewFim(e.target.value)} className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Duracao (min)</label>
              <select value={newDuracao} onChange={(e) => setNewDuracao(e.target.value)} className="px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm">
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
            <Button onClick={salvarConfig}>Salvar</Button>
          </div>
        )}
      </div>

      {/* Excecao por dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-charcoal-100 p-6">
          <h3 className="font-heading font-semibold text-charcoal-900 mb-4">Excecao por Dia</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Data</label>
              <input type="date" value={dataSel} onChange={(e) => setDataSel(e.target.value)} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" />
            </div>
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Horario Inicio (excecao)</label>
              <input type="time" value={excIni} onChange={(e) => setExcIni(e.target.value)} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" placeholder="Deixe vazio p/ padrao" />
            </div>
            <div>
              <label className="font-body text-xs text-charcoal-500 block mb-1">Horario Fim (excecao)</label>
              <input type="time" value={excFim} onChange={(e) => setExcFim(e.target.value)} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg font-body text-sm" placeholder="Deixe vazio p/ padrao" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={aplicarExcecao} className="flex-1">Aplicar Excecao</Button>
              {excDia && <Button size="sm" variant="ghost" onClick={removerExcecao}>Remover</Button>}
            </div>
            {excDia && (
              <p className="font-body text-xs text-rosa-600">
                Excecao ativa: inicio {excDia.horaInicioExcecao || 'padrao'}, fim {excDia.horaFimExcecao || 'padrao'}
              </p>
            )}
          </div>
        </div>

        {/* Slots do dia */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-charcoal-100 p-6">
          <h3 className="font-heading font-semibold text-charcoal-900 mb-4">
            Slots de {formatarData(dataSel)}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.horario}
                onClick={() => handleToggleBloqueio(slot)}
                className={cn(
                  'p-3 rounded-lg border text-center transition-all font-body text-sm',
                  slot.estado === 'disponivel' && 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
                  slot.estado === 'bloqueado' && 'border-charcoal-300 bg-charcoal-100 hover:bg-charcoal-200',
                  slot.estado === 'ocupado' && 'border-rosa-200 bg-rosa-50 opacity-60',
                )}
              >
                <div className="font-medium text-charcoal-900">{slot.horario}</div>
                <div className="text-xs mt-1">
                  {slot.estado === 'disponivel' ? 'Livre' : slot.estado === 'bloqueado' ? 'Bloqueado' : 'Ocupado'}
                </div>
              </button>
            ))}
            {slots.length === 0 && (
              <div className="col-span-full text-center py-8 font-body text-sm text-charcoal-400">Nenhum slot.</div>
            )}
          </div>
          <p className="font-body text-xs text-charcoal-400 mt-3">Clique em um slot para bloquear/desbloquear.</p>
        </div>
      </div>
    </div>
  )
}
