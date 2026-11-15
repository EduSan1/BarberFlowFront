const API_URL = globalThis.__BARBERFLOW_API_URL__ || 'http://localhost:3000'
let accessToken = ''

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...options.headers },
    ...options,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a solicitação.')
  return body
}

export const api = {
  async login(credentials) {
    const session = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    accessToken = session.token
    return session.user
  },
  async logout() {
    await request('/api/auth/session', { method: 'DELETE' })
    accessToken = ''
  },
  async getClients() {
    const data = await request('/api/clientes')
    return data.map((item) => ({ id: item.id, name: item.nome, phone: item.telefone, email: item.email, cep: item.cep, street: item.logradouro, district: item.bairro, city: item.cidade, state: item.estado }))
  },
  async getBarbers() {
    const data = await request('/api/barbeiros')
    return data.map((item) => ({ id: item.id, name: item.nome, specialty: item.especialidade, phone: item.telefone }))
  },
  async getServices() {
    const data = await request('/api/servicos')
    return data.map((item) => ({ id: item.id, name: item.descricao, price: item.valor, duration: item.duracao }))
  },
  async getAppointments() {
    const data = await request('/api/agendamentos')
    return data.map((item) => ({ id: item.id, clientId: item.cliente_id, barberId: item.barbeiro_id, serviceId: item.servico_id, client: item.cliente, service: item.servico, barber: item.barbeiro, date: String(item.data).slice(0, 10), time: String(item.hora).slice(0, 5), status: item.status }))
  },
  getDashboard(month) {
    return request(`/api/dashboard?month=${encodeURIComponent(month)}`)
  },
  lookupCep(cep) {
    return request(`/api/cep/${String(cep).replace(/\D/g, '')}`)
  },
  createAppointment(payload) {
    return request('/api/agendamentos', { method: 'POST', body: JSON.stringify(payload) })
  },
  createClient(payload) {
    return request('/api/clientes', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateClient(id, payload) {
    return request(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteClient(id) {
    return request(`/api/clientes/${id}`, { method: 'DELETE' })
  },
  createBarber(payload) {
    return request('/api/barbeiros', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateBarber(id, payload) {
    return request(`/api/barbeiros/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteBarber(id) {
    return request(`/api/barbeiros/${id}`, { method: 'DELETE' })
  },
  createService(payload) {
    return request('/api/servicos', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateService(id, payload) {
    return request(`/api/servicos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteService(id) {
    return request(`/api/servicos/${id}`, { method: 'DELETE' })
  },
  updateAppointment(id, payload) {
    return request(`/api/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteAppointment(id) {
    return request(`/api/agendamentos/${id}`, { method: 'DELETE' })
  },
}
