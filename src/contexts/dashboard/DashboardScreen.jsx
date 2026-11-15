import { PageHead } from '../../components/layout/PageHead'
import './dashboard.css'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' })
const statusNames = { agendado: 'Agendados', confirmado: 'Confirmados', concluido: 'Concluídos', cancelado: 'Cancelados' }
const statusColors = { agendado: '#d7f06b', confirmado: '#4da982', concluido: '#235c45', cancelado: '#e98d75' }

function MetricCard({ label, value, detail, icon, tone = '' }) {
  return <article className={`insight-card ${tone}`}><div className="insight-icon" aria-hidden="true">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>
}

function EmptyState({ children }) {
  return <div className="analytics-empty">{children}</div>
}

export function DashboardScreen({ user, dashboard, dashboardMonth, dashboardLoading, onMonthChange, onNew }) {
  if (!dashboard) return <div className="dashboard-loading" role="status">Preparando seus indicadores...</div>
  const { metrics, trend, services, statuses, hours, days, developmentClients } = dashboard
  const maxRevenue = Math.max(...trend.map((item) => item.revenue), 1)
  const maxService = Math.max(...services.map((item) => item.total), 1)
  const maxDay = Math.max(...days.map((item) => item.total), 1)
  const statusTotal = statuses.reduce((sum, item) => sum + item.total, 0)
  let cursor = 0
  const donutParts = statuses.map((item) => {
    const start = cursor
    cursor += statusTotal ? (item.total / statusTotal) * 100 : 0
    return `${statusColors[item.status] || '#aab6af'} ${start}% ${cursor}%`
  })
  const donut = statusTotal ? `conic-gradient(${donutParts.join(',')})` : 'conic-gradient(#edf1ee 0 100%)'

  return <div className="dashboard-page">
    <div className="dashboard-heading"><PageHead eyebrow={`Olá, ${user.nome.split(' ')[0]}`} title="Painel de desempenho" description="Decisões melhores começam com uma visão clara da operação." action="Novo agendamento" onAction={() => onNew('appointment')} /><label className="month-filter">Período<input type="month" value={dashboardMonth} onChange={(event) => onMonthChange(event.target.value)} aria-label="Mês dos indicadores" /></label></div>
    {dashboardLoading && <div className="dashboard-refresh" role="status">Atualizando indicadores...</div>}

    <section className="insight-grid" aria-label="Indicadores principais">
      <MetricCard label="Faturamento mensal" value={currency.format(metrics.revenue)} detail="Atendimentos concluídos" icon="R$" tone="featured" />
      <MetricCard label="Ticket médio" value={currency.format(metrics.averageTicket)} detail="Valor médio por atendimento" icon="↗" />
      <MetricCard label="Agendamentos" value={metrics.appointments} detail="Registrados no período" icon="◷" />
      <MetricCard label="Clientes cadastrados" value={metrics.clients} detail="Base total de relacionamento" icon="♙" />
      <MetricCard label="Horário mais procurado" value={metrics.peakHour} detail="Pico de demanda do mês" icon="⌁" />
      <MetricCard label="Clientes a desenvolver" value={metrics.developmentClients} detail="Sem visita concluída há 90 dias" icon="◎" tone="attention" />
    </section>

    <section className="analytics-grid">
      <article className="analytics-card revenue-chart">
        <header><div><span className="section-kicker">Evolução</span><h2>Faturamento dos últimos 6 meses</h2></div><strong>{currency.format(metrics.revenue)}</strong></header>
        <div className="bar-chart" role="img" aria-label="Gráfico de faturamento dos últimos seis meses">{trend.map((item) => <div className="bar-column" key={item.month}><span className="bar-value">{item.revenue ? currency.format(item.revenue).replace(/,00$/, '') : '—'}</span><div className="bar-track"><i style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, item.revenue ? 8 : 2)}%` }} /></div><small>{monthLabel.format(new Date(`${item.month}-01T00:00:00Z`)).replace('.', '')}</small></div>)}</div>
      </article>

      <article className="analytics-card status-card">
        <header><div><span className="section-kicker">Operação</span><h2>Status dos agendamentos</h2></div></header>
        <div className="donut-layout"><div className="donut" style={{ background: donut }}><span><strong>{statusTotal}</strong><small>Total</small></span></div><div className="legend">{statuses.length ? statuses.map((item) => <div key={item.status}><i style={{ background: statusColors[item.status] }} /><span>{statusNames[item.status] || item.status}</span><strong>{item.total}</strong></div>) : <EmptyState>Sem agendamentos no período</EmptyState>}</div></div>
      </article>

      <article className="analytics-card services-card">
        <header><div><span className="section-kicker">Preferências</span><h2>Serviços mais vendidos</h2></div><span className="highlight-pill">Líder: {metrics.topService}</span></header>
        <div className="ranking-list">{services.map((item, index) => <div className="ranking-row" key={item.name}><span className="rank">{String(index + 1).padStart(2, '0')}</span><div><div className="ranking-label"><strong>{item.name}</strong><span>{item.total} atendimentos</span></div><div className="progress"><i style={{ width: `${(item.total / maxService) * 100}%` }} /></div></div><strong>{currency.format(item.revenue)}</strong></div>)}</div>
      </article>

      <article className="analytics-card demand-card">
        <header><div><span className="section-kicker">Demanda diária</span><h2>Agendamentos por dia</h2></div></header>
        <div className="day-chart" role="img" aria-label="Agendamentos por dia do mês">{days.map((item) => <div key={item.date} title={`${item.date}: ${item.total}`}><i style={{ height: `${Math.max((item.total / maxDay) * 100, item.total ? 10 : 3)}%` }} /><small>{Number(item.date.slice(-2)) % 5 === 0 || item.date.endsWith('-01') ? item.date.slice(-2) : ''}</small></div>)}</div>
      </article>

      <article className="analytics-card hour-card">
        <header><div><span className="section-kicker">Horários de pico</span><h2>Faixas mais procuradas</h2></div></header>
        <div className="hour-list">{hours.length ? hours.map((item, index) => <div key={item.hour}><span>{index + 1}</span><strong>{item.hour}</strong><div><i style={{ width: `${(item.total / Math.max(hours[0].total, 1)) * 100}%` }} /></div><b>{item.total}</b></div>) : <EmptyState>Sem horários no período</EmptyState>}</div>
      </article>

      <article className="analytics-card development-card">
        <header><div><span className="section-kicker">Relacionamento</span><h2>Clientes a desenvolver</h2></div><span className="highlight-pill warm">90+ dias</span></header>
        <p>Clientes sem atendimento concluído recente e com oportunidade de reativação.</p>
        <div className="development-list">{developmentClients.length ? developmentClients.map((client) => <div key={client.id}><span>{client.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{client.name}</strong><small>{client.last_visit ? `Última visita em ${new Date(client.last_visit).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}` : 'Ainda não realizou atendimento'}</small></div></div>) : <EmptyState>Todos os clientes estão ativos</EmptyState>}</div>
      </article>
    </section>
  </div>
}
