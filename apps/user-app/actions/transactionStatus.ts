"use server"

import { prismaBank } from "@repo/db/bank_client"
//need to fix with better types
export const pollingTransactionStatus : any= async(token :string, transactionId:string)=>{
    try {
        const status  = await prismaBank.transactions.findFirst({
            where:{
                token ,
                transactionId
            }
        })
        if(!status){
            return {
                success:false,
                message:"Invalid Transaction ID"
            }
        }
        return {
            success:"true",
            transactionStatus: status
        }
    } catch (error) {
        console.log(error)
        return { 
            success:"false",
            message:"Something went wrong"
        }
        
    }
}