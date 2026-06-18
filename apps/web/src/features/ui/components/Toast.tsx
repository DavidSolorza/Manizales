import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastCtx {
  toast: (message: string, variant?: ToastVariant) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(Ctx)

let nextId = 0

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = nextId++
    setItems((prev) => [...prev, { id, message, variant }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {items.map((item) => {
          const Icon = iconMap[item.variant]
          return (
            <div key={item.id}
              className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl border shadow-md text-sm font-medium animate-slide-up ${colorMap[item.variant]}`}>
              <Icon size={18} className="shrink-0" />
              <span>{item.message}</span>
              <button onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))} className="ml-2 hover:opacity-60">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}
