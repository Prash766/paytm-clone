import {createSlice} from '@reduxjs/toolkit'


const userSlice = createSlice(
    {
        name:"userSlice",
        initialState:{
            user:{}
        },
        reducers:{
            setUser :(state, action)=>{
                return 
            }
        }
    }
)

export const {setUser} = userSlice.actions
export default userSlice.reducer