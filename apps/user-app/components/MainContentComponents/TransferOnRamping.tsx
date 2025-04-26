"use client";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import BalanceAmount from "../BalanceAmount";
import AddMoneyForm from "../AddMoneyForm";
import TransactionHistory from "../TransactionHistory";
import useSWR from "swr";
import { fetcher } from "../../helper/apiClient";
import { useAppDispatch, useAppSelector } from "@repo/store/redux";
import { setCurrentBalanceState } from "@repo/store/user-balance";
import { RootState } from "@repo/store/store";
import { useEffect } from "react";

const TransferOnRamping = () => {
  const { data, isLoading } = useSWR("/api/v1/user-balance", fetcher);
  const dispatch = useAppDispatch()
  const {currentBalanceState} = useAppSelector((state:RootState)=> state.userBalanceReducer)
    const unlockedBalance = data?.unlockedBalance || 0;
  const lockedBalance = data?.lockedBalance || 0
  const totalBalance = unlockedBalance + lockedBalance
  useEffect(()=>{
    if(!isLoading && data){
      dispatch(setCurrentBalanceState({lockedBalance , unlockedBalance}))
    }
  }, [isLoading])
  
  return (
    <div className="flex flex-col h-full p-4 space-y-8 ">
      <div className="-mt-4">
        <h1 className="text-2xl font-bold tracking-tight">Transfer Money</h1>
        <p className="text-muted-foreground">
          Add money to your wallet or view your transaction history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-4 md:col-span-2 lg:col-span-1">
          <Card className="bg-gradient-to-br from-violet-500 to-purple-700 text-white ">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-32 h-12 animate-pulse bg-gradient-to-br from-violet-400 to-purple-600"></div>
              ) : (
                <div className="text-3xl font-bold">
                  ₹{currentBalanceState.lockedBalance!+currentBalanceState.unlockedBalance!}.00
                </div>
              )}
              <div className="flex items-center mt-4 text-sm">
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 mr-2"
                >
                  Available
                </Badge>
                <span>Last updated: Today, 7:45 PM</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <BalanceAmount
              isLoading={isLoading}
              amount={currentBalanceState.unlockedBalance?.toString()!}
              balanceType="unlocked"
            />
            <BalanceAmount
              isLoading={isLoading}
              amount={currentBalanceState.lockedBalance?.toString()!}
              balanceType="locked"
            />
          </div>
        </div>
        <AddMoneyForm />
      </div>
      <div className="grid grid-cols-1"></div>
      <TransactionHistory />
    </div>
  );
};

export default TransferOnRamping;