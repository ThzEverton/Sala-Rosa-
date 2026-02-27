import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Button from '../ui/Button.jsx'

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/servicos', label: 'Servicos' },
    { to: '/como-funciona', label: 'Como Funciona' },
    { to: '/contato', label: 'Contato' },
    { to: '/quero-ser-consultora', label: 'Seja Consultora' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-rosa-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rosa-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">SR</span>
            </div>
            <span className="font-heading font-bold text-xl text-charcoal-900">Sala Rosa</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-rosa-600' : 'text-charcoal-600 hover:text-rosa-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Agendar</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-charcoal-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-charcoal-100 pt-4">
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium font-body ${
                    isActive(link.to) ? 'bg-rosa-50 text-rosa-600' : 'text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-2 px-3">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Entrar</Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button size="sm" className="w-full">Agendar</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
