import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { toast } from '../../components/ui/Toast.jsx'

export default function ConsultoraPage() {
  const mensagemPadrao = 'Ola! Tenho interesse em ser uma consultora da Sala Rosa. Pode me explicar como funciona?'
  const whatsappLink = `https://wa.me/5511999990001?text=${encodeURIComponent(mensagemPadrao)}`
  const [copiado, setCopiado] = useState(false)

  function copiarMensagem() {
    navigator.clipboard.writeText(mensagemPadrao).then(() => {
      setCopiado(true)
      toast.success('Mensagem copiada para a area de transferencia!')
      setTimeout(() => setCopiado(false), 3000)
    })
  }

  const vantagens = [
    { title: 'Flexibilidade', desc: 'Trabalhe no seu tempo, defina seus horarios e construa sua carreira com liberdade.' },
    { title: 'Treinamentos Exclusivos', desc: 'Acesso a cursos e workshops exclusivos para consultoras da Sala Rosa.' },
    { title: 'Renda Extra', desc: 'Aumente sua renda com comissoes atrativas e bonificacoes por desempenho.' },
    { title: 'Comunidade', desc: 'Faca parte de uma comunidade de mulheres empreendedoras que se apoiam mutuamente.' },
  ]

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Oportunidade</span>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
            Quero ser uma Consultora
          </h1>
          <p className="font-body text-charcoal-500 max-w-xl mx-auto">
            Junte-se a nossa equipe e transforme sua paixao por beleza em uma carreira de sucesso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {vantagens.map((v, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-charcoal-50">
              <div className="w-10 h-10 rounded-lg bg-rosa-100 text-rosa-600 flex items-center justify-center font-heading font-bold mb-3">
                {i + 1}
              </div>
              <h3 className="font-heading font-semibold text-charcoal-900 mb-2">{v.title}</h3>
              <p className="font-body text-sm text-charcoal-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal-50 text-center">
          <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-4">
            Interessada? Entre em contato!
          </h2>
          <p className="font-body text-charcoal-500 mb-6 max-w-lg mx-auto">
            Envie uma mensagem pelo WhatsApp e nossa equipe vai explicar todos os detalhes sobre como se tornar uma consultora Sala Rosa.
          </p>

          <div className="bg-cream-100 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="font-body text-sm text-charcoal-600 italic mb-3">"{mensagemPadrao}"</p>
            <Button variant="ghost" size="sm" onClick={copiarMensagem}>
              {copiado ? 'Copiado!' : 'Copiar mensagem'}
            </Button>
          </div>

          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar pelo WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
