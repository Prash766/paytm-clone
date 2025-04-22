import { PENDING_TXS, SWEEPER_TIME, TIME_OF_EXPIRY, tokenMapWithSecretKey } from ".."
import { prismaBank } from "@repo/db/bank_client"
import { webHookCallback } from "./webHook"

const expiredTransactionSweeper =async()=>{
    console.log("expired running ")
        const expiryDate = new Date(Date.now() - TIME_OF_EXPIRY)
        const expiredTransactions  = await prismaBank?.transactions.updateManyAndReturn({
            where:{
                status:"Processing",
                createdAt : {lt : expiryDate}
                
            },
            data:{
                status:"Failure"
            }
        })
        //handle a case where lets say the server shuts down so does the paymentdetails becomes empty 
        //and then sweeper may cause error as it may not find a webhook url for that particular token

        expiredTransactions?.forEach(async(txn)=> {
            const paymentDetails = tokenMapWithSecretKey.get(txn.token)
            if(paymentDetails){
                const res = await webHookCallback(paymentDetails , txn.token,Number(txn.amount),  txn.senderId , "Failure")
                if(res.status===200){
                    console.log("Message Sent to the WebHook url")
                }
            }
            
        });
        
    }

export default expiredTransactionSweeper