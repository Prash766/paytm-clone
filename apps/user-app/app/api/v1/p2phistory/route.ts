// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { prismaClientDB } from "@repo/db/user_client";
// import { authOptions } from "../../../../lib/auth";


// const prismaClientDBExtension  = prismaClientDB.$extends({
//     model:{
//         p2PTransaction:{
//             fields:{
//                 senderName:{
//                     needs:{senderId: true},
//                     async compute(tx: any): Promise<any> {
//                         const u = await prismaClientDB.user.findUnique({
//                           where: { id: tx.senderId },
//                           select: { name: true },
//                         });
//                         return u?.name ?? null;
//                       },
//                 },
//                 receiverName:{
//                     needs: { receiverId: true },
//                     async compute(tx: any): Promise<any> {
//                       const u = await prismaClientDB.user.findUnique({
//                         where: { id: tx.receiverId },
//                         select: { name: true },
//                       });
//                       return u?.name ?? null;
//                     },
          
//                 }
//             }
//         }
//     }

// })

// export  async function  GET(req:NextRequest){
//     try {
//         const session = await getServerSession(authOptions)
//         const userId = Number(session?.user.id);

//         console.log("session",session)
//         const transactions = await prismaClientDBExtension?.p2PTransaction.findMany({
//                 where:{
//                     OR:[
//                        { receiverId: Number(session?.user.id)},
//                        {senderId : Number(session?.user.id)} 

//                     ]
//                 },
//                 orderBy: {
//                     createdAt: 'desc'
//                   }
            
//             })
//             console.log("transactions" , transactions)
//             const transformedTransactions = transactions.map((tx: any) => {
//                 // Determine if the current user sent or received the transaction
//                 const isSender = tx.senderId === userId;
                
//                 return {
//                   ...tx,
//                   // Pick the name of the other party in the transaction
//                   otherName: isSender ? tx.receiverName : tx.senderName,
//                   // Include a direction field for clarity
//                   direction: isSender ? 'sent' : 'received',
//                 };
//               });
          
//         console.log(transactions)
//        return NextResponse.json({
//             success:true,
//             transactions: transformedTransactions,
//             rawTransactions: transactions
//         })
//     } catch (error:any) {
//         console.log(error)
//         return NextResponse.json({
//             success:false,
//             msg:`${error.message}`
//         })
//     }

// }

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { prismaClientDB } from "@repo/db/user_client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
  }
  
  const searchParams = req.nextUrl.searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value: string, key: string) => params[key] = value);
  
  const me = Number(session.user.id);
  const cursorParam = params.cursor ? Number(params.cursor) : undefined;
  const limit = 10;

  try {
    // Create the base query options
    const queryOptions = {
      where: {
        OR: [
          { senderId: me },
          { receiverId: me },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" as const },
      include: {
        sender: {
          select: { name: true }
        },
        receiver: {
          select: { name: true }
        }
      }
    };

    // Add cursor if it exists
    if (cursorParam) {
      // For cursor-based pagination with Prisma, create a separate query
      const findManyResult = await prismaClientDB.p2PTransaction.findMany({
        ...queryOptions,
        cursor: { id: cursorParam },
        skip: 1, // Skip the cursor item
      });
      
      // Get the last transaction for pagination
      const lastTransaction = findManyResult[findManyResult.length - 1];
      const nextCursor = lastTransaction?.id;
      
      // Format the transactions
      const transactions = findManyResult.map((tx) => {
        const isSender = tx.senderId === me;
        return {
          id: tx.id,
          amount: tx.amount,
          createdAt: tx.createdAt,
          senderName: tx.sender.name,
          receiverName: tx.receiver.name,
          otherName: isSender ? tx.receiver.name : tx.sender.name,
          direction: isSender ? "sent" : "received",
          senderId: tx.senderId,
          receiverId: tx.receiverId
        };
      });

      return NextResponse.json({ 
        success: true, 
        transactions, 
        nextCursor,
        hasMore: findManyResult.length === limit
      });
    } else {
      // Initial query without cursor
      const findManyResult = await prismaClientDB.p2PTransaction.findMany(queryOptions);
      
      // Get the last transaction for pagination
      const lastTransaction = findManyResult[findManyResult.length - 1];
      const nextCursor = lastTransaction?.id;
      
      // Format the transactions
      const transactions = findManyResult.map((tx) => {
        const isSender = tx.senderId === me;
        return {
          id: tx.id,
          amount: tx.amount,
          createdAt: tx.createdAt,
          senderName: tx.sender.name,
          receiverName: tx.receiver.name,
          otherName: isSender ? tx.receiver.name : tx.sender.name,
          direction: isSender ? "sent" : "received",
          senderId: tx.senderId,
          receiverId: tx.receiverId
        };
      });

      return NextResponse.json({ 
        success: true, 
        transactions, 
        nextCursor,
        hasMore: findManyResult.length === limit
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ 
      success: false, 
      msg: "Error fetching transactions", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}