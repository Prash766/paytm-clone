import "dotenv/config";
import express, { Response, Request, CookieOptions } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as crypto from "crypto";

import { encryptedToken } from "./utils/encryptSymmetric";
import isTokenValid, {
  generateAccountNumber,
  generateToken,
  generateTransactionId,
  securityKeyGenerate,
} from "./utils/helper";
import asyncHandler from "./utils/asyncHandler";
import bcrypt from "bcrypt";
import { prismaBank } from "@repo/db/bank_client";
import verifyJWT from "./middlewares/auth.middleware";
import { webHookCallback } from "./utils/webHook";
import retryWebHook from "./utils/retryWebhook";
import expiredTransactionSweeper from "./utils/sweeper";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.PAYMENT_PAGE_URL,
    credentials: true,
  })
);
app.use(cookieParser());

declare  global {
  var __sweeperStarted: boolean

}

// export const TIME_OF_EXPIRY = 60 * 60 * 1000;
export const TIME_OF_EXPIRY = 1*60 * 1000;
export const WEBHOOK_ATTEMPTS=5
export const PENDING_TXS :Array<{orderId : string, expireTime : any, txn_id:string}>= []
export const SWEEPER_TIME = 60*1000
export const RETRY_INTERVAL_MS = 60 * 1000; 


export interface PaymentDetails {
  expireTime: number;
  secretKey: string;
  details: {
    amountToBePayed: number;
    receiverAccountNumber: string;
    receiverName: string;
  };
  webHookUrl: string;
}

export const tokenMapWithSecretKey = new Map<string, PaymentDetails>();
export const tokenOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
} satisfies CookieOptions;

app.post("/initiateTransaction", async(req: Request, res: Response) => {
  const {
    amountToBePayed,
    receiverAccountNumber,
    receiverName,
    redirectUrl,
    webHookUrl,
  } = req.body;
  const redirectURL = encodeURIComponent(redirectUrl);
  const plainText =
    amountToBePayed + " " + receiverAccountNumber + " " + receiverName;
  const key = crypto.randomBytes(16).toString("hex");
  const token = encryptedToken(key, plainText);
  const encodedToken = encodeURIComponent(token);
  console.log("token after encruption", token);
  console.log("webhook url",webHookUrl)
  console.log("inside ht inititate teansction api",token)
  const transactionId = generateTransactionId()
  PENDING_TXS.push({
    orderId : token,
    txn_id:  transactionId,
    expireTime : new Date().getTime() + TIME_OF_EXPIRY
  })
  tokenMapWithSecretKey.set(token, {
    expireTime: new Date().getTime() + TIME_OF_EXPIRY,
    secretKey: key,
    details: {
      amountToBePayed,
      receiverAccountNumber,
      receiverName,
    },
    webHookUrl,
  });
  const receiverDetails = await prismaBank.account.findFirst({
    relationLoadStrategy: "join",
    where: {
      accountNumber: BigInt(receiverAccountNumber!),
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  const transaction = await prismaBank.transactions.create({
    data:{
      amount:        BigInt(amountToBePayed!),
      token:         token,
      status:        "Processing",
      transactionId: transactionId,
      receiverId:    receiverDetails!.user.id,      
    }

  })
  console.log("transaction created",transaction)
  console.log(tokenMapWithSecretKey.get(token))
  console.log(token);
  const parsedTransaction =  JSON.parse(
    JSON.stringify(transaction, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  res.json({
    message: "transaction initiated",
    transaction : parsedTransaction,
    token,
    paymentUrl: `http://localhost:5173/payment?orderId=${encodedToken}&redirect=${redirectURL}`,
  });
});

app.get("/payment/",verifyJWT,  asyncHandler(async (req, res) => {
    const encodedOrderId = req.query.orderId as string;
    const safeEncodedOrderId = encodedOrderId.replace(/ /g, "+");

    const orderId = decodeURIComponent(safeEncodedOrderId);
    console.log("order id", orderId);
    if (!isTokenValid(orderId)) {
      return res.status(400).json({
        success: "false",
        message: "Invalid token or session",
      });
    }
    const paymentDetails = tokenMapWithSecretKey.get(orderId)?.details;

    const receiverDetails = await prismaBank.account.findFirst({
      relationLoadStrategy: "join",
      where: {
        accountNumber: BigInt(paymentDetails?.receiverAccountNumber!),
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
    console.log("RECEVIER DETAILS", receiverDetails);
    let transaction = await prismaBank.transactions.findUnique({
      where: { token: orderId },
    });
    
    if (!transaction?.senderId) {
      transaction = await prismaBank.transactions.update({
        where:{
          token : orderId
        },
        data: {
          senderId: req.user!.userId,
        },
        
      });
    }

    return res.status(200).json({
      success: true,
      paymentDetails: {
        ...tokenMapWithSecretKey.get(orderId)?.details,
        transactionID: transaction.transactionId,
      },
      message: "Valid Session",
    });
  })
);

app.post("/signup",asyncHandler(async (req, res) => {
    try {
      const { email, password, name, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prismaBank.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phoneNumber: BigInt(phoneNumber),
          Account: {
            create: {
              accountNumber: BigInt(generateAccountNumber()),
              securityKey: securityKeyGenerate(),
            },
          },
        },
      });
      const token = generateToken({ userId: user.id, email: user.email });
      res.cookie("auth-token", token, tokenOptions);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err: any) {
      if ((err.code = "P2002")) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
    }
  })
);

app.post("/login", asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("email", email, password);
      const user = await prismaBank.user.findFirst({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
          phoneNumber: true,
          name: true,
          Account: {
            omit: {
              securityKey: true,
            },
          },
          id: true,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }
      const isValidPassword = bcrypt.compare(password, user?.password);
      if (!isValidPassword) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });
      res.cookie("auth-token", token, tokenOptions);
      const { password: userPassword, ...newUser } = user;
      const parsedUser = JSON.parse(
        JSON.stringify(newUser, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      console.log(parsedUser);
      return res.status(200).json({
        success: true,
        user: parsedUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  })
);

app.post( "/pay",verifyJWT,  asyncHandler(async (req, res) => {
    try {
      const { token, transactionId, amountToBePayed, attemptStatus } = req.body;
      console.log("token" , token)
      const isValid = isTokenValid(token)
      if(!isValid){
        
        return res.status(404).json({
            message:"Invalid Transaction"
        })
      }
      const transaction = await prismaBank.transactions.update({
        where: {
          transactionId: transactionId,
        },
        data: {
          status: attemptStatus === "success" &&  isValid ? "Success" : "Failure",
        },
      });
  
      const details = tokenMapWithSecretKey.get(token)
      console.log("details",details)
      const callback = await webHookCallback(details! , token, amountToBePayed, req.user?.userId!,"Success")
      let attempts = 1;
      if (!callback.ok) {
       retryWebHook(details! , token , amountToBePayed , req.user?.userId! , attempts, "Success")
      }
      
      console.log(transaction);
      return res.status(200).json({
        status:"success",
        success: "true",
        message: "Transaction Successful",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success:false,
        message:"Internal Server Error"
      })
    }
  })
);

app.post('/updateTransactionStatus' , asyncHandler(async(req , res)=>{
  const {txnId , token , status } = req.body
 try {
   const transaction  = await prismaBank.transactions.findFirst({
     where:{
       transactionId : txnId,
       token : token
     }
   })
   if(!transaction){
     return res.status(400).json({
       success:"false",
       message:"Invalid Token or Transaction ID"
 
     })
   }
   if(transaction.status!=="Processing"){
    return res.status(409).json({ error: 'Cannot cancel a non-processing tx' });
  }
   const  updatedTransaction = await prismaBank.transactions.update({
     where:{
       id :transaction.id
     },
     data:{
       status:status
     }
   })
   return res.status(200).json({
     success:true,
     message:"Transaction Status Updated",
     updatedTransaction
   })
 } catch (error) {
  console.log(error)
  return res.status(500).json({
    success: "false",
    message:"Internal Server Error"
  })
  
 }
}))

function startSweeper(){
  if (globalThis.__sweeperStarted) return;
  globalThis.__sweeperStarted = true;
  setInterval(()=>{
    console.log("its running ")
    expiredTransactionSweeper().catch((error)=> console.log("error in the expired transcation",error))
  }, 5000)
}

startSweeper()

app.listen(4003, () => {
  console.log("server");
});
