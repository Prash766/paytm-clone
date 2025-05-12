"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { prismaClientDB } from "@repo/db/user_client";

export const p2pTransfer = async (args: {
  phoneNumber: string;
  amount: string;
  message?: string;
}): Promise<any> => {
  // Authenticate user
  console.log("hi there")
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  const senderId = Number(session.user.id);
  const formattedAmount = Math.floor(Number(args.amount) * 100);

  try {
    const result = await prismaClientDB.$transaction(async (tx) => {
      // Fetch and lock sender balance row
      const senderBalance = await tx.balance.findUnique({
        where: { userId: senderId }
      });
      if (!senderBalance) {
        throw new Error("Invalid Account");
      }
      if (senderBalance.locked === 'Locked') {
        throw new Error("Try again after some time");
      }
      if (senderBalance.amount < formattedAmount) {
        throw new Error("Insufficient Funds");
      }

      // Mark sender as locked
      await tx.balance.update({
        where: { userId: senderId },
        data: { locked: 'Locked' }
      });

      // Find receiver
      const receiver = await tx.user.findUnique({
        where: { number: args.phoneNumber }
      });
      if (!receiver) {
        throw new Error("Invalid Phone Number");
      }

      // Create transaction record
      const p2pTx = await tx.p2PTransaction.create({
        data: {
          senderId,
          receiverId: receiver.id,
          amount: formattedAmount,
          message: args.message
        }
      });

      // Deduct from sender & credit receiver atomically
      await tx.balance.update({
        where: { userId: senderId },
        data: {
          amount: { decrement: formattedAmount }
        }
      });
      await tx.balance.update({
        where: { userId: receiver.id },
        data: {
          amount: { increment: formattedAmount }
        }
      });

      // Unlock both balances
      await tx.balance.update({ where: { userId: senderId }, data: { locked: 'Unlocked' } });
      await tx.balance.update({ where: { userId: receiver.id }, data: { locked: 'Unlocked' } });

      return p2pTx;
    });
    console.log(result)
    return {
      success: true,
      message: "Money Sent",
      transaction: result
    }; 
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
