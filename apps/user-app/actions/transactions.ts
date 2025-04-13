"use server"
import { prisma } from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { randomUUID } from "crypto"
import { FormValues } from "../components/AddMoneyForm"
export async function createTransaction(params: FormValues) {
    const session = await getServerSession(authOptions)
    try {
        if(!session?.user){
            return {
                message:"User not logged in"
            }
        }
        const {amount , bankName} = params
        const token = randomUUID()
        const transaction = await prisma.onRampTransaction.create({
            data:{
                userId:Number(session?.user.id),
                token:token,
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
            transaction:{
                ...transaction,
                amount : transaction.amount/100,
                startTime:transaction.startTime.toLocaleDateString()
            }
        }
        
    } catch (error) {
        console.log(error)
        return {
            message:"Internal Server Error"
        }
        
    }
    
}