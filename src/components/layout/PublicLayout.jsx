import { Outlet } from 'react-router-dom'
import PublicHeader from '../public/PublicHeader.jsx'
import PublicFooter from '../public/PublicFooter.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
