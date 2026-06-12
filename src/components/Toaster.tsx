import { useToastStore } from '../store/toastStore'

/** Fixed top-right stack of transient toast notifications. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          className="toast"
          onClick={() => dismiss(toast.id)}
          title="Dismiss"
        >
          <span className="toast__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M5 12.5l4 4 10-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="toast__body">
            <span className="toast__message">{toast.message}</span>
            {toast.description && (
              <span className="toast__description">{toast.description}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}
