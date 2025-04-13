import {configureStore} from '@reduxjs/toolkit'
import userSliceReducer from './features/userSlice'
import sideBarItemReducer from './features/sidebarItemSlice'
import userTransactionsReducer from './features/userTransactionSlice'

export const makeStore = ()=>{
    return configureStore({
        reducer:{
            userSliceReducer,
            sideBarItemReducer,
            userTransactionsReducer
        },
        
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
