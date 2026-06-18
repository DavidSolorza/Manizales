import { Home, GraduationCap } from 'lucide-react'

interface Props {
  onSelect: (role: 'ARRIENDADOR' | 'ESTUDIANTE') => void
}

export default function RoleSelector({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
        <h2 className="text-xl font-display font-bold text-tinta text-center">Bienvenido a Arriendos U</h2>
        <p className="text-sm text-sec text-center mt-1 mb-5">Decinos que tipo de usuario sos</p>

        <div className="space-y-3">
          <button onClick={() => onSelect('ARRIENDADOR')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent-light transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
              <Home size={22} className="text-accent group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-medium text-tinta">Arrendador</p>
              <p className="text-xs text-sec">Publica lugares, administra precios y disponibilidad</p>
            </div>
          </button>

          <button onClick={() => onSelect('ESTUDIANTE')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-accent-light transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <GraduationCap size={22} className="text-amber-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-medium text-tinta">Estudiante</p>
              <p className="text-xs text-sec">Busca y encuentra el lugar ideal para alquilar</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
