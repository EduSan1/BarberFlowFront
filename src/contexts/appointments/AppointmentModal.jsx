import { useState } from 'react'
import { Modal } from '../../components/feedback/Modal'
import { Field } from '../../components/form/Field'
import { FormActions } from '../../components/feedback/FormActions'

export function AppointmentModal({ item, clients, barbers, services, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState(item ? { clienteId: item.clientId, servicoId: item.serviceId, barbeiroId: item.barberId, data: item.date, hora: item.time, status: item.status } : { clienteId: clients[0]?.id || '', servicoId: services[0]?.id || '', barbeiroId: barbers[0]?.id || '', data: today, hora: '10:00', status: 'agendado' })
  const [error, setError] = useState('')
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try { await onSave(form) } catch (saveError) { setError(saveError.message) }
  }
  return <Modal title={item ? 'Editar agendamento' : 'Novo agendamento'} onClose={onClose}><form className="form-grid" onSubmit={submit}><SelectField label="Cliente" name="clienteId" value={form.clienteId} onChange={update} options={clients} /><SelectField label="Serviço" name="servicoId" value={form.servicoId} onChange={update} options={services} /><SelectField label="Barbeiro" name="barbeiroId" value={form.barbeiroId} onChange={update} options={barbers} /><Field label="Data" name="data" type="date" value={form.data} onChange={update} required /><Field label="Horário" name="hora" type="time" value={form.hora} onChange={update} required /><div className="field"><label htmlFor="status">Status</label><select className="status-select" id="status" name="status" value={form.status} onChange={update}><option value="agendado">Agendado</option><option value="confirmado">Confirmado</option><option value="concluido">Concluído</option><option value="cancelado">Cancelado</option></select></div>{error && <p className="form-error" role="alert">{error}</p>}<FormActions onClose={onClose} label={item ? 'Salvar alterações' : 'Salvar agendamento'} /></form></Modal>
}

function SelectField({ label, name, value, onChange, options }) {
  return <div className="field"><label htmlFor={name}>{label}</label><select className="status-select" id={name} name={name} value={value} onChange={onChange} required>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></div>
}
