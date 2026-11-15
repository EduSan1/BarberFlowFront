export function Field({ label, type = 'text', ...props }) {
  const id = props.id || label.toLowerCase().replaceAll(' ', '-')
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} type={type} {...props} /></div>
}
