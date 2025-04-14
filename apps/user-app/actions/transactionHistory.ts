"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { prisma } from "@repo/db/client";
import { OnRampStatus } from "@prisma/client";
const extendedPrisma = prisma?.$extends({
    name:"transactionHistory",
    result: {
      onRampTransaction: {
        startTime: {
          needs:{startTime:true },
          compute(data) {
return  data.startTime.toLocaleDateString()
          },
        },
      }
    }
  })
  
  export default async function getTransactionHistory(){
    const session = await getServerSession(authOptions)
    const transactions = await extendedPrisma?.onRampTransaction.findMany({
      where: {
        userId: Number(session?.user.id)
      },
      omit: {
        token: true
      }
    })
      const plainTransactions = transactions.map(transaction =>
      JSON.parse(JSON.stringify(transaction))
    )
    console.log("plain transactions",plainTransactions)
  
    return {
      success: true,
      transactionHistory: plainTransactions
    }
  }
  

// "use server"
// // transactionHistory.ts

// import { getServerSession } from "next-auth";
// import { authOptions } from "../lib/auth";
// import { prisma } from "@repo/db/client";
// import { OnRampStatus } from "@prisma/client";

// export default async function getTransactionHistory() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return {
//       success: false,
//       transactionHistory: []
//     };
//   }

//   try {
//     // Use regular Prisma query to avoid the extended client complexity
//     const transactions = await prisma.onRampTransaction.findMany({
//       where: {
//         userId: Number(session.user.id)
//       },
//       select: {
//         id: true,
//         userId: true,
//         amount: true,
//         provider: true,
//         status: true,
//         startTime: true
//         // Exclude any fields you don't need like token
//       }
//     });

//     // Process dates and other complex data to ensure serializability
//     const serializedTransactions = transactions.map(tx => ({
//       id: tx.id,
//       userId: tx.userId,
//       amount: tx.amount,
//       provider: tx.provider,
//       status: String(tx.status), // Convert enum to string
//       startTime: tx.startTime instanceof Date 
//         ? tx.startTime.toLocaleDateString() 
//         : String(tx.startTime)
//     }));

//     return {
//       success: true,
//       transactionHistory: serializedTransactions
//     };
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     return {
//       success: false,
//       transactionHistory: []
//     };
//   }
// }