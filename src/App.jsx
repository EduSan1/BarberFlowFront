import { useEffect, useState } from 'react'
import { LoginScreen } from './contexts/auth/LoginScreen'
import { DashboardScreen } from './contexts/dashboard/DashboardScreen'
import { AppointmentsScreen } from './contexts/appointments/AppointmentsScreen'
import { ClientsScreen } from './contexts/clients/ClientsScreen'
import { BarbersScreen } from './contexts/barbers/BarbersScreen'
import { ServicesScreen } from './contexts/services/ServicesScreen'
import { AppShell } from './components/layout/AppShell'
import { AppointmentModal } from './contexts/appointments/AppointmentModal'
import { EntityModal } from './components/form/EntityModal'
import { api } from './services/api'

const screens = { dashboard: DashboardScreen, appointments: AppointmentsScreen, clients: ClientsScreen, barbers: BarbersScreen, services: ServicesScreen }

export default function App() {
  const [user, setUser] = useState(null)
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [modal, setModal] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [clients, setClients] = useState([])
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [dashboardMonth, setDashboardMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setLoadError('')
    Promise.all([api.getClients(), api.getBarbers(), api.getServices(), api.getAppointments()])
      .then(([loadedClients, loadedBarbers, loadedServices, loadedAppointments]) => {
        setClients(loadedClients)
        setBarbers(loadedBarbers)
        setServices(loadedServices)
        setAppointments(loadedAppointments)
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    setDashboardLoading(true)
    api.getDashboard(dashboardMonth).then(setDashboard).catch((error) => setLoadError(error.message)).finally(() => setDashboardLoading(false))
  }, [user, dashboardMonth])

  if (!user) return <LoginScreen onLogin={async (credentials) => setUser(await api.login(credentials))} />

  const Screen = screens[activeScreen]
  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }
  const refreshDashboard = () => api.getDashboard(dashboardMonth).then(setDashboard)
  const saveEntity = async (type, payload) => {
    const operations = {
      client: [api.createClient, api.getClients, setClients, 'Cliente salvo com sucesso.'],
      barber: [api.createBarber, api.getBarbers, setBarbers, 'Barbeiro salvo com sucesso.'],
      service: [api.createService, api.getServices, setServices, 'Serviço salvo com sucesso.'],
    }
    const [create, list, update, message] = operations[type]
    await create(payload)
    update(await list())
    await refreshDashboard()
    setModal(null)
    notify(message)
  }

  return <AppShell activeScreen={activeScreen} user={{ name: user.nome, email: user.email }} onNavigate={setActiveScreen} onLogout={async () => { await api.logout(); setUser(null) }}>
    {loading && <p className="loading" role="status">Carregando dados da barbearia...</p>}
    {loadError && <p className="form-error" role="alert">{loadError}</p>}
    {!loading && !loadError && <Screen user={user} dashboard={dashboard} dashboardMonth={dashboardMonth} dashboardLoading={dashboardLoading} onMonthChange={setDashboardMonth} appointments={appointments} clients={clients} barbers={barbers} services={services} onNavigate={setActiveScreen} onNew={setModal} />}
    {modal === 'appointment' && <AppointmentModal clients={clients} barbers={barbers} services={services} onClose={() => setModal(null)} onSave={async (appointment) => {
      await api.createAppointment(appointment)
      setAppointments(await api.getAppointments())
      await refreshDashboard()
      setModal(null)
      notify('Agendamento salvo com sucesso.')
    }} />}
    {['client', 'barber', 'service'].includes(modal) && <EntityModal type={modal} onLookupCep={api.lookupCep} onClose={() => setModal(null)} onSave={(payload) => saveEntity(modal, payload)} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </AppShell>
}
