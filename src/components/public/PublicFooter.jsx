import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-rosa-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">SR</span>
              </div>
              <span className="font-heading font-bold text-xl">Sala Rosa</span>
            </div>
            <p className="font-body text-charcoal-300 text-sm leading-relaxed max-w-md">
              Seu espaco de beleza e bem-estar. Oferecemos servicos especializados em um ambiente
              acolhedor e profissional, feito para voce se sentir especial.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 text-rosa-300">Navegacao</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors">Inicio</Link>
              <Link to="/servicos" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors">Servicos</Link>
              <Link to="/como-funciona" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors">Como Funciona</Link>
              <Link to="/contato" className="font-body text-sm text-charcoal-400 hover:text-white transition-colors">Contato</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 text-rosa-300">Contato</h4>
            <div className="flex flex-col gap-2 font-body text-sm text-charcoal-400">
              <p>Rua das Flores, 123</p>
              <p>Bairro Jardim - SP</p>
              <p>(11) 99999-0001</p>
              <p>contato@salarosa.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-800 text-center">
          <p className="font-body text-xs text-charcoal-500">
            Sala Rosa - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
