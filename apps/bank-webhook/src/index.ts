import express from "express";
import { prisma } from "@repo/db/client";
const app = express();

app.post("/hdfcWebhook", async (req, res) => {
  const { token, user_id, amount } = req.body;
  const paymentDetails = {
    token: token,
    userId: user_id,
    amount,
  };
  try {
    const payment = await prisma.$transaction([
      prisma.balance.updateMany({
        where: {
          userId: Number(paymentDetails.userId),
        },
        data: {
          amount: {
            increment: Number(paymentDetails.amount),
          },
        },
      }),
      prisma.onRampTransaction.updateMany({
        where: {
          token: paymentDetails.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json({
        message: "Captured"
    })

  } catch (error) {
    console.log(error)
  }
});


app.listen(4002, ()=>{
  console.log("Server is running ")
})