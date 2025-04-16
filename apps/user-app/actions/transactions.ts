"use server"
import { prismaClientDB } from "@repo/db/user_client"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { FormValues } from "../components/AddMoneyForm"
type TransactionData = {
    id: number;
    userId: number;
    amount: number;
    provider: string;
    status: "Processing" | "Success" | "Failure";
    startTime: string;
}

 const PaytmBankDetails= { 
        receiverAccountNumber : 123456789012,
        receiverName : "PaytmBank"
}

type CreateTransactionResult =
  | { success:false , message: string }
  | { success: true; transaction: TransactionData[] , orderId:string }


export async function createTransaction(params: FormValues) : Promise<CreateTransactionResult> {
    const session = await getServerSession(authOptions)
    try {
        if(!session?.user){
            return {
                success:false,
                message:"User not logged in"
            }
        }
        const {amount , bankName} = params
        const res = await fetch('http://localhost:4003/initiateTransaction', {
            method: 'POST',
            body: JSON.stringify({
                amountToBePayed : params.amount,
                ...PaytmBankDetails
            }),
            headers : new Headers({
                'Content-Type':"application/json; charset=UTF-8"
            })
        })
        console.log("res oten",res)
        const token = await res.json()
        console.log("token" , token)
        const transaction = await prismaClientDB.onRampTransaction.create({
            data:{
                userId:Number(session?.user.id),
                token:token.token,
                amount:Number(amount)*100,
                 provider: bankName,
                 status:"Processing",
                 startTime:new Date(),
            },
            omit:{
                token:true
            }
        })
        return {
            success:true,
            transaction:[{
                ...transaction,
                amount : transaction.amount/100,
                startTime:transaction.startTime.toLocaleDateString()
            }],
            orderId: token.token
        }
        
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message:"Internal Server Error"
        }
        
    }
    
}