import { format, subDays, parseISO, isBefore, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatarData(dateStr) {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy')
  } catch {
    return dateStr
  }
}

export function formatarDataExtenso(dateStr) {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export function podeCancelarOuRemarcar(dataAgendamento) {
  const dataAg = parseISO(dataAgendamento)
  const limiteD2 = endOfDay(subDays(dataAg, 2))
  return isBefore(new Date(), limiteD2)
}

export function gerarHoraFim(horaInicio, duracaoHoras) {
  const [h, m] = horaInicio.split(':').map(Number)
  const fimH = h + duracaoHoras
  return `${String(fimH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function hoje() {
  return format(new Date(), 'yyyy-MM-dd')
}
