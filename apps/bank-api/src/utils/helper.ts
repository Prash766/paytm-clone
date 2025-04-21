import { tokenMapWithSecretKey } from "..";
import jwt from 'jsonwebtoken'
import type { StringValue } from "ms";
import {faker} from '@faker-js/faker'


export default function isTokenValid(token: string): boolean {
    if(!tokenMapWithSecretKey.get(token)){
        return false
    }
    const paymentDetails = tokenMapWithSecretKey.get(token)
    if (!paymentDetails) {
        return false
    }
    const expiryTime = paymentDetails.expireTime;
    const currentTime = new Date().getTime();
    if( expiryTime <currentTime) {
        tokenMapWithSecretKey.delete(token)
        return false
    }
    return true
}

export const generateToken = (payload:{
    userId : number,
    email :string
})=>{
    const options: jwt.SignOptions  = {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRY_TIME as StringValue ,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as jwt.Secret, options)
    return token
}


export const generateAccountNumber = ()=>{
    const accountNumber = faker.finance.accountNumber(10) 
    return Number(accountNumber)
}

export const securityKeyGenerate = ()=>{
    const secKey = faker.finance.pin(5)
    return secKey
}

export const generateTransactionId =()=>{
    const date = new Date()
    const fromattedDate = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');

let transactionID = "TXN"+ '' + fromattedDate+ faker.string.alphanumeric(6)
return transactionID
}

