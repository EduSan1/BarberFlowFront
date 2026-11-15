import { api } from '../src/services/api'

describe('cliente HTTP', () => {
  beforeEach(() => { global.fetch = jest.fn() })

  const response = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body })

  it('mapeia recursos recebidos do backend', async () => {
    fetch
      .mockResolvedValueOnce(response([{ id: 'c1', nome: 'Ana', telefone: '1', email: 'a@a.com', cep: '0', logradouro: 'Rua A', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP' }]))
      .mockResolvedValueOnce(response([{ id: 'b1', nome: 'Bia', especialidade: 'Corte', telefone: '2' }]))
      .mockResolvedValueOnce(response([{ id: 's1', descricao: 'Corte', valor: 40, duracao: 30 }]))
      .mockResolvedValueOnce(response([{ id: 'a1', cliente_id: 'c1', barbeiro_id: 'b1', servico_id: 's1', cliente: 'Ana', barbeiro: 'Bia', servico: 'Corte', data: '2026-11-12T00:00:00Z', hora: '10:00:00', status: 'agendado' }]))
    await expect(api.getClients()).resolves.toEqual([{ id: 'c1', name: 'Ana', phone: '1', email: 'a@a.com', cep: '0', street: 'Rua A', district: 'Centro', city: 'São Paulo', state: 'SP' }])
    await expect(api.getBarbers()).resolves.toEqual([{ id: 'b1', name: 'Bia', specialty: 'Corte', phone: '2' }])
    await expect(api.getServices()).resolves.toEqual([{ id: 's1', name: 'Corte', price: 40, duration: 30 }])
    await expect(api.getAppointments()).resolves.toEqual([{ id: 'a1', clientId: 'c1', barberId: 'b1', serviceId: 's1', client: 'Ana', barber: 'Bia', service: 'Corte', date: '2026-11-12', time: '10:00', status: 'agendado' }])
  })

  it('autentica, envia token e encerra sessão', async () => {
    fetch.mockResolvedValueOnce(response({ token: 't1', user: { nome: 'Ana' } }, 201)).mockResolvedValueOnce(response({}, 204))
    await expect(api.login({ email: 'a@a.com', password: '123' })).resolves.toEqual({ nome: 'Ana' })
    await api.logout()
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer t1')
  })

  it('consulta dashboard e ViaCEP pelo backend', async () => {
    fetch.mockResolvedValueOnce(response({ metrics: {} })).mockResolvedValueOnce(response({ cidade: 'São Paulo' }))
    await expect(api.getDashboard('2026-11')).resolves.toEqual({ metrics: {} })
    await expect(api.lookupCep('01001-000')).resolves.toEqual({ cidade: 'São Paulo' })
    expect(fetch.mock.calls[1][0]).toContain('/api/cep/01001000')
  })

  it('propaga mensagem de erro do backend', async () => {
    fetch.mockResolvedValueOnce(response({ error: 'Falha esperada' }, 400))
    await expect(api.getClients()).rejects.toThrow('Falha esperada')
  })

  it('envia edições e exclusões de todos os recursos', async () => {
    for (let index = 0; index < 8; index += 1) fetch.mockResolvedValueOnce(response({}))
    await api.updateClient('c1', { nome: 'Ana' })
    await api.deleteClient('c1')
    await api.updateBarber('b1', { nome: 'Bia' })
    await api.deleteBarber('b1')
    await api.updateService('s1', { descricao: 'Corte' })
    await api.deleteService('s1')
    await api.updateAppointment('a1', { status: 'confirmado' })
    await api.deleteAppointment('a1')
    expect(fetch.mock.calls.map((call) => call[1].method)).toEqual(['PUT', 'DELETE', 'PUT', 'DELETE', 'PUT', 'DELETE', 'PUT', 'DELETE'])
  })
})
