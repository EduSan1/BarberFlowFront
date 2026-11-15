import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function ServicesScreen({ services, onNew, onEdit, onDelete }) {
  const rows = services.map((item) => [<strong>{item.name}</strong>, `${item.duration} min`, <strong>R$ {Number(item.price).toFixed(2).replace('.', ',')}</strong>, <RowActions onEdit={() => onEdit('service', item)} onDelete={() => onDelete('service', item)} />])
  return <><PageHead eyebrow="Catálogo" title="Serviços" description="Defina os serviços oferecidos, seus valores e duração." action="Novo serviço" onAction={() => onNew('service')} /><DataTable headers={['Serviço', 'Duração', 'Preço', 'Ações']} rows={rows} /></>
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="action-button" type="button" onClick={onEdit}>Editar</button><button className="action-button delete" type="button" onClick={onDelete}>Excluir</button></div>
}
