import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function ClientsScreen({ clients, onNew }) {
  const rows = clients.map((item) => [<strong>{item.name}</strong>, item.phone, item.email, <span><strong>{item.city ? `${item.city}/${item.state}` : 'Endereço não consultado'}</strong><small>{item.street || item.cep}</small></span>])
  return <><PageHead eyebrow="Relacionamento" title="Clientes" description="Dados de contato e endereço validados pelo ViaCEP." action="Novo cliente" onAction={() => onNew('client')} /><DataTable headers={['Cliente', 'Contato', 'E-mail', 'Localização']} rows={rows} /></>
}
