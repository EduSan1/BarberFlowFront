import { useState } from 'react'
import { Modal } from '../../components/feedback/Modal'
import { Field } from '../../components/form/Field'
import { FormActions } from '../../components/feedback/FormActions'

export function AppointmentModal({ clients, barbers, services, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({ clienteId: clients[0]?.id || '', servicoId: services[0]?.id || '', barbeiroId: barbers[0]?.id || '', data: today, hora: '10:00' })
  const [error, setError] = useState('')
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    try {
      await onSave({ ...form, status: 'agendado' })
    } catch (saveError) {
      setError(saveError.message)
    }
  }
  return <Modal title="Novo agendamento" onClose={onClose}><form className="form-grid" onSubmit={submit}><SelectField label="Cliente" name="clienteId" value={form.clienteId} onChange={update} options={clients} /><SelectField label="Serviço" name="servicoId" value={form.servicoId} onChange={update} options={services} /><SelectField label="Barbeiro" name="barbeiroId" value={form.barbeiroId} onChange={update} options={barbers} /> <Field label="Data" name="data" type="date" value={form.data} onChange={update} required /><Field label="Horário" name="hora" type="time" value={form.hora} onChange={update} required />{error && <p className="form-error" role="alert">{error}</p>}<FormActions onClose={onClose} label="Salvar agendamento" /></form></Modal>
}

function SelectField({ label, name, value, onChange, options }) {
  return <div className="field"><label htmlFor={name}>{label}</label><select id={name} name={name} value={value} onChange={onChange} required>{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
}
