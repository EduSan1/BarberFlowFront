import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function AppointmentsScreen({ appointments, onNew }) {
  const rows = appointments.map((item) => [<><strong>{item.time}</strong><small>{item.date}</small></>, <strong>{item.client}</strong>, item.service, item.barber, <span className="status">{item.status}</span>])
  return <><PageHead eyebrow="Operação" title="Agendamentos" description="Organize os horários e mantenha sua agenda sob controle." action="Novo agendamento" onAction={() => onNew('appointment')} /><DataTable headers={['Horário', 'Cliente', 'Serviço', 'Barbeiro', 'Status']} rows={rows} /></>
}
