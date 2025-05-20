import {configureStore} from '@reduxjs/toolkit'
import userSliceReducer from './features/userSlice'
import sideBarItemReducer from './features/sidebarItemSlice'
import userTransactionsReducer from './features/userTransactionSlice'
import transactionMonitorReducer from './features/transactionMonitorSlice'
import userBalanceReducer from './features/userBalance'
import P2PTransactionHistoryReducer from './features/p2pTransactionHistory'

export const makeStore = ()=>{
    return configureStore({
        reducer:{
            userSliceReducer,
            sideBarItemReducer,
            userTransactionsReducer,
            transactionMonitorReducer,
            userBalanceReducer,
            P2PTransactionHistoryReducer
        },
        
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
