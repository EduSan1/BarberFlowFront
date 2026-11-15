export function PageHead({ eyebrow, title, description, action, onAction }) {
  return <div className="page-head"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary" onClick={onAction}>＋ {action}</button>}</div>
}
