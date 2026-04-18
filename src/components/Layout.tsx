import { Link, useLocation } from 'react-router-dom'

const navs = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/friends', label: '朋友', icon: '👥' },
  { path: '/friends/new', label: '添加', icon: '➕', highlight: true },
  { path: '/events', label: '日历', icon: '📅' },
  { path: '/me', label: '我的', icon: '👤' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  const isDetail = loc.pathname.startsWith('/friends/') && loc.pathname !== '/friends' && loc.pathname !== '/friends/new'

  return (
    <div className="min-h-screen bg-bg">
      <main className={isDetail ? '' : 'pb-16'}>{children}</main>
      {!isDetail && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-200 safe-area-pb flex items-center justify-around h-16 z-50">
          {navs.map((n) => {
            const active = n.path === '/' ? loc.pathname === '/' : loc.pathname.startsWith(n.path)
            return (
              <Link
                key={n.path}
                to={n.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-xs ${
                  n.highlight ? 'text-primary font-medium' : active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <span className="text-lg">{n.icon}</span>
                <span>{n.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
