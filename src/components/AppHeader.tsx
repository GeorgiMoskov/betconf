import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout'
import { BrandMark } from './BrandMark'

const NAV_LINKS = [
  { to: '/conferences', label: 'Conferences' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/account', label: 'My Account' },
]

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppBar className="conferences__bar">
      <AppBarSection>
        <button
          type="button"
          className="conferences__brand"
          onClick={() => navigate('/')}
          aria-label="FireRaven Conference Hub — home"
        >
          <BrandMark />
        </button>
      </AppBarSection>
      <AppBarSpacer />
      <AppBarSection>
        <nav className="app-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              fillMode="flat"
              className={
                location.pathname === link.to ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
              onClick={() => navigate(link.to)}
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </AppBarSection>
    </AppBar>
  )
}
