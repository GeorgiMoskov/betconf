import { create } from 'zustand'

/** A transient notification shown in the top-right corner. */
export interface Toast {
  id: number
  /** Headline text. */
  message: string
  /** Optional secondary line. */
  description?: string
}

/** How long a toast stays on screen before auto-dismissing (ms). */
const TOAST_DURATION = 2000

interface ToastState {
  toasts: Toast[]
  /** Show a toast; it auto-dismisses after a short delay. */
  notify: (message: string, description?: string) => void
  /** Remove a toast by id. */
  dismiss: (id: number) => void
}

let nextId = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  notify: (message, description) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { id, message, description }] }))
    window.setTimeout(() => get().dismiss(id), TOAST_DURATION)
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
