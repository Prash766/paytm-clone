import { PaymentDetails } from "..";

export const webHookCallback= async(details :PaymentDetails , token :string , amountToBePayed : number, userId: number)=>{
  console.log("insdie the webhook funtion",details.webHookUrl)
  console.log("token",token)
    const res = await fetch(details?.webHookUrl!, {
        method: "POST",
        headers: new Headers({
          "Content-type": "application/json",
        }),
        body: JSON.stringify({
          token,
          user_id: userId,
          amount: amountToBePayed,
          status: "Success",
          successCode: 0,
        }),
      });

      return res
}