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
  const me = Number(session.user.id);

  try {
    const raw = await prismaClientDB.p2PTransaction.findMany({
      where: {
        OR: [
          { senderId: me },
          { receiverId: me },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { name: true }
        },
        receiver: {
          select: { name: true }
        }
      }
    });

    const transactions = raw.map((tx) => {
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
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ 
      success: false, 
      msg: "Error fetching transactions", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}