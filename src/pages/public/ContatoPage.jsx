import Button from '../../components/ui/Button.jsx'

export default function ContatoPage() {
  const whatsappLink = 'https://wa.me/5511999990001?text=Ola!%20Gostaria%20de%20mais%20informacoes%20sobre%20a%20Sala%20Rosa.'

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-rosa-500 font-body font-semibold text-sm tracking-wider uppercase mb-3 block">Fale Conosco</span>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
            Contato
          </h1>
          <p className="font-body text-charcoal-500 max-w-xl mx-auto">
            Estamos aqui para atender voce. Entre em contato pelos canais abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-charcoal-50">
            <h3 className="font-heading font-semibold text-lg text-charcoal-900 mb-6">Informacoes</h3>
            <div className="flex flex-col gap-5">
              <div>
                <span className="font-body text-xs font-medium text-charcoal-400 uppercase tracking-wider">Endereco</span>
                <p className="font-body text-charcoal-700 mt-1">Rua das Flores, 123 - Bairro Jardim, Sao Paulo - SP</p>
              </div>
              <div>
                <span className="font-body text-xs font-medium text-charcoal-400 uppercase tracking-wider">Telefone</span>
                <p className="font-body text-charcoal-700 mt-1">(11) 99999-0001</p>
              </div>
              <div>
                <span className="font-body text-xs font-medium text-charcoal-400 uppercase tracking-wider">Email</span>
                <p className="font-body text-charcoal-700 mt-1">contato@salarosa.com</p>
              </div>
              <div>
                <span className="font-body text-xs font-medium text-charcoal-400 uppercase tracking-wider">Horario de Atendimento</span>
                <p className="font-body text-charcoal-700 mt-1">Segunda a Sabado: 08:00 - 18:00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-charcoal-50 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
            </div>
            <h3 className="font-heading font-semibold text-lg text-charcoal-900 mb-2">WhatsApp</h3>
            <p className="font-body text-charcoal-500 text-sm mb-6">
              Fale diretamente com nossa equipe pelo WhatsApp para tirar duvidas ou agendar.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chamar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
