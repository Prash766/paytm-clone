import express from "express";
import { prismaClientDB } from "@repo/db/user_client";
const app = express();

app.post("/hdfcWebhook", async (req, res) => {
  const { token, user_id, amount } = req.body;
  const paymentDetails = {
    token: token,
    userId: user_id,
    amount,
  };
  try {
    const payment = await prismaClientDB.$transaction([
      prismaClientDB.balance.updateMany({
        where: {
          userId: Number(paymentDetails.userId),
        },
        data: {
          amount: {
            increment: Number(paymentDetails.amount),
          },
        },
      }),
      prismaClientDB.onRampTransaction.updateMany({
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