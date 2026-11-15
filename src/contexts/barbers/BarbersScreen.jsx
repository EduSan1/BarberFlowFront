import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function BarbersScreen({ barbers, onNew }) {
  return <><PageHead eyebrow="Equipe" title="Barbeiros" description="Mantenha as informações dos profissionais sempre atualizadas." action="Novo barbeiro" onAction={() => onNew('barber')} /><DataTable headers={['Profissional', 'Especialidade', 'Contato']} rows={barbers.map((item) => [<strong>{item.name}</strong>, item.specialty, item.phone])} /></>
}
