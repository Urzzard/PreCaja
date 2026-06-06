import { useState } from 'react'
import { ActiveBoxPage } from './pages/ActiveBoxPage'
import { HistoryPage } from './pages/HistoryPage'

/** Vista de nivel superior: la compra en curso o el historial. */
type Route = 'home' | 'history'

export default function App() {
  const [route, setRoute] = useState<Route>('home')

  if (route === 'history') {
    return <HistoryPage onExit={() => setRoute('home')} />
  }

  return <ActiveBoxPage onShowHistory={() => setRoute('history')} />
}
