import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function AppointmentsScreen({ appointments, onNew, onEdit, onDelete }) {
  const rows = appointments.map((item) => [<><strong>{item.time}</strong><small>{item.date}</small></>, <strong>{item.client}</strong>, item.service, item.barber, <span className={`status ${item.status}`}>{item.status}</span>, <RowActions onEdit={() => onEdit('appointment', item)} onDelete={() => onDelete('appointment', item)} />])
  return <><PageHead eyebrow="Operação" title="Agendamentos" description="Reagende, altere o status ou exclua atendimentos." action="Novo agendamento" onAction={() => onNew('appointment')} /><DataTable headers={['Horário', 'Cliente', 'Serviço', 'Barbeiro', 'Status', 'Ações']} rows={rows} /></>
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="action-button" type="button" onClick={onEdit}>Editar</button><button className="action-button delete" type="button" onClick={onDelete}>Excluir</button></div>
}
