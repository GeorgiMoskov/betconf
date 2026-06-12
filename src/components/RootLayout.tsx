import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from './Toaster'

/**
 * App shell that resets the scroll position to the top whenever the route
 * changes, so navigating between pages always starts at the top.
 */
export function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
