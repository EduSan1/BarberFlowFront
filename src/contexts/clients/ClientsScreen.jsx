import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function ClientsScreen({ clients, onNew, onEdit, onDelete }) {
  const rows = clients.map((item) => [<strong>{item.name}</strong>, item.phone, item.email, <span><strong>{item.city ? `${item.city}/${item.state}` : 'Endereço não consultado'}</strong><small>{item.street || item.cep}</small></span>, <RowActions onEdit={() => onEdit('client', item)} onDelete={() => onDelete('client', item)} />])
  return <><PageHead eyebrow="Relacionamento" title="Clientes" description="Dados de contato e endereço validados pelo ViaCEP." action="Novo cliente" onAction={() => onNew('client')} /><DataTable headers={['Cliente', 'Contato', 'E-mail', 'Localização', 'Ações']} rows={rows} /></>
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="action-button" type="button" onClick={onEdit}>Editar</button><button className="action-button delete" type="button" onClick={onDelete}>Excluir</button></div>
}
