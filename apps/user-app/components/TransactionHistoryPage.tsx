"use server"
import getTransactionHistory from "../actions/transactionHistory"
import TransactionHistory from "./TransactionHistory"

const TransactionHistoryPage = async() => {
    let transactions = await getTransactionHistory()
    transactions ={ ...transactions , 
        transactionHistory : transactions.transactionHistory ?? []}

  return (
    
         <TransactionHistory initialTransactions= {transactions}/> 
    
  )
}

export default TransactionHistoryPage