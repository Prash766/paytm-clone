import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { prismaClientDB } from "@repo/db/user_client";

export  async  function GET (req:NextRequest) :Promise<any>{
    console.log("hi there")
    const session = await getServerSession(authOptions)
    console.log(session)
    const [unlockedBalance , lockedBalance] = await Promise.all([
        prismaClientDB?.balance.findFirst({
            where:{
                userId:Number(session?.user.id)
            }
        }),
        prismaClientDB?.onRampTransaction.aggregate({
            where:{
                userId:Number(session?.user.id),
                status:"Processing"
            },
            _sum:{
                amount:true
            }
        })
    ])
    console.log("session",session)
    console.log("unlocked" ,unlockedBalance)
    console.log("locked" ,lockedBalance)
    return NextResponse.json({
        message:"Reached",
        unlockedBalance:unlockedBalance?.amount,
        lockedBalance:lockedBalance._sum.amount,
        session
    })
}