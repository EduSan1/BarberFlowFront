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
import { ConfirmModal } from './components/feedback/ConfirmModal'
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

  const loadBusinessData = async () => {
    const [loadedClients, loadedBarbers, loadedServices, loadedAppointments] = await Promise.all([api.getClients(), api.getBarbers(), api.getServices(), api.getAppointments()])
    setClients(loadedClients)
    setBarbers(loadedBarbers)
    setServices(loadedServices)
    setAppointments(loadedAppointments)
  }

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setLoadError('')
    loadBusinessData().catch((error) => setLoadError(error.message)).finally(() => setLoading(false))
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
  const refreshAll = async () => { await loadBusinessData(); await refreshDashboard() }
  const openNew = (type) => setModal({ mode: 'form', type, item: null })
  const openEdit = (type, item) => setModal({ mode: 'form', type, item })
  const openDelete = (type, item) => setModal({ mode: 'delete', type, item })

  const saveEntity = async (type, item, payload) => {
    const operations = {
      client: [api.createClient, api.updateClient, 'Cliente'],
      barber: [api.createBarber, api.updateBarber, 'Barbeiro'],
      service: [api.createService, api.updateService, 'Serviço'],
    }
    const [create, update, label] = operations[type]
    if (item) await update(item.id, payload)
    else await create(payload)
    await refreshAll()
    setModal(null)
    notify(`${label} ${item ? 'atualizado' : 'salvo'} com sucesso.`)
  }

  const saveAppointment = async (item, payload) => {
    if (item) await api.updateAppointment(item.id, payload)
    else await api.createAppointment(payload)
    await refreshAll()
    setModal(null)
    notify(`Agendamento ${item ? 'atualizado' : 'salvo'} com sucesso.`)
  }

  const deleteEntity = async () => {
    const operations = { client: [api.deleteClient, 'Cliente'], barber: [api.deleteBarber, 'Barbeiro'], service: [api.deleteService, 'Serviço'], appointment: [api.deleteAppointment, 'Agendamento'] }
    const [remove, label] = operations[modal.type]
    await remove(modal.item.id)
    await refreshAll()
    setModal(null)
    notify(`${label} excluído com sucesso.`)
  }

  const entityName = modal?.item?.name || modal?.item?.client || ''
  return <AppShell activeScreen={activeScreen} user={{ name: user.nome, email: user.email }} onNavigate={setActiveScreen} onLogout={async () => { await api.logout(); setUser(null) }}>
    {loading && <p className="loading" role="status">Carregando dados da barbearia...</p>}
    {loadError && <p className="form-error" role="alert">{loadError}</p>}
    {!loading && !loadError && <Screen user={user} dashboard={dashboard} dashboardMonth={dashboardMonth} dashboardLoading={dashboardLoading} onMonthChange={setDashboardMonth} appointments={appointments} clients={clients} barbers={barbers} services={services} onNavigate={setActiveScreen} onNew={openNew} onEdit={openEdit} onDelete={openDelete} />}
    {modal?.mode === 'form' && modal.type === 'appointment' && <AppointmentModal item={modal.item} clients={clients} barbers={barbers} services={services} onClose={() => setModal(null)} onSave={(payload) => saveAppointment(modal.item, payload)} />}
    {modal?.mode === 'form' && ['client', 'barber', 'service'].includes(modal.type) && <EntityModal type={modal.type} item={modal.item} onLookupCep={api.lookupCep} onClose={() => setModal(null)} onSave={(payload) => saveEntity(modal.type, modal.item, payload)} />}
    {modal?.mode === 'delete' && <ConfirmModal title="Confirmar exclusão" message={`Deseja excluir ${entityName ? `“${entityName}”` : 'este registro'}? Esta ação não pode ser desfeita.`} onClose={() => setModal(null)} onConfirm={deleteEntity} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </AppShell>
}
