import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@progress/kendo-react-buttons'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs'
import { AppHeader } from '../components/AppHeader'
import { CoinIcon } from '../components/CoinIcon'
import { CoinWallet } from '../components/CoinWallet'
import { MERCH } from '../data/merch'
import type { MerchCategory, MerchItem } from '../data/merch'
import { computeCoins } from '../lib/coins'
import { useAccountStore } from '../store/accountStore'

const CATEGORY_LABELS: Record<MerchCategory, string> = {
  apparel: 'Apparel',
  drinkware: 'Drinkware',
  stickers: 'Stickers',
}

type Filter = 'all' | MerchCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'stickers', label: 'Stickers' },
]

interface OrderConfirmation {
  item: MerchItem
  remaining: number
}

export function ShopPage() {
  const registered = useAccountStore((state) => state.registered)
  const calendar = useAccountStore((state) => state.calendar)
  const reviews = useAccountStore((state) => state.reviews)
  const redeemed = useAccountStore((state) => state.redeemed)
  const redeemMerch = useAccountStore((state) => state.redeemMerch)

  const coins = useMemo(
    () => computeCoins({ registered, calendar, reviews, redeemed }),
    [registered, calendar, reviews, redeemed],
  )

  const redeemedCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const id of redeemed) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    return counts
  }, [redeemed])

  const [filter, setFilter] = useState<Filter>('all')
  const [inspecting, setInspecting] = useState<MerchItem | null>(null)
  const [order, setOrder] = useState<OrderConfirmation | null>(null)

  const items = useMemo(
    () => (filter === 'all' ? MERCH : MERCH.filter((item) => item.category === filter)),
    [filter],
  )

  function placeOrder(item: MerchItem) {
    if (coins.balance < item.price) {
      return
    }
    redeemMerch(item.id)
    setInspecting(null)
    setOrder({ item, remaining: coins.balance - item.price })
  }

  return (
    <div className="conferences">
      <AppHeader />

      <main className="conferences__content shop-page">
        <section className="shop-hero">
          <div className="shop-hero__intro">
            <span className="account-hero__eyebrow">FireRaven Swag</span>
            <h1 className="account-hero__name">The Shop</h1>
            <p className="account-hero__meta">
              Spend the credits you earn at conferences on official merch.{' '}
              <Link className="account-hero__link" to="/account">
                Back to my account
              </Link>
            </p>
          </div>
          <CoinWallet
            balance={coins.balance}
            caption={`${coins.spent.toLocaleString('en-US')} spent so far`}
          />
        </section>

        <div className="shop-filters" role="tablist" aria-label="Merch categories">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`conf-tab${filter === item.id ? ' conf-tab--active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="merch-grid">
          {items.map((item) => {
            const owned = redeemedCounts.get(item.id) ?? 0
            const affordable = coins.balance >= item.price
            return (
              <article key={item.id} className="merch-card">
                <button
                  type="button"
                  className="merch-card__media merch-card__media--btn"
                  onClick={() => setInspecting(item)}
                  aria-label={`Inspect ${item.name}`}
                >
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <span className="merch-card__tag">{CATEGORY_LABELS[item.category]}</span>
                  {owned > 0 && (
                    <span className="merch-card__owned" title={`Ordered ${owned}×`}>
                      ✓ {owned}
                    </span>
                  )}
                  <span className="merch-card__inspect">Inspect</span>
                </button>
                <div className="merch-card__body">
                  <h4 className="merch-card__name">{item.name}</h4>
                  <p className="merch-card__desc">{item.description}</p>
                  <div className="merch-card__foot">
                    <span className="merch-card__price">
                      <CoinIcon size={18} />
                      {item.price}
                    </span>
                    <Button
                      themeColor="primary"
                      disabled={!affordable}
                      onClick={() => placeOrder(item)}
                    >
                      {affordable ? 'Order' : 'Not enough'}
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      {inspecting && (
        <Dialog
          title={inspecting.name}
          onClose={() => setInspecting(null)}
          className="merch-dialog"
          width={520}
        >
          <div className="merch-dialog__body">
            <img
              className="merch-dialog__img"
              src={inspecting.image}
              alt={inspecting.name}
            />
            <span className="merch-card__tag merch-dialog__tag">
              {CATEGORY_LABELS[inspecting.category]}
            </span>
            <p className="merch-dialog__desc">{inspecting.description}</p>
            <div className="merch-dialog__meta">
              <span className="merch-card__price">
                <CoinIcon size={20} />
                {inspecting.price} credits
              </span>
              <span className="merch-dialog__balance">
                Balance: {coins.balance.toLocaleString('en-US')}
              </span>
            </div>
            {coins.balance < inspecting.price && (
              <p className="merch-dialog__warn">
                You need {inspecting.price - coins.balance} more credits for this item.
              </p>
            )}
          </div>
          <DialogActionsBar>
            <Button onClick={() => setInspecting(null)}>Close</Button>
            <Button
              themeColor="primary"
              disabled={coins.balance < inspecting.price}
              onClick={() => placeOrder(inspecting)}
            >
              Order for {inspecting.price} credits
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {order && (
        <Dialog
          title="Order placed!"
          onClose={() => setOrder(null)}
          className="merch-dialog"
          width={440}
        >
          <div className="merch-dialog__confirm">
            <span className="merch-dialog__check" aria-hidden="true">
              ✓
            </span>
            <p className="merch-dialog__confirm-text">
              Your <strong>{order.item.name}</strong> is on its way. We’ll email you the
              shipping details.
            </p>
            <p className="merch-dialog__confirm-balance">
              <CoinIcon size={16} />
              {order.remaining.toLocaleString('en-US')} credits remaining
            </p>
          </div>
          <DialogActionsBar>
            <Button themeColor="primary" onClick={() => setOrder(null)}>
              Keep shopping
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  )
}
