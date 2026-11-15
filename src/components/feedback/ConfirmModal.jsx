import { useState } from 'react'
import { Modal } from './Modal'

export function ConfirmModal({ title, message, onClose, onConfirm }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const confirm = async () => {
    setLoading(true)
    setError('')
    try { await onConfirm() } catch (confirmError) { setError(confirmError.message); setLoading(false) }
  }
  return <Modal title={title} onClose={onClose}><p className="confirm-message">{message}</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="confirm-actions"><button className="secondary" type="button" onClick={onClose}>Manter registro</button><button className="danger" type="button" onClick={confirm} disabled={loading}>{loading ? 'Excluindo...' : 'Excluir definitivamente'}</button></div></Modal>
}
