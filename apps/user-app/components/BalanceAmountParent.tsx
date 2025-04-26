"use client"

import BalanceAmountClient from "./BalanceAmountClient"
import ServerSidedBalanceAmount from "./ServerSidedBalanceAmount"

const BalanceAmountParent = () => {
  return (
    <BalanceAmountClient>
        <ServerSidedBalanceAmount/>
    </BalanceAmountClient>
  )
}

export default BalanceAmountParent