import { PaymentDetails, RETRY_INTERVAL_MS, WEBHOOK_ATTEMPTS } from "..";
import { webHookCallback } from "./webHook";

const retryWebHook = async(details :PaymentDetails , token: string , amountToBePayed : number, userId: number , attempts : number , status:"Success"| "Failure")=>{
    const timer = setInterval(async () => {
        attempts++;
        const retry = await webHookCallback(details!, token, amountToBePayed,userId, status);
    
        if (retry.ok) {
          console.log(`Webhook succeeded on attempt #${attempts}`);
          clearInterval(timer);
        } else if (attempts >= WEBHOOK_ATTEMPTS) {
          console.warn(`Webhook failed after ${WEBHOOK_ATTEMPTS} attempts.`);
          clearInterval(timer);
        }
      }, RETRY_INTERVAL_MS);

}

export default retryWebHook