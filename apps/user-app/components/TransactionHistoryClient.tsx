"use client"
// TransactionHistoryClient.tsx

import { useState } from "react";

// Define the type for your transactions
type Transaction = {
  id: number;
  userId: number;
  amount: number;
  provider: string;
  status: string;
  startTime: string;
};

type TransactionHistoryProps = {
  transactions: {
    success: boolean;
    transactionHistory: Transaction[];
  };
};

const TransactionHistoryClient = ({ transactions }: TransactionHistoryProps) => {
  // Any client-side state or interactions go here
  
  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.transactionHistory.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-3">
          {transactions.transactionHistory.map((tx) => (
            <div key={tx.id} className="border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{tx.provider}</span>
                  <p className="text-sm text-gray-600">
                    {tx.startTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{tx.amount}</p>
                  <span className={`text-sm ${
                    tx.status === "COMPLETED" ? "text-green-600" : 
                    tx.status === "PENDING" ? "text-amber-600" : "text-gray-600"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryClient;