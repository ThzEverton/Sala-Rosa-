import { addDays, format, subDays } from 'date-fns'

const today = new Date()
const todayStr = format(today, 'yyyy-MM-dd')
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd')
const dayAfterStr = format(addDays(today, 2), 'yyyy-MM-dd')
const nextWeekStr = format(addDays(today, 5), 'yyyy-MM-dd')

export const users = [
  { id: 'u1', nome: 'Ana Gerente', email: 'ana@salarosa.com', telefone: '11999990001', perfil: 'gerente', isConsultora: false, ativo: true, senha: '123' },
  { id: 'u2', nome: 'Maria Silva', email: 'maria@email.com', telefone: '11999990002', perfil: 'cliente', isConsultora: false, ativo: true, senha: '123' },
  { id: 'u3', nome: 'Juliana Costa', email: 'juliana@email.com', telefone: '11999990003', perfil: 'cliente', isConsultora: true, ativo: true, senha: '123' },
  { id: 'u4', nome: 'Fernanda Oliveira', email: 'fernanda@email.com', telefone: '11999990004', perfil: 'cliente', isConsultora: false, ativo: true, senha: '123' },
  { id: 'u5', nome: 'Patricia Souza', email: 'patricia@email.com', telefone: '11999990005', perfil: 'cliente', isConsultora: false, ativo: true, senha: '123' },
  { id: 'u6', nome: 'Camila Santos', email: 'camila@email.com', telefone: '11999990006', perfil: 'cliente', isConsultora: true, ativo: true, senha: '123' },
  { id: 'u7', nome: 'Beatriz Lima', email: 'beatriz@email.com', telefone: '11999990007', perfil: 'cliente', isConsultora: false, ativo: false, senha: '123' },
]

export const servicos = [
  { id: 's1', nome: 'Design de Sobrancelhas', descricao: 'Modelagem e design profissional de sobrancelhas.', preco: 80, duracao: 60, exclusivoParaConsultora: false, ativo: true },
  { id: 's2', nome: 'Limpeza de Pele', descricao: 'Tratamento completo de limpeza facial profunda.', preco: 150, duracao: 60, exclusivoParaConsultora: false, ativo: true },
  { id: 's3', nome: 'Maquiagem Profissional', descricao: 'Maquiagem para eventos e ocasioes especiais.', preco: 200, duracao: 60, exclusivoParaConsultora: false, ativo: true },
  { id: 's4', nome: 'Workshop de Automaquiagem', descricao: 'Aprenda tecnicas de maquiagem em grupo.', preco: 120, duracao: 120, exclusivoParaConsultora: false, ativo: true },
  { id: 's5', nome: 'Curso de Colorimetria', descricao: 'Curso exclusivo para consultoras sobre colorimetria.', preco: 300, duracao: 120, exclusivoParaConsultora: true, ativo: true },
  { id: 's6', nome: 'Treinamento de Vendas', descricao: 'Capacitacao em tecnicas de vendas para consultoras.', preco: 250, duracao: 120, exclusivoParaConsultora: true, ativo: true },
  { id: 's7', nome: 'Massagem Facial', descricao: 'Massagem relaxante e rejuvenescedora.', preco: 130, duracao: 60, exclusivoParaConsultora: false, ativo: true },
  { id: 's8', nome: 'Peeling Facial', descricao: 'Tratamento de renovacao celular.', preco: 180, duracao: 60, exclusivoParaConsultora: false, ativo: false },
]

export const produtos = [
  { id: 'p1', nome: 'Creme Hidratante Facial', unidade: 'un', estoqueAtual: 25, estoqueMinimo: 5, preco: 89.90, ativo: true },
  { id: 'p2', nome: 'Protetor Solar FPS 50', unidade: 'un', estoqueAtual: 18, estoqueMinimo: 10, preco: 65.00, ativo: true },
  { id: 'p3', nome: 'Serum Vitamina C', unidade: 'un', estoqueAtual: 3, estoqueMinimo: 5, preco: 120.00, ativo: true },
  { id: 'p4', nome: 'Agua Micelar', unidade: 'un', estoqueAtual: 30, estoqueMinimo: 8, preco: 45.00, ativo: true },
  { id: 'p5', nome: 'Kit Pinceis Maquiagem', unidade: 'kit', estoqueAtual: 12, estoqueMinimo: 3, preco: 159.90, ativo: true },
  { id: 'p6', nome: 'Mascara de Cilios', unidade: 'un', estoqueAtual: 2, estoqueMinimo: 5, preco: 55.00, ativo: true },
  { id: 'p7', nome: 'Base Liquida', unidade: 'un', estoqueAtual: 20, estoqueMinimo: 8, preco: 79.90, ativo: true },
]

export const horarioConfig = {
  horaInicioPadrao: '08:00',
  horaFimPadrao: '18:00',
  duracaoSlotMinutos: 60,
}

export const excecoesDia = [
  { data: tomorrowStr, horaInicioExcecao: '10:00', horaFimExcecao: null },
  { data: nextWeekStr, horaInicioExcecao: null, horaFimExcecao: '20:00' },
]

export const bloqueiosSlot = [
  { data: todayStr, slot: '12:00' },
  { data: todayStr, slot: '13:00' },
  { data: tomorrowStr, slot: '12:00' },
]

export const agendamentos = [
  {
    id: 'a1', tipo: 'individual', servicoId: 's1', data: todayStr, horaInicio: '09:00', horaFim: '10:00',
    participantes: [{ userId: 'u2', nome: 'Maria Silva' }],
    status: 'confirmado', observacao: '', criadoPor: 'u2',
  },
  {
    id: 'a2', tipo: 'turma', servicoId: 's4', data: todayStr, horaInicio: '14:00', horaFim: '16:00',
    participantes: [
      { userId: 'u2', nome: 'Maria Silva' },
      { userId: 'u4', nome: 'Fernanda Oliveira' },
      { userId: 'u5', nome: 'Patricia Souza' },
    ],
    status: 'confirmado', observacao: 'Turma de automaquiagem', criadoPor: 'u1',
  },
  {
    id: 'a3', tipo: 'individual', servicoId: 's2', data: tomorrowStr, horaInicio: '10:00', horaFim: '11:00',
    participantes: [{ userId: 'u3', nome: 'Juliana Costa' }],
    status: 'confirmado', observacao: '', criadoPor: 'u3',
  },
  {
    id: 'a4', tipo: 'individual', servicoId: 's7', data: dayAfterStr, horaInicio: '15:00', horaFim: '16:00',
    participantes: [{ userId: 'u4', nome: 'Fernanda Oliveira' }],
    status: 'pendente', observacao: '', criadoPor: 'u4',
  },
  {
    id: 'a5', tipo: 'turma', servicoId: 's5', data: nextWeekStr, horaInicio: '09:00', horaFim: '11:00',
    participantes: [
      { userId: 'u3', nome: 'Juliana Costa' },
      { userId: 'u6', nome: 'Camila Santos' },
    ],
    status: 'confirmado', observacao: 'Curso exclusivo consultoras', criadoPor: 'u1',
  },
  {
    id: 'a6', tipo: 'individual', servicoId: 's3', data: format(subDays(today, 3), 'yyyy-MM-dd'), horaInicio: '11:00', horaFim: '12:00',
    participantes: [{ userId: 'u2', nome: 'Maria Silva' }],
    status: 'concluido', observacao: '', criadoPor: 'u2',
  },
]

export const vendas = [
  {
    id: 'v1', data: format(subDays(today, 1), 'yyyy-MM-dd'), atendimentoId: 'a6',
    itens: [
      { tipo: 'servico', referenciaId: 's3', nome: 'Maquiagem Profissional', quantidade: 1, valorUnitario: 200 },
      { tipo: 'produto', referenciaId: 'p1', nome: 'Creme Hidratante Facial', quantidade: 1, valorUnitario: 89.90 },
    ],
    valorTotal: 289.90, criadoPor: 'u1',
  },
  {
    id: 'v2', data: todayStr, atendimentoId: null,
    itens: [
      { tipo: 'produto', referenciaId: 'p2', nome: 'Protetor Solar FPS 50', quantidade: 2, valorUnitario: 65.00 },
      { tipo: 'produto', referenciaId: 'p4', nome: 'Agua Micelar', quantidade: 1, valorUnitario: 45.00 },
    ],
    valorTotal: 175.00, criadoPor: 'u1',
  },
]

export const movimentacoesEstoque = [
  { id: 'm1', produtoId: 'p1', tipo: 'entrada', quantidade: 30, data: format(subDays(today, 10), 'yyyy-MM-dd'), observacao: 'Compra fornecedor', vendaId: null },
  { id: 'm2', produtoId: 'p1', tipo: 'saida', quantidade: 1, data: format(subDays(today, 1), 'yyyy-MM-dd'), observacao: 'Venda v1', vendaId: 'v1' },
  { id: 'm3', produtoId: 'p2', tipo: 'entrada', quantidade: 20, data: format(subDays(today, 7), 'yyyy-MM-dd'), observacao: 'Compra fornecedor', vendaId: null },
  { id: 'm4', produtoId: 'p2', tipo: 'saida', quantidade: 2, data: todayStr, observacao: 'Venda v2', vendaId: 'v2' },
  { id: 'm5', produtoId: 'p3', tipo: 'ajuste', quantidade: -2, data: format(subDays(today, 2), 'yyyy-MM-dd'), observacao: 'Ajuste inventario', vendaId: null },
]

export const financeiro = [
  { id: 'f1', descricao: 'Maquiagem Profissional - Maria Silva', valor: 200, formaPagamento: 'pix', status: 'pago', data: format(subDays(today, 1), 'yyyy-MM-dd'), userId: 'u2', vendaId: 'v1', agendamentoId: 'a6' },
  { id: 'f2', descricao: 'Creme Hidratante Facial', valor: 89.90, formaPagamento: 'cartao', status: 'pago', data: format(subDays(today, 1), 'yyyy-MM-dd'), userId: 'u2', vendaId: 'v1', agendamentoId: null },
  { id: 'f3', descricao: 'Protetor Solar FPS 50 x2 + Agua Micelar', valor: 175.00, formaPagamento: 'dinheiro', status: 'pendente', data: todayStr, userId: 'u4', vendaId: 'v2', agendamentoId: null },
  { id: 'f4', descricao: 'Design de Sobrancelhas - Maria Silva', valor: 80, formaPagamento: 'pix', status: 'pendente', data: todayStr, userId: 'u2', vendaId: null, agendamentoId: 'a1' },
  { id: 'f5', descricao: 'Workshop Automaquiagem - Maria Silva', valor: 120, formaPagamento: null, status: 'pendente', data: todayStr, userId: 'u2', vendaId: null, agendamentoId: 'a2' },
  { id: 'f6', descricao: 'Workshop Automaquiagem - Fernanda Oliveira', valor: 120, formaPagamento: null, status: 'pendente', data: todayStr, userId: 'u4', vendaId: null, agendamentoId: 'a2' },
  { id: 'f7', descricao: 'Workshop Automaquiagem - Patricia Souza', valor: 120, formaPagamento: 'cartao', status: 'pago', data: todayStr, userId: 'u5', vendaId: null, agendamentoId: 'a2' },
  { id: 'f8', descricao: 'Limpeza de Pele - Juliana Costa', valor: 150, formaPagamento: null, status: 'pendente', data: tomorrowStr, userId: 'u3', vendaId: null, agendamentoId: 'a3' },
]
