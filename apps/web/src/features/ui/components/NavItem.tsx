import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}

export default function NavItem({ icon: Icon, label, active, badge, onClick }: Props) {
  return (
    <button onClick={onClick}
      className={`group w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg mt-0.5 transition-all duration-150 ${
        active
          ? 'bg-accent-light text-accent font-medium'
          : 'text-sec hover:text-tinta hover:bg-gray-100'
      }`}
    >
      <Icon size={18} className={`transition-transform duration-150 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pop">{badge}</span>
      )}
    </button>
  )
}
