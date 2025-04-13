import {createSlice} from '@reduxjs/toolkit'
export interface UserTransactionType{
    userId:number,
    amount:number,
     provider: string,
     status:"Processing"|"Failure"| "Success",
     startTime:string,

}

type InitalStateType = {
    transaction : UserTransactionType[]
}

const initialState : InitalStateType = {
    transaction :  []
}

const userTransactionSlice = createSlice({
    name:"userTransactionSlice",
   initialState ,
    reducers:{
        setUserTransaction : (state , action)=>{
            state.transaction = [...state.transaction, action.payload]            
        }
    }

})

export const {setUserTransaction}  = userTransactionSlice.actions

export default userTransactionSlice.reducer