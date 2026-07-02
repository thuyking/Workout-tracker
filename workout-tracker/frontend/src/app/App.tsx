import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'

import { useLocaleStore } from '../shared/i18n/localeStore'
import { router } from './routes'

function App() {
  const loadMessages = useLocaleStore((state) => state.loadMessages)

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  return <RouterProvider router={router} />
}

export default App
