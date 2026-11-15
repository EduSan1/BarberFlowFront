export function FormActions({ onClose, label }) {
  return <div className="form-actions"><button className="secondary" type="button" onClick={onClose}>Cancelar</button><button className="primary" type="submit">{label}</button></div>
}
