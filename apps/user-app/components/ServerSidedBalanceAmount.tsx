"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import BalanceAmount from "./BalanceAmount";
import { prismaClientDB } from "@repo/db/user_client";

const extendedPrismaClientDb =  prismaClientDB?.$extends({
    name :"unlockedAmount",
    model:{
        onRampTransaction:{
            lockedAmount:{
                needs:{ 
                    amount :true
                },
                compute() {
                }
            }
        }
    }

}) 

export async function ServerSidedBalanceAmount(){
    const user = await getServerSession(authOptions)
    if(!user){
        return 
    }
    const [unlockedAmount , lockedAmount] = await Promise.all([ prismaClientDB?.balance.findFirst({
        where:{
            userId:Number(user?.user.id)
        }
    }) ,
    prismaClientDB?.onRampTransaction.aggregate({
        where:{
            userId :Number(user?.user.id),
            status:"Processing"
        },
        _count:{
            amount:true
        }

    })
]
)
console.log("unlocked amount" , unlockedAmount)
console.log("locked amount" , lockedAmount)
return (
    <>
 {/* <BalanceAmount balanceType="unlocked" amount= {unlockedAmount?.amount.toString()!}/>
 <BalanceAmount balanceType="locked" amount={lockedAmount?._count.amount.toString()!}/> */}
    </>
)

}

export default ServerSidedBalanceAmount

