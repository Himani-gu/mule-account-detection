export default function StatusPill({ status }) {
  const styles = {
    alert  : 'bg-red-50 text-red-700 border border-red-200',
    review : 'bg-amber-50 text-amber-700 border border-amber-200',
    safe   : 'bg-green-50 text-green-700 border border-green-200',
  }
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}