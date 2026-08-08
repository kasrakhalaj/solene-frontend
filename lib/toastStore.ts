import { create } from 'zustand'

export type ToastType = 'success' | 'info' | 'error'

export interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    
    // Auto remove after 4 seconds if no action, or 6 seconds if there is an action
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, toast.action ? 6000 : 4000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}))
