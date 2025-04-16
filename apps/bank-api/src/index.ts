import 'dotenv/config'
import express, { Response, Request } from  'express'
import {prismaClientDB} from '@repo/db/user_client' 
import * as crypto from 'crypto'
import {encryptedToken} from './utils/encryptSymmetric'
import isTokenValid from './utils/helper'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.PAYMENT_PAGE_URL,
    credentials:true
}))

export const TIME_OF_EXPIRY = 10*60*1000

export interface PaymentDetails {
    expireTime: number;
    secretKey: string;
    details: {
      amountToBePayed: number;
      receiverAccountNumber: string;
      receiverName: string;
    };
  }
   

export const tokenMapWithSecretKey= new Map<string ,PaymentDetails >()

app.post('/initiateTransaction' , (req:Request , res: Response)=>{
const {amountToBePayed , receiverAccountNumber , receiverName } = req.body
const plainText =amountToBePayed +" "+ receiverAccountNumber +" " + receiverName
const  key = crypto.randomBytes(16).toString("hex")
const token = encryptedToken(key  , plainText)
console.log("token after encruption" , token)
tokenMapWithSecretKey.set(token , {
    expireTime: new Date().getTime() + TIME_OF_EXPIRY,
    secretKey : key,
    details : {
        amountToBePayed,
        receiverAccountNumber,
        receiverName
    }
})
console.log(token)
 res.json({
    message :"transaction initiated",
    token,
    paymentUrl: `http://localhost:5173/payment?orderId=${token}`
})

})

app.get('/payment/', (req, res) : any=>{
    const orderId = req.query.orderId as  string
    console.log("order id", orderId)
    if(!isTokenValid(orderId)){
         return res.status(400).json({
            success:"false",
            message:"Invalid token or session"
        })
    }
   return res.status(200).json({
        success:true,
        paymentDetails:tokenMapWithSecretKey.get(orderId)?.details,
        message:"Valid Session"
    })
})


app.listen(4003 , ()=>{
    console.log("server")
})


