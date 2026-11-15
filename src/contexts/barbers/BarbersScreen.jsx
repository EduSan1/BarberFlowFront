import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function BarbersScreen({ barbers, onNew, onEdit, onDelete }) {
  const rows = barbers.map((item) => [<strong>{item.name}</strong>, item.specialty, item.phone, <RowActions onEdit={() => onEdit('barber', item)} onDelete={() => onDelete('barber', item)} />])
  return <><PageHead eyebrow="Equipe" title="Barbeiros" description="Mantenha as informações dos profissionais sempre atualizadas." action="Novo barbeiro" onAction={() => onNew('barber')} /><DataTable headers={['Profissional', 'Especialidade', 'Contato', 'Ações']} rows={rows} /></>
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="action-button" type="button" onClick={onEdit}>Editar</button><button className="action-button delete" type="button" onClick={onDelete}>Excluir</button></div>
}
