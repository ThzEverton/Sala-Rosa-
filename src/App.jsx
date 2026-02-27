import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { Toaster } from './components/ui/Toast.jsx'

import PublicLayout from './components/layout/PublicLayout.jsx'
import AppLayout from './components/layout/AppLayout.jsx'

import HomePage from './pages/public/HomePage.jsx'
import ServicosPage from './pages/public/ServicosPage.jsx'
import ComoFuncionaPage from './pages/public/ComoFuncionaPage.jsx'
import ContatoPage from './pages/public/ContatoPage.jsx'
import ConsultoraPage from './pages/public/ConsultoraPage.jsx'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

import DashboardPage from './pages/app/DashboardPage.jsx'
import AgendaPage from './pages/app/AgendaPage.jsx'
import AgendamentosPage from './pages/app/AgendamentosPage.jsx'
import HorariosPage from './pages/app/HorariosPage.jsx'
import VendasPage from './pages/app/VendasPage.jsx'
import EstoquePage from './pages/app/EstoquePage.jsx'
import TurmasPage from './pages/app/TurmasPage.jsx'
import FinanceiroPage from './pages/app/FinanceiroPage.jsx'
import UsuariosPage from './pages/app/UsuariosPage.jsx'
import ServicosAdminPage from './pages/app/ServicosAdminPage.jsx'
import ProdutosPage from './pages/app/ProdutosPage.jsx'
import MovimentacoesPage from './pages/app/MovimentacoesPage.jsx'
import MeuFinanceiroPage from './pages/app/MeuFinanceiroPage.jsx'
import QueroSerConsultoraPage from './pages/app/QueroSerConsultoraPage.jsx'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function GerenteRoute({ children }) {
  const { isLoggedIn, isGerente } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isGerente) return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/como-funciona" element={<ComoFuncionaPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/quero-ser-consultora" element={<ConsultoraPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App (logged in) */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="agendamentos" element={<AgendamentosPage />} />
            <Route path="turmas" element={<TurmasPage />} />
            <Route path="meus-agendamentos" element={<AgendamentosPage />} />
            <Route path="meu-financeiro" element={<MeuFinanceiroPage />} />
            <Route path="quero-ser-consultora" element={<QueroSerConsultoraPage />} />

            {/* Gerente only */}
            <Route path="vendas" element={<GerenteRoute><VendasPage /></GerenteRoute>} />
            <Route path="estoque" element={<GerenteRoute><EstoquePage /></GerenteRoute>} />
            <Route path="financeiro" element={<GerenteRoute><FinanceiroPage /></GerenteRoute>} />
            <Route path="usuarios" element={<GerenteRoute><UsuariosPage /></GerenteRoute>} />
            <Route path="servicos" element={<GerenteRoute><ServicosAdminPage /></GerenteRoute>} />
            <Route path="horarios" element={<GerenteRoute><HorariosPage /></GerenteRoute>} />
            <Route path="produtos" element={<GerenteRoute><ProdutosPage /></GerenteRoute>} />
            <Route path="movimentacoes" element={<GerenteRoute><MovimentacoesPage /></GerenteRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}