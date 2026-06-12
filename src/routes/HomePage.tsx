import { useNavigate } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { BrandMark } from '../components/BrandMark'

const STATS = [
  { value: '20+', label: 'Tech conferences' },
  { value: '30', label: 'World-class speakers' },
  { value: '4', label: 'European cities' },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="home__backdrop" aria-hidden="true" />

      <main className="home__hero">
        <BrandMark size="lg" className="home__hero-brand" />
        <h1 className="home__slogan">
          <span className="home__slogan-line">
            Learn from the <span className="home__slogan-accent">best</span>.
          </span>
          <span className="home__slogan-line">
            Connect with the <span className="home__slogan-accent">best</span>.
          </span>
          <span className="home__slogan-line">
            Become your <span className="home__slogan-accent">best</span>.
          </span>
        </h1>
        <p className="home__subcopy">
          Follow <strong>top-rated speakers</strong> who are constantly{' '}
          <strong>pushing boundaries</strong>, bringing <strong>cutting-edge knowledge</strong>{' '}
          and <strong>mind-blowing insights</strong> to every stage.
        </p>
        <div className="home__cta">
          <Button
            themeColor="primary"
            size="large"
            rounded="full"
            className="cta-button"
            onClick={() => navigate('/speakers')}
          >
            Meet the speakers
          </Button>
          <Button
            themeColor="primary"
            size="large"
            rounded="full"
            className="home__secondary-cta"
            onClick={() => navigate('/conferences')}
          >
            Browse Conferences
          </Button>
        </div>

        <dl className="home__stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="home__stat">
              <dt className="home__stat-value">{stat.value}</dt>
              <dd className="home__stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  )
}
