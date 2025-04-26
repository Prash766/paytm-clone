import { createSlice } from "@reduxjs/toolkit";

export interface UserTransactionType {
  userId: number;
  amount: number;
  provider: string;
  status: "Processing" | "Failure" | "Success";
  startTime: string;
  token: string;
}

type InitialStateType = {
  transaction: UserTransactionType[];
};

const initialState: InitialStateType = {
  transaction: [],
};

const userTransactionSlice = createSlice({
  name: "userTransactionSlice",
  initialState,
  reducers: {
    setUserTransaction: (state, action) => {
      const newTransactions = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      if (state.transaction.length === 0) {
        state.transaction = newTransactions;
        return;
      }
      newTransactions.forEach((newTx) => {
        const index = state.transaction.findIndex(
          (tx) => tx.token === newTx.token
        );

        if (index !== -1) {
          state.transaction[index] = {
            ...state.transaction[index],
            ...newTx,
          };
          console.log("Updated transaction:", state.transaction[index]);
        } else {
          state.transaction = [...state?.transaction, newTx];
          console.log("Added new transaction:", newTx);
        }
      });
    },
  },
});

export const { setUserTransaction } = userTransactionSlice.actions;

export default userTransactionSlice.reducer;
