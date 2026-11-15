import { Brand } from './Brand'

const navigation = [
  ['dashboard', '⌂', 'Visão geral'],
  ['appointments', '◷', 'Agendamentos'],
  ['clients', '♙', 'Clientes'],
  ['barbers', '✂', 'Barbeiros'],
  ['services', '✦', 'Serviços'],
]

export function AppShell({ activeScreen, onNavigate, onLogout, user, children }) {
  const currentLabel = navigation.find(([id]) => id === activeScreen)?.[2]
  const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const currentDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())
  return <div className="app">
    <aside className="sidebar"><Brand /><span className="nav-label">Menu principal</span><nav className="nav" aria-label="Navegação principal">
      {navigation.map(([id, icon, label]) => <button className={id === activeScreen ? 'active' : ''} key={id} onClick={() => onNavigate(id)}><span className="icon" aria-hidden="true">{icon}</span>{label}</button>)}
    </nav><div className="sidebar-bottom"><div className="user"><span className="avatar">{initials}</span><span><b>{user.name}</b><small>{user.email}</small></span></div><button className="logout" onClick={onLogout}>Sair da conta</button></div></aside>
    <main className="main"><header className="topbar"><div className="breadcrumb">BarberFlow <span>/</span> <b>{currentLabel}</b></div><span className="date">{currentDate}</span></header><section className="content">{children}</section></main>
  </div>
}
