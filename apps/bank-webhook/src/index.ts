import express from "express";
import { prismaClientDB } from "@repo/db/user_client";
const app = express();
app.use(express.json())

app.post("/bankWebHook", async (req, res) => {
  console.log("hit from the bank")
  const { token, user_id, amount, status , successCode } = req.body;
  console.log("amount",amount)
  const paymentDetails = {
    token: token,
    userId: user_id,
    amount,
  };
  const data = await prismaClientDB.onRampTransaction.findFirst({
    where:{
      token:token
    }
  })
  console.log("paytm user id" , data?.userId)
  console.log("user id",Number(paymentDetails.userId),)
  try {
    const payment = await prismaClientDB.$transaction([
      prismaClientDB.balance.updateMany({
        where: {
          userId: data?.userId,
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
          status: status==="Success" ? "Success" : "Failure",
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