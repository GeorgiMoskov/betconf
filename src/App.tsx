import { Button } from '@progress/kendo-react-buttons'
import './App.css'

function App() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', gap: '1rem' }}>
      <h1>BETCONF</h1>
      <p>Conference organizer — base environment is live.</p>
      <Button themeColor="primary">KendoReact is wired up</Button>
    </main>
  )
}

export default App
