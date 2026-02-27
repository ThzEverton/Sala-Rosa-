import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { cn } from '../../utils/cn.js'

export default function AppLayout() {
  const { user, logout, isGerente, isConsultora, isCliente } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const gerenteLinks = [
    { to: '/app', label: 'Dashboard', icon: 'grid' },
    { to: '/app/agenda', label: 'Agenda', icon: 'calendar' },
    { to: '/app/agendamentos', label: 'Agendamentos', icon: 'list' },
    { to: '/app/turmas', label: 'Turmas', icon: 'users' },
    { to: '/app/vendas', label: 'Vendas', icon: 'shopping-bag' },
    { to: '/app/financeiro', label: 'Financeiro', icon: 'dollar-sign' },
    { to: '/app/usuarios', label: 'Usuarios', icon: 'users' },
    { to: '/app/servicos', label: 'Servicos', icon: 'scissors' },
    { to: '/app/horarios', label: 'Horarios & Bloqueios', icon: 'clock' },
    { to: '/app/produtos', label: 'Produtos & Estoque', icon: 'package' },
  ]

  const clienteLinks = [
    { to: '/app', label: 'Dashboard', icon: 'grid' },
    { to: '/app/agenda', label: 'Agenda', icon: 'calendar' },
    { to: '/app/meus-agendamentos', label: 'Meus Agendamentos', icon: 'list' },
    { to: '/app/turmas', label: 'Turmas', icon: 'users' },
    { to: '/app/meu-financeiro', label: 'Meu Financeiro', icon: 'dollar-sign' },
  ]

  const links = isGerente ? gerenteLinks : clienteLinks
  if (isCliente && !isConsultora) {
    links.push({ to: '/app/quero-ser-consultora', label: 'Seja Consultora', icon: 'star' })
  }

  const isActive = (path) => location.pathname === path

  const IconMap = ({ icon }) => {
    const icons = {
      grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
      calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
      list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
      'shopping-bag': <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>,
      package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
      'dollar-sign': <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>,
      users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>,
      scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>,
      clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
      box: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
      'refresh-cw': <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>,
      star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon] || icons.grid}
      </svg>
    )
  }

  return (
    <div className="flex h-screen bg-cream-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-charcoal-900/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-charcoal-100 flex flex-col transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-charcoal-100 shrink-0">
          <div className="w-8 h-8 rounded-full bg-rosa-500 flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">SR</span>
          </div>
          <span className="font-heading font-bold text-lg text-charcoal-900">Sala Rosa</span>
          <button className="lg:hidden ml-auto p-1" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors',
                  isActive(link.to)
                    ? 'bg-rosa-50 text-rosa-700'
                    : 'text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-700'
                )}
              >
                <IconMap icon={link.icon} />
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-charcoal-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rosa-100 flex items-center justify-center">
              <span className="font-body font-semibold text-rosa-600 text-xs">{user?.nome?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-charcoal-900 truncate">{user?.nome}</p>
              <p className="font-body text-xs text-charcoal-400 capitalize">
                {isGerente ? 'Gerente' : isConsultora ? 'Consultora' : 'Cliente'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium text-charcoal-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-charcoal-100 flex items-center px-4 lg:px-8 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-charcoal-50 mr-3"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-semibold text-charcoal-900">
              {links.find((l) => isActive(l.to))?.label || 'Sistema'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-charcoal-400 hidden sm:block">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
