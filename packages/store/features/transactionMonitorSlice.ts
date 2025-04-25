import {createSlice} from '@reduxjs/toolkit'



export type TransactionDetails= {

}
export type TransactionLoader = {
    paymentStatus :"Processing" | "Success" |"Failure" | null,
    isFetching: boolean
    expiryTimer : null | number,
    currentTransactionDetails: {
        token :string | null,
        transactionId:string | null,
        amountToBePayed:  number | null,
        paymentStatus : "Success" | "Failure" | "Processing" | null
    }
}
const initialState:TransactionLoader= {
    paymentStatus: null,
    isFetching : false,
    expiryTimer : null,
    currentTransactionDetails :{
        token: null,
        transactionId :null,
        amountToBePayed : null,
        paymentStatus: null

    }


}

const transactionMonitorSlice = createSlice({
    name:"transactionMonitorSlice",
    initialState,
    reducers:{
        setPaymentStatus : (state, action)=>{
            state.paymentStatus = action.payload
        },
        setIsFetching :(state, action)=>{
            state.isFetching = action.payload
        },
        setExpiryTimer : (state,action)=>{
            state.expiryTimer= action.payload
        },
        setTransactionDetails : (state , action)=>{
            state.currentTransactionDetails = action.payload

        }
    }
})

export const {setPaymentStatus, setIsFetching, setExpiryTimer , setTransactionDetails} = transactionMonitorSlice.actions
export default transactionMonitorSlice.reducer