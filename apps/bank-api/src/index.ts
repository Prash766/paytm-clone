import express, { urlencoded } from  'express'
import {prismaClientDB} from '@repo/db/user_client' 
const app = express()
app.use(express.json())


app.listen(4003 , ()=>{
    console.log("server")
})


