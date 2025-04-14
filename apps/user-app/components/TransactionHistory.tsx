"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import NewTransaction from "./NewTransaction";
import { useAppSelector } from "@repo/store/redux";
import { RootState } from "@repo/store/store";
import { UserTransactionType } from "@repo/store/user-transaction";


export type TransactionProp= Omit<UserTransactionType , "status"> & {status :"Processing" | "Success" | "Failure"}
const TransactionHistory = () => {
  const  {transaction} = useAppSelector((state:RootState)=>state.userTransactionsReducer)
  console.log("transaction",transaction)
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle >
          <p className="text-2xl font-semibold">Transaction History</p>
          <p className="text-gray-500 text-sm">View all your recent wallet transactions.</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-5">
        {
         transaction.map((transaction:TransactionProp, index)=>{
            return <NewTransaction key={index} {...transaction} />
          })
        }

      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
