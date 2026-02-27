import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'

export default function HomePage() {
  const beneficios = [
    { icon: '01', title: 'Profissionais Qualificadas', desc: 'Nossa equipe e formada por especialistas com anos de experiencia no mercado da beleza.' },
    { icon: '02', title: 'Ambiente Acolhedor', desc: 'Um espaco pensado para voce relaxar e se sentir especial a cada visita.' },
    { icon: '03', title: 'Agendamento Facil', desc: 'Agende online de forma rapida e pratica, no horario que for melhor para voce.' },
    { icon: '04', title: 'Produtos Premium', desc: 'Trabalhamos apenas com marcas de alta qualidade para garantir os melhores resultados.' },
  ]

  const servicosDestaque = [
    { nome: 'Design de Sobrancelhas', preco: 'R$ 80', desc: 'Modelagem e design profissional.' },
    { nome: 'Limpeza de Pele', preco: 'R$ 150', desc: 'Tratamento completo de limpeza facial.' },
    { nome: 'Maquiagem Profissional', preco: 'R$ 200', desc: 'Maquiagem para eventos especiais.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-cream-50 via-rosa-50 to-cream-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-rosa-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-rosa-100/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-rosa-100 text-rosa-700 rounded-full text-sm font-body font-medium mb-6">
              Beleza & Bem-estar
            </span>
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-charcoal-900 leading-tight mb-6">
              Seu espaco de{' '}
              <span className="text-rosa-600">beleza</span>{' '}
              e transformacao
            </h1>
            <p className="font-body text-lg text-charcoal-500 leading-relaxed mb-8 max-w-lg">
              A Sala Rosa e o lugar onde voce cuida de si mesma com carinho, profissionalismo
              e os melhores tratamentos de beleza.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg">Agendar Agora</Button>
              </Link>
              <Link to="/quero-ser-consultora">
                <Button variant="outline" size="lg">Quero ser Consultora</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Sobre Nos</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-900 mb-6">
                Mais do que um salao, um espaco de cuidado
              </h2>
              <p className="font-body text-charcoal-500 leading-relaxed mb-4">
                A Sala Rosa nasceu do desejo de criar um ambiente onde cada mulher se sentisse
                unica e especial. Aqui, beleza e autoestima caminham juntas.
              </p>
              <p className="font-body text-charcoal-500 leading-relaxed mb-8">
                Oferecemos desde tratamentos individuais ate workshops em grupo, com atendimento
                personalizado e produtos de alta qualidade. Tambem formamos consultoras que
                desejam empreender no universo da beleza.
              </p>
              <Link to="/servicos">
                <Button variant="secondary">Conheca nossos servicos</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-rosa-100 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 rounded-full bg-rosa-200 mx-auto mb-6 flex items-center justify-center">
                    <span className="font-heading text-rosa-600 text-4xl font-bold">SR</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-2">Sala Rosa</h3>
                  <p className="font-body text-charcoal-500">Beleza, cuidado e transformacao</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rosa-500 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Por Que Escolher</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-900">
              Nossos Diferenciais
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((b, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-lg bg-rosa-100 text-rosa-600 flex items-center justify-center font-heading font-bold text-lg mb-4 group-hover:bg-rosa-500 group-hover:text-white transition-colors">
                  {b.icon}
                </div>
                <h3 className="font-heading font-semibold text-charcoal-900 mb-2">{b.title}</h3>
                <p className="font-body text-sm text-charcoal-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicos Destaque */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Servicos</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-900">
              Tratamentos em Destaque
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicosDestaque.map((s, i) => (
              <div key={i} className="group border border-charcoal-100 rounded-xl p-6 hover:border-rosa-300 hover:shadow-lg transition-all">
                <div className="w-full h-40 bg-rosa-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-rosa-100 transition-colors">
                  <span className="font-heading text-rosa-400 text-lg">{s.nome}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-charcoal-900">{s.nome}</h3>
                  <span className="font-body font-bold text-rosa-600">{s.preco}</span>
                </div>
                <p className="font-body text-sm text-charcoal-500 mb-4">{s.desc}</p>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">Agendar</Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/servicos">
              <Button variant="secondary" size="lg">Ver todos os servicos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-rosa-600">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-6">
            Pronta para se transformar?
          </h2>
          <p className="font-body text-rosa-200 text-lg mb-8 max-w-2xl mx-auto">
            Agende seu horario agora e descubra como a Sala Rosa pode realcar sua beleza natural.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button variant="secondary" size="lg" className="bg-white text-rosa-600 hover:bg-cream-100">
                Agendar Horario
              </Button>
            </Link>
            <Link to="/quero-ser-consultora">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-rosa-700">
                Seja uma Consultora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
