"use client"

import { useEffect, useState } from "react"
import { Badge, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/ui"
import { ArrowDown, ArrowUp, Check, Clock, X } from "lucide-react"
import useSWR from "swr"

// Mock transaction data - replace with your actual data fetching logic
const mockTransactions = [
  {
    id: "tx-1",
    recipient: "Rahul Sharma",
    amount: 2500,
    date: "2023-05-12T10:30:00",
    status: "completed",
    type: "sent",
    method: "UPI",
  },
  {
    id: "tx-2",
    recipient: "Priya Patel",
    amount: 1200,
    date: "2023-05-10T14:45:00",
    status: "completed",
    type: "received",
    method: "Mobile",
  },
  {
    id: "tx-3",
    recipient: "Amit Kumar",
    amount: 3500,
    date: "2023-05-08T09:15:00",
    status: "pending",
    type: "sent",
    method: "Bank",
  },
  {
    id: "tx-4",
    recipient: "Neha Singh",
    amount: 800,
    date: "2023-05-05T16:20:00",
    status: "failed",
    type: "sent",
    method: "UPI",
  },
  {
    id: "tx-5",
    recipient: "Vikram Joshi",
    amount: 5000,
    date: "2023-05-03T11:10:00",
    status: "completed",
    type: "received",
    method: "Bank",
  },
]

type Transaction = (typeof mockTransactions)[0]

const fetcher = (...args: [input: RequestInfo, init?: RequestInit]) => fetch(...args).then((res) => res.json())

const P2PTransactionHistory = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [activeTab, setActiveTab] = useState("all")
  const {data, error} = useSWR('api/v1/p2phistory', fetcher)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0">
            <Check className="w-3 h-3 mr-1" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-0">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-0">
            <X className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getFilteredTransactions = (type: string | null) => {
    if (type === "all" || !type) return transactions
    return transactions.filter(tx => tx.type === type)
  }



  return (
 <Card className="w-full shadow-xl border-0 rounded-xl overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b py-4">
        <CardTitle className="flex items-center  justify-between">
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
          {["all", "sent", "received"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-2 p-0">
              <div className="space-y-1">
                {getFilteredTransactions(tabValue).length > 0 ? (
                  getFilteredTransactions(tabValue).map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-3 rounded-lg transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                              tx.type === "sent" 
                                ? "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500" 
                                : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500"
                            }`}
                          >
                            {tx.type === "sent" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="font-medium text-sm text-gray-900">{tx.recipient}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(tx.status)}
                              <span className="text-xs text-gray-500">
                                {tx.method}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            tx.type === "sent" ? "text-gray-700" : "text-emerald-600"
                          }`}>
                            {tx.type === "sent" ? "-" : "+"} ₹{tx.amount.toLocaleString("en-IN")}
                          </p>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">{formatDate(tx.date)}</span>
                            <span className="text-xs text-gray-400">{formatTime(tx.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No transactions to display.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default P2PTransactionHistory