"use client"
// components/TransactionHistoryPageWrapper.tsx

import { useEffect, useState } from 'react'

const TransactionHistoryPageWrapper = () => {
  const [Component, setComponent] = useState<any>(null)

  useEffect(() => {
    // Dynamically import the server component on the client side
    // This works because it's loaded via a special mechanism in Next.js
    import('./TransactionHistoryPage')
      .then((mod) => {
        setComponent(() => mod.default)
      })
      .catch(err => {
        console.error('Failed to load transaction history component:', err)
      })
  }, [])

  if (!Component) {
    return <div>Loading transaction history...</div>
  }

  return <Component />
}

export default TransactionHistoryPageWrapper