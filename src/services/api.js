import {
  users as initialUsers,
  servicos as initialServicos,
  produtos as initialProdutos,
  agendamentos as initialAgendamentos,
  vendas as initialVendas,
  movimentacoesEstoque as initialMovimentacoes,
  financeiro as initialFinanceiro,
  horarioConfig as initialHorarioConfig,
  excecoesDia as initialExcecoes,
  bloqueiosSlot as initialBloqueios,
} from '../data/mockData.js'

let users = [...initialUsers]
let servicos = [...initialServicos]
let produtos = [...initialProdutos]
let agendamentos = [...initialAgendamentos]
let vendas = [...initialVendas]
let movimentacoes = [...initialMovimentacoes]
let financeiro = [...initialFinanceiro]
let horarioConfig = { ...initialHorarioConfig }
let excecoesDia = [...initialExcecoes]
let bloqueiosSlot = [...initialBloqueios]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))
let nextId = 1000

function genId(prefix) {
  nextId++
  return `${prefix}${nextId}`
}

// ─── USERS ───
export async function getUsers() {
  await delay()
  return [...users]
}
export async function getUserById(id) {
  await delay()
  return users.find((u) => u.id === id) || null
}
export async function createUser(data) {
  await delay()
  const u = { ...data, id: genId('u'), ativo: true }
  users.push(u)
  return u
}
export async function updateUser(id, data) {
  await delay()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('Usuario nao encontrado')
  users[idx] = { ...users[idx], ...data }
  return users[idx]
}
export async function toggleUserAtivo(id) {
  await delay()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('Usuario nao encontrado')
  users[idx].ativo = !users[idx].ativo
  return users[idx]
}

// ─── SERVICOS ───
export async function getServicos() {
  await delay()
  return [...servicos]
}
export async function getServicosVisiveis(isConsultora) {
  await delay()
  return servicos.filter((s) => s.ativo && (isConsultora || !s.exclusivoParaConsultora))
}
export async function createServico(data) {
  await delay()
  const s = { ...data, id: genId('s'), ativo: true }
  servicos.push(s)
  return s
}
export async function updateServico(id, data) {
  await delay()
  const idx = servicos.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error('Servico nao encontrado')
  servicos[idx] = { ...servicos[idx], ...data }
  return servicos[idx]
}

// ─── PRODUTOS ───
export async function getProdutos() {
  await delay()
  return [...produtos]
}
export async function createProduto(data) {
  await delay()
  const p = { ...data, id: genId('p'), ativo: true }
  produtos.push(p)
  return p
}
export async function updateProduto(id, data) {
  await delay()
  const idx = produtos.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('Produto nao encontrado')
  produtos[idx] = { ...produtos[idx], ...data }
  return produtos[idx]
}

// ─── HORARIOS & BLOQUEIOS ───
export async function getHorarioConfig() {
  await delay()
  return { ...horarioConfig }
}
export async function updateHorarioConfig(data) {
  await delay()
  horarioConfig = { ...horarioConfig, ...data }
  return horarioConfig
}
export async function getExcecoesDia() {
  await delay()
  return [...excecoesDia]
}
export async function setExcecaoDia(data) {
  await delay()
  const idx = excecoesDia.findIndex((e) => e.data === data.data)
  if (idx >= 0) excecoesDia[idx] = data
  else excecoesDia.push(data)
  return data
}
export async function removeExcecaoDia(dateStr) {
  await delay()
  excecoesDia = excecoesDia.filter((e) => e.data !== dateStr)
}
export async function getBloqueiosSlot() {
  await delay()
  return [...bloqueiosSlot]
}
export async function toggleBloqueioSlot(data, slot) {
  await delay()
  const idx = bloqueiosSlot.findIndex((b) => b.data === data && b.slot === slot)
  if (idx >= 0) {
    bloqueiosSlot.splice(idx, 1)
    return false
  } else {
    bloqueiosSlot.push({ data, slot })
    return true
  }
}

// ─── SLOTS DISPONIVEIS ───
export async function getSlotsParaDia(dateStr) {
  await delay()
  const config = { ...horarioConfig }
  const excecao = excecoesDia.find((e) => e.data === dateStr)
  const inicio = excecao?.horaInicioExcecao || config.horaInicioPadrao
  const fim = excecao?.horaFimExcecao || config.horaFimPadrao
  const [hi, mi] = inicio.split(':').map(Number)
  const [hf, mf] = fim.split(':').map(Number)
  const inicioMin = hi * 60 + mi
  const fimMin = hf * 60 + mf
  const dur = config.duracaoSlotMinutos
  const slots = []
  for (let m = inicioMin; m + dur <= fimMin; m += dur) {
    const h = String(Math.floor(m / 60)).padStart(2, '0')
    const mn = String(m % 60).padStart(2, '0')
    const slotStr = `${h}:${mn}`
    const bloqueado = bloqueiosSlot.some((b) => b.data === dateStr && b.slot === slotStr)
    const agend = agendamentos.filter(
      (a) => a.data === dateStr && a.status !== 'cancelado' && a.horaInicio <= slotStr && a.horaFim > slotStr
    )
    let estado = 'disponivel'
    if (bloqueado) estado = 'bloqueado'
    else if (agend.length > 0) estado = 'ocupado'
    slots.push({
      horario: slotStr,
      estado,
      agendamento: agend[0] || null,
    })
  }
  return slots
}

// ─── AGENDAMENTOS ───
export async function getAgendamentos() {
  await delay()
  return [...agendamentos]
}
export async function getAgendamentosDoUsuario(userId) {
  await delay()
  return agendamentos.filter((a) => a.participantes.some((p) => p.userId === userId))
}
export async function createAgendamento(data) {
  await delay()
  const slots = await getSlotsParaDia(data.data)
  const slotAlvo = slots.find((s) => s.horario === data.horaInicio)
  if (!slotAlvo || slotAlvo.estado !== 'disponivel') throw new Error('Slot nao disponivel')
  if (data.tipo === 'turma') {
    const fimSlot = slots.find((s) => s.horario === data.horaInicio)
    const slotIdx = slots.indexOf(fimSlot)
    if (slotIdx + 1 < slots.length && slots[slotIdx + 1].estado !== 'disponivel') {
      throw new Error('Slot seguinte nao disponivel para turma de 2h')
    }
  }
  if (data.tipo === 'turma' && data.participantes.length < 2) throw new Error('Turma precisa de minimo 2 participantes')
  if (data.tipo === 'turma' && data.participantes.length > 5) throw new Error('Turma aceita maximo 5 participantes')
  const servico = servicos.find((s) => s.id === data.servicoId)
  const durH = data.tipo === 'turma' ? 2 : 1
  const [h, m] = data.horaInicio.split(':').map(Number)
  const fimH = h + durH
  const horaFim = `${String(fimH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const ag = { ...data, id: genId('a'), horaFim, status: 'confirmado' }
  agendamentos.push(ag)
  ag.participantes.forEach((p) => {
    const lanc = {
      id: genId('f'),
      descricao: `${servico?.nome || 'Servico'} - ${p.nome}`,
      valor: servico?.preco || 0,
      formaPagamento: null,
      status: 'pendente',
      data: data.data,
      userId: p.userId,
      vendaId: null,
      agendamentoId: ag.id,
    }
    financeiro.push(lanc)
  })
  return ag
}
export async function cancelarAgendamento(id) {
  await delay()
  const idx = agendamentos.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Agendamento nao encontrado')
  agendamentos[idx].status = 'cancelado'
  return agendamentos[idx]
}
export async function remarcarAgendamento(id, novaData, novaHora) {
  await delay()
  const idx = agendamentos.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Agendamento nao encontrado')
  const durH = agendamentos[idx].tipo === 'turma' ? 2 : 1
  const [h, m] = novaHora.split(':').map(Number)
  const fimH = h + durH
  agendamentos[idx].data = novaData
  agendamentos[idx].horaInicio = novaHora
  agendamentos[idx].horaFim = `${String(fimH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  return agendamentos[idx]
}

// ─── VENDAS ───
export async function getVendas() {
  await delay()
  return [...vendas]
}
export async function createVenda(data) {
  await delay()
  if (!data.itens || data.itens.length === 0) throw new Error('Venda precisa de ao menos 1 item')
  for (const item of data.itens) {
    if (item.tipo === 'produto') {
      const prod = produtos.find((p) => p.id === item.referenciaId)
      if (!prod) throw new Error(`Produto ${item.referenciaId} nao encontrado`)
      if (prod.estoqueAtual < item.quantidade) throw new Error(`Estoque insuficiente para ${prod.nome}`)
    }
  }
  const venda = { ...data, id: genId('v') }
  vendas.push(venda)
  for (const item of data.itens) {
    if (item.tipo === 'produto') {
      const prod = produtos.find((p) => p.id === item.referenciaId)
      prod.estoqueAtual -= item.quantidade
      movimentacoes.push({
        id: genId('m'), produtoId: item.referenciaId, tipo: 'saida',
        quantidade: item.quantidade, data: data.data, observacao: `Venda ${venda.id}`, vendaId: venda.id,
      })
    }
  }
  const lancamento = {
    id: genId('f'), descricao: `Venda ${venda.id}`, valor: data.valorTotal,
    formaPagamento: null, status: 'pendente', data: data.data,
    userId: null, vendaId: venda.id, agendamentoId: data.atendimentoId || null,
  }
  financeiro.push(lancamento)
  return venda
}

// ─── ESTOQUE/MOVIMENTACOES ───
export async function getMovimentacoes() {
  await delay()
  return [...movimentacoes]
}
export async function createMovimentacao(data) {
  await delay()
  const prod = produtos.find((p) => p.id === data.produtoId)
  if (!prod) throw new Error('Produto nao encontrado')
  if (data.tipo === 'saida' && prod.estoqueAtual < data.quantidade) throw new Error('Estoque insuficiente')
  if (data.tipo === 'entrada') prod.estoqueAtual += data.quantidade
  else if (data.tipo === 'saida') prod.estoqueAtual -= data.quantidade
  else if (data.tipo === 'ajuste') {
    prod.estoqueAtual += data.quantidade
    if (prod.estoqueAtual < 0) { prod.estoqueAtual -= data.quantidade; throw new Error('Ajuste resultaria em estoque negativo') }
  }
  const mov = { ...data, id: genId('m') }
  movimentacoes.push(mov)
  return mov
}

// ─── TURMAS ───
export async function getTurmasAbertas() {
  await delay()
  return agendamentos.filter(
    (a) => a.tipo === 'turma' && a.status !== 'cancelado' && a.status !== 'concluido' && a.participantes.length < 5
  )
}

export async function getAgendamentoById(id) {
  await delay()
  return agendamentos.find((a) => a.id === id) || null
}

export async function entrarNaTurma(agendamentoId, userId, nomeUser) {
  await delay()
  const idx = agendamentos.findIndex((a) => a.id === agendamentoId)
  if (idx === -1) throw new Error('Turma nao encontrada')
  const ag = agendamentos[idx]
  if (ag.tipo !== 'turma') throw new Error('Este agendamento nao e uma turma')
  if (ag.status === 'cancelado' || ag.status === 'concluido') throw new Error('Turma nao esta mais aberta')
  if (ag.participantes.length >= 5) throw new Error('Turma cheia (maximo 5 participantes)')
  if (ag.participantes.some((p) => p.userId === userId)) throw new Error('Voce ja esta nesta turma')
  ag.participantes.push({ userId, nome: nomeUser })
  const servico = servicos.find((s) => s.id === ag.servicoId)
  financeiro.push({
    id: genId('f'),
    descricao: `${servico?.nome || 'Servico'} - ${nomeUser}`,
    valor: servico?.preco || 0,
    formaPagamento: null,
    status: 'pendente',
    data: ag.data,
    userId,
    vendaId: null,
    agendamentoId: ag.id,
  })
  return ag
}

// ─── FINANCEIRO ───
export async function getFinanceiro() {
  await delay()
  return [...financeiro]
}
export async function getFinanceiroDoUsuario(userId) {
  await delay()
  return financeiro.filter((f) => f.userId === userId)
}
export async function marcarComoPago(id, formaPagamento) {
  await delay()
  const idx = financeiro.findIndex((f) => f.id === id)
  if (idx === -1) throw new Error('Lancamento nao encontrado')
  financeiro[idx].status = 'pago'
  financeiro[idx].formaPagamento = formaPagamento
  return financeiro[idx]
}
