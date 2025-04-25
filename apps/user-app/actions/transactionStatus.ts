"use server"
import { prismaClientDB } from "@repo/db/user_client"
//need to fix with better types
export const pollingTransactionStatus : any= async(token :string, transactionId:string)=>{
    try {
        const status  = await prismaClientDB?.onRampTransaction.findFirst({
            where:{
                token             }
        })
        if(!status){
            return {
                success:false,
                message:"Invalid Token"
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