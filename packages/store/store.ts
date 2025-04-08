import {configureStore} from '@reduxjs/toolkit'
import userSliceReducer from './features/userSlice'

export const makeStore = ()=>{
    return configureStore({
        reducer:{
            userSliceReducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']


 