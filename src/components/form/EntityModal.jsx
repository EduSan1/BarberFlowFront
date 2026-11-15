import { useState } from 'react'
import { Modal } from '../feedback/Modal'
import { FormActions } from '../feedback/FormActions'
import { Field } from './Field'

const definitions = {
  client: { noun: 'cliente', fields: [['nome', 'Nome'], ['telefone', 'Telefone'], ['email', 'E-mail', 'email'], ['cep', 'CEP']] },
  barber: { noun: 'barbeiro', fields: [['nome', 'Nome'], ['especialidade', 'Especialidade'], ['telefone', 'Telefone']] },
  service: { noun: 'serviço', fields: [['descricao', 'Descrição'], ['valor', 'Valor', 'number'], ['duracao', 'Duração em minutos', 'number']] },
}

export function EntityModal({ type, item, onClose, onSave, onLookupCep }) {
  const definition = definitions[type]
  const editing = Boolean(item)
  const initialForm = type === 'client' && item ? { nome: item.name, telefone: item.phone, email: item.email, cep: item.cep } : type === 'barber' && item ? { nome: item.name, especialidade: item.specialty, telefone: item.phone } : type === 'service' && item ? { descricao: item.name, valor: item.price, duracao: item.duration } : {}
  const initialAddress = type === 'client' && item?.city ? { logradouro: item.street, bairro: item.district, cidade: item.city, estado: item.state } : null
  const [form, setForm] = useState(initialForm)
  const [address, setAddress] = useState(initialAddress)
  const [error, setError] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const lookup = async () => {
    if (type !== 'client' || !form.cep) return
    setCepLoading(true)
    setError('')
    try { setAddress(await onLookupCep(form.cep)) } catch (lookupError) { setAddress(null); setError(lookupError.message) } finally { setCepLoading(false) }
  }
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try { await onSave(form) } catch (saveError) { setError(saveError.message) }
  }
  const verb = editing ? 'Editar' : 'Novo'
  return <Modal title={`${verb} ${definition.noun}`} onClose={onClose}><form className="form-grid" onSubmit={submit}>{definition.fields.map(([name, label, typeName = 'text']) => <Field key={name} label={label} name={name} type={typeName} value={form[name] || ''} onChange={update} onBlur={name === 'cep' ? lookup : undefined} required />)}{type === 'client' && <div className={`address-preview ${address ? 'found' : ''}`} aria-live="polite">{cepLoading ? 'Consultando ViaCEP...' : address ? <><strong>{address.logradouro || 'Logradouro não informado'}</strong><span>{address.bairro ? `${address.bairro} · ` : ''}{address.cidade}/{address.estado}</span></> : 'Informe o CEP para preencher o endereço automaticamente.'}</div>}{error && <p className="form-error" role="alert">{error}</p>}<FormActions onClose={onClose} label={editing ? 'Salvar alterações' : `Salvar ${definition.noun}`} /></form></Modal>
}
