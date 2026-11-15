import { PageHead } from '../../components/layout/PageHead'
import { DataTable } from '../../components/data/DataTable'

export function ServicesScreen({ services, onNew }) {
  return <><PageHead eyebrow="Catálogo" title="Serviços" description="Defina os serviços oferecidos, seus valores e duração." action="Novo serviço" onAction={() => onNew('service')} /><DataTable headers={['Serviço', 'Duração', 'Preço']} rows={services.map((item) => [<strong>{item.name}</strong>, `${item.duration} min`, <strong>R$ {Number(item.price).toFixed(2).replace('.', ',')}</strong>])} /></>
}
