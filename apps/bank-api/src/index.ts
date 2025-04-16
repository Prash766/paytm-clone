import express, { Response, Request } from  'express'
import {prismaClientDB} from '@repo/db/user_client' 
import * as crypto from 'crypto'
import {encryptedToken} from './utils/encryptSymmetric'
const app = express()
app.use(express.json())

const TIME_OF_EXPIRY = 10*60


const tokenMapWithSecretKey= new Map()

app.post('/initiateTransaction' , (req:Request , res: Response)=>{
const {amountToBePayed , receiverAccountNumber , receiverName } = req.body
const plainText =amountToBePayed +" "+ receiverAccountNumber +" " + receiverName
const  key = crypto.randomUUID()
const token = encryptedToken(key  , plainText)
tokenMapWithSecretKey.set(token , {
    expireTime: new Date().getMilliseconds() + TIME_OF_EXPIRY
})
console.log(token)
 res.json({
    message :"transacition initiated",
    token
})

})


app.listen(4003 , ()=>{
    console.log("server")
})


