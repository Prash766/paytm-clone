import {createSlice} from '@reduxjs/toolkit'

const sideBarItemSlice = createSlice({
    name:"sideBarItemSlice",
    initialState:{
        activeSideBarItem:{
            name:"",
            icon:"",
            key : null
        }
    },
    reducers:{
        setActiveSideBarItem: (state , action)=>{
            state.activeSideBarItem = action.payload
        }
    }

})


export const {setActiveSideBarItem} = sideBarItemSlice.actions
export default sideBarItemSlice.reducer