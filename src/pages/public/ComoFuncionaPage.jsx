import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'

export default function ComoFuncionaPage() {
  const passos = [
    { num: '1', title: 'Escolha o Servico', desc: 'Navegue por nossa lista de servicos e encontre o tratamento ideal para voce.' },
    { num: '2', title: 'Escolha o Dia', desc: 'Verifique a disponibilidade na agenda e selecione a data que preferir.' },
    { num: '3', title: 'Escolha o Horario', desc: 'Veja os slots disponiveis no dia selecionado e reserve seu horario.' },
    { num: '4', title: 'Confirme o Agendamento', desc: 'Revise os detalhes e confirme. Voce recebera um lembrete antes do atendimento.' },
  ]

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Passo a Passo</span>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
            Como Funciona
          </h1>
          <p className="font-body text-charcoal-500 max-w-xl mx-auto">
            Agendar na Sala Rosa e simples e rapido. Siga os passos abaixo.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-rosa-200 hidden md:block" />
          <div className="flex flex-col gap-12">
            {passos.map((p, i) => (
              <div key={i} className="relative flex gap-6 items-start">
                <div className="relative z-10 w-16 h-16 rounded-full bg-rosa-500 text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-lg shadow-rosa-200">
                  {p.num}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm flex-1 border border-charcoal-50">
                  <h3 className="font-heading font-semibold text-lg text-charcoal-900 mb-2">{p.title}</h3>
                  <p className="font-body text-charcoal-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-rosa-600 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
            Pronta para comecar?
          </h2>
          <p className="font-body text-rosa-200 mb-6">
            Faca login e agende seu proximo atendimento agora mesmo.
          </p>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="bg-white text-rosa-600 hover:bg-cream-100">
              Agendar Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
