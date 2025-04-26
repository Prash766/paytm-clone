import {createSlice} from '@reduxjs/toolkit'

export type UserBalanceType={
    currentBalanceState: {
        lockedBalance: number | null
        unlockedBalance : number | null
    }
}
const initialState = {
    currentBalanceState:{
        lockedBalance:null,
        unlockedBalance : null
    }
} as UserBalanceType

const userBalanceSlice= createSlice({
    name:"userBalanceSlice",
    initialState,
    reducers:{
        setCurrentBalanceState: (state,action)=>{
            state.currentBalanceState = action.payload
        },
        setLockedBalance: (state , action)=>{
            state.currentBalanceState.lockedBalance += action.payload
        },
        setUnLockedBalance : (state , action)=>{
            state.currentBalanceState.unlockedBalance +=action.payload
        }
    }

})

export const {setCurrentBalanceState , setLockedBalance , setUnLockedBalance } = userBalanceSlice.actions
export default userBalanceSlice.reducer