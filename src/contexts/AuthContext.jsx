import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { users as seedUsers } from '../data/mockData.js' // AJUSTE o caminho se estiver diferente

const AuthContext = createContext(null)

function sanitizeUser(u) {
  if (!u) return null
  const { senha, ...safe } = u
  return safe
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(() => {
    // opcional: persistir usuários criados no register
    const saved = localStorage.getItem('sr_users')
    return saved ? JSON.parse(saved) : seedUsers
  })

  useEffect(() => {
    localStorage.setItem('sr_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    const savedSession = localStorage.getItem('sr_session')
    if (savedSession) setUser(JSON.parse(savedSession))
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('sr_session', JSON.stringify(user))
    else localStorage.removeItem('sr_session')
  }, [user])

  const login = useCallback((email, senha) => {
    const u = users.find((x) => x.email?.toLowerCase() === String(email).toLowerCase())
    if (!u) return { ok: false, message: 'E-mail não encontrado.' }
    if (!u.ativo) return { ok: false, message: 'Usuário inativo.' }
    if (String(u.senha) !== String(senha)) return { ok: false, message: 'Senha incorreta.' }

    setUser(sanitizeUser(u))
    return { ok: true }
  }, [users])

  const register = useCallback((payload) => {
    const email = String(payload.email || '').trim().toLowerCase()
    const senha = String(payload.senha || '').trim()

    if (!payload.nome?.trim()) return { ok: false, message: 'Informe seu nome.' }
    if (!email) return { ok: false, message: 'Informe seu e-mail.' }
    if (!senha) return { ok: false, message: 'Informe uma senha.' }

    const exists = users.some((u) => u.email?.toLowerCase() === email)
    if (exists) return { ok: false, message: 'Este e-mail já está cadastrado.' }

    const novo = {
      id: `u${Date.now()}`,
      nome: payload.nome.trim(),
      email,
      telefone: payload.telefone?.trim() || '',
      perfil: 'cliente',        // regra simples: quem se cadastra vira cliente
      isConsultora: false,
      ativo: true,
      senha,
    }

    setUsers((prev) => [...prev, novo])
    setUser(sanitizeUser(novo))
    return { ok: true }
  }, [users])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const isGerente = user?.perfil === 'gerente'
  const isConsultora = user?.isConsultora === true
  const isCliente = user?.perfil === 'cliente' && !user?.isConsultora
  const isLoggedIn = !!user

  const value = useMemo(() => ({
    user,
    users,
    login,
    register,
    logout,
    isGerente,
    isConsultora,
    isCliente,
    isLoggedIn,
  }), [user, users, login, register, logout, isGerente, isConsultora, isCliente, isLoggedIn])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}