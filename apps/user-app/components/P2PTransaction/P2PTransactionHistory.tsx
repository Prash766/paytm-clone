"use client"

import { useEffect, useState, useRef } from "react"
import { Badge, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/ui"
import { ArrowDown, ArrowUp, Check, Clock, X } from "lucide-react"
import useSWR from "swr"
import { Transaction } from "@repo/store/p2ptransaction"
import { useAppDispatch, useAppSelector } from "@repo/store/redux"
import { RootState } from "@repo/store/store"
import { setP2PTransactionHistory, setP2PHasMore, setCusorForP2PTransactionHitory } from "@repo/store/p2ptransaction"

type ApiResponse = {
  success: boolean,
  transactions: Transaction[],
  nextCursor?: number,
  hasMore: boolean
}

const fetcher = (...args: [input: RequestInfo, init?: RequestInit]) => fetch(...args).then((res) => res.json())

const P2PTransactionHistory = () => {
  const [cursor, setCursor] = useState<string>("")
  const { p2pTransactions } = useAppSelector((state: RootState) => state.P2PTransactionHistoryReducer)
  const dispatch = useAppDispatch()
  const { data, error, isLoading } = useSWR<ApiResponse>(`api/v1/p2phistory?cursor=${cursor}`, fetcher)
  const [activeTab, setActiveTab] = useState("all")
  
  // Set up a separate effect to handle data changes
  useEffect(() => {
    if(data){
      if (data?.transactions?.length > 0) {
        // Use the action creator instead of type string
        dispatch(setP2PTransactionHistory(data.transactions))
      }
      
      // Also update the other state values
      if (data.nextCursor) {
        dispatch(setCusorForP2PTransactionHitory(data.nextCursor))
      }
      
      dispatch(setP2PHasMore(data.hasMore))
    }
  }, [data, dispatch])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const getFilteredTransactions = (type: string | null) => {
    if (!p2pTransactions || p2pTransactions.length === 0) return []
    if (type === "all" || !type) return p2pTransactions
    return p2pTransactions.filter((tx: Transaction) => tx.direction === type)
  }
  
  const loadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor.toString())
      // The dispatch in loadMore isn't needed as the data fetching will trigger the useEffect
    }
  }

  return (
    <Card className="w-full shadow-xl border-0 rounded-xl overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b py-4">
        <CardTitle className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Recent Transactions</h1>
          <span className="text-xs text-green-600 font-medium">
            See All
          </span>
        </CardTitle>
      </CardHeader>

      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 pt-3">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 rounded-lg p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs data-[state=active]:bg-white data-[state=active]:shadow"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="rounded-md text-xs data-[state=active]:bg-white data-[state=active]:shadow"
            >
              Sent
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="rounded-md text-xs data-[state=active]:bg-white data-[state=active]:shadow"
            >
              Received
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="px-4 pb-4 pt-3 max-h-96 overflow-y-auto">
          {isLoading && !p2pTransactions?.length ? (
            <div className="py-8 text-center text-gray-500">
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-gray-500">
              <p>Error loading transactions. Please try again.</p>
            </div>
          ) : (
            ["all", "sent", "received"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-2 p-0">
                <div className="space-y-1">
                  {getFilteredTransactions(tabValue).length > 0 ? (
                    <>
                      {getFilteredTransactions(tabValue).map((tx: Transaction) => (
                        <div 
                          key={tx.id.toString()} 
                          className="p-3 rounded-lg transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                  tx.direction === "sent" 
                                    ? "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500" 
                                    : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500"
                                }`}
                              >
                                {tx.direction === "sent" ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : (
                                  <ArrowDown className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">{tx.otherName}</p>
                                <p className="text-xs text-gray-500">
                                  {tx.direction === "sent" ? "Sent to" : "Received from"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${
                                tx.direction === "sent" ? "text-gray-700" : "text-emerald-600"
                              }`}>
                                {tx.direction === "sent" ? "-" : "+"} ₹{Number(tx.amount).toLocaleString("en-IN")}
                              </p>
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500">{formatDate(tx.createdAt)}</span>
                                <span className="text-xs text-gray-400">{formatTime(tx.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {data?.hasMore && (
                        <div className="pt-3 pb-1 text-center">
                          <button 
                            onClick={loadMore} 
                            disabled={isLoading}
                            className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                          >
                            {isLoading ? "Loading..." : "Load more"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <p>No transactions to display.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))
          )}
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default P2PTransactionHistory