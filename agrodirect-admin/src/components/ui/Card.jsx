export default function Card({ children, className = '', padded = true }) {
  return (
    <div className={`rounded-card border border-soil-200 bg-white shadow-card ${padded ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  )
}
