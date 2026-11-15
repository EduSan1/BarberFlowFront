import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'
import { api as mockApi } from '../src/services/api'

jest.mock('../src/services/api', () => ({ api: { login: jest.fn(), logout: jest.fn(), getClients: jest.fn(), getBarbers: jest.fn(), getServices: jest.fn(), getAppointments: jest.fn(), getDashboard: jest.fn(), lookupCep: jest.fn(), createClient: jest.fn(), updateClient: jest.fn(), deleteClient: jest.fn(), createBarber: jest.fn(), updateBarber: jest.fn(), deleteBarber: jest.fn(), createService: jest.fn(), updateService: jest.fn(), deleteService: jest.fn(), createAppointment: jest.fn(), updateAppointment: jest.fn(), deleteAppointment: jest.fn() } }))

const clients = [{ id: 'c1', name: 'Ana', phone: '1', email: 'ana@email.com', cep: '01001-000', street: 'Praça da Sé', district: 'Sé', city: 'São Paulo', state: 'SP' }]
const barbers = [{ id: 'b1', name: 'Bia', specialty: 'Corte', phone: '2' }]
const services = [{ id: 's1', name: 'Corte', price: 40, duration: 30 }]
const appointments = [{ id: 'a1', clientId: 'c1', barberId: 'b1', serviceId: 's1', client: 'Ana', barber: 'Bia', service: 'Corte', date: '2026-11-12', time: '10:00', status: 'agendado' }]
const dashboard = {
  month: '2026-11',
  metrics: { appointments: 8, revenue: 450, averageTicket: 56.25, clients: 12, developmentClients: 1, topService: 'Corte', peakHour: '10:00' },
  trend: [{ month: '2026-10', appointments: 3, revenue: 120 }, { month: '2026-11', appointments: 8, revenue: 450 }],
  services: [{ name: 'Corte', total: 4, revenue: 180 }],
  statuses: [{ status: 'concluido', total: 5 }, { status: 'agendado', total: 3 }],
  hours: [{ hour: '10:00', total: 3 }],
  days: [{ date: '2026-11-01', total: 2 }, { date: '2026-11-02', total: 0 }],
  developmentClients: [{ id: 'c1', name: 'Ana', last_visit: null }],
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockApi.login.mockResolvedValue({ nome: 'André Silva', email: 'admin@barberflow.com' })
    mockApi.logout.mockResolvedValue()
    mockApi.getClients.mockResolvedValue(clients)
    mockApi.getBarbers.mockResolvedValue(barbers)
    mockApi.getServices.mockResolvedValue(services)
    mockApi.getAppointments.mockResolvedValue(appointments)
    mockApi.getDashboard.mockResolvedValue(dashboard)
    mockApi.lookupCep.mockResolvedValue({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', estado: 'SP' })
    mockApi.createClient.mockResolvedValue({})
    mockApi.updateClient.mockResolvedValue({})
    mockApi.deleteClient.mockResolvedValue({})
    mockApi.createAppointment.mockResolvedValue({})
    mockApi.updateAppointment.mockResolvedValue({})
    mockApi.deleteAppointment.mockResolvedValue({})
  })

  async function login() {
    render(<App />)
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'admin@barberflow.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar no sistema' }))
    await screen.findByText('André Silva')
  }

  it('autentica e apresenta o dashboard analítico', async () => {
    await login()
    expect(mockApi.login).toHaveBeenCalledWith({ email: 'admin@barberflow.com', password: '123456' })
    expect(await screen.findByText('Faturamento mensal')).toBeInTheDocument()
    expect(screen.getAllByText(/450,00/).length).toBeGreaterThan(0)
    expect(screen.getByText('Serviços mais vendidos')).toBeInTheDocument()
  })

  it('consulta o ViaCEP, cadastra cliente e atualiza a listagem', async () => {
    await login()
    fireEvent.click(screen.getByRole('button', { name: /Clientes/ }))
    fireEvent.click(await screen.findByRole('button', { name: /Novo cliente/ }))
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Caio' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'caio@email.com' } })
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '01001000' } })
    fireEvent.blur(screen.getByLabelText('CEP'))
    expect(await screen.findByText('Praça da Sé')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar cliente' }))
    await waitFor(() => expect(mockApi.createClient).toHaveBeenCalledWith({ nome: 'Caio', telefone: '3', email: 'caio@email.com', cep: '01001000' }))
  })

  it('cria agendamento e encerra a sessão', async () => {
    await login()
    fireEvent.click(await screen.findByRole('button', { name: /Novo agendamento/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar agendamento' }))
    await waitFor(() => expect(mockApi.createAppointment).toHaveBeenCalled())
    fireEvent.click(screen.getByRole('button', { name: 'Sair da conta' }))
    await waitFor(() => expect(mockApi.logout).toHaveBeenCalled())
    expect(await screen.findByText('Bem-vindo de volta')).toBeInTheDocument()
  })

  it('edita um cliente existente', async () => {
    await login()
    fireEvent.click(screen.getByRole('button', { name: /Clientes/ }))
    fireEvent.click((await screen.findAllByRole('button', { name: 'Editar' }))[0])
    expect(screen.getByText('Editar cliente')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Atualizada' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    await waitFor(() => expect(mockApi.updateClient).toHaveBeenCalledWith('c1', expect.objectContaining({ nome: 'Ana Atualizada' })))
  })

  it('confirma e exclui um agendamento', async () => {
    await login()
    fireEvent.click(screen.getByRole('button', { name: /Agendamentos/ }))
    fireEvent.click((await screen.findAllByRole('button', { name: 'Excluir' }))[0])
    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Excluir definitivamente' }))
    await waitFor(() => expect(mockApi.deleteAppointment).toHaveBeenCalledWith('a1'))
  })

  it('exibe falha de autenticação', async () => {
    mockApi.login.mockRejectedValueOnce(new Error('Credenciais inválidas'))
    render(<App />)
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'x@x.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'x' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar no sistema' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais inválidas')
  })
})
