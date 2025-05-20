import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Transaction = {
  id: Number,
  amount: Number,
  createdAt: string,
  senderName: string,
  receiverName: string,
  otherName: string,
  direction: "sent" | "received",
  senderId: Number,
  receiverId: Number
}

export type P2PTransactionHistory = {
  p2pTransactions: Transaction[] | null,
  cursor: Number | null,
  hasMore: boolean | null 
}

const initialState = {
  p2pTransactions: null,
  cursor: null,
  hasMore: null
} as P2PTransactionHistory

const p2PTransactionHistorySlice = createSlice({
  name: "p2pTransactionHistory",
  initialState,
  reducers: {
    setP2PTransactionHistory: (state, action: PayloadAction<Transaction[]>) => {
      state.p2pTransactions = action.payload && state.p2pTransactions 
        ? [...action.payload, ...state.p2pTransactions]
        : action.payload
    },
    setP2PHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setCusorForP2PTransactionHitory: (state, action: PayloadAction<Number>) => {
      state.cursor = action.payload
    },
    clearP2PTransactionHistory: (state) => {
      state.p2pTransactions = null
      state.cursor = null
      state.hasMore = null
    }
  }
})

export const { 
  setP2PTransactionHistory, 
  setP2PHasMore, 
  setCusorForP2PTransactionHitory,
  clearP2PTransactionHistory
} = p2PTransactionHistorySlice.actions

export default p2PTransactionHistorySlice.reducer