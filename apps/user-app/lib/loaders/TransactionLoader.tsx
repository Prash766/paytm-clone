// "use client";

// import { Button } from "@repo/ui/ui";
// import { AlertTriangle, CheckCheck, CheckCircleIcon, CircleAlert } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { TransactionStatus } from "../../../../packages/db/prisma-bank-db/bank-db";
// import { useAppDispatch, useAppSelector } from "@repo/store/redux";
// import { RootState } from "@repo/store/store";
// import { pollingTransactionStatus } from "../../actions/transactionStatus";
// import { updateTransactionStatus } from "../../actions/transactions";
// import { setUserTransaction } from "@repo/store/user-transaction";

// interface TransactionLoaderProps {
//   isOpen: boolean;
//   onClose: () => void;
//   paymentStatus: "success" | "failure" | "processing" | "payment_window_closed" | null;
// }

// export const TransactionLoader = ({
//   isOpen,
//   onClose,
//   paymentStatus,
// }: TransactionLoaderProps) => {
//   const [progress, setProgress] = useState(0);
//   const [openCancelPaymentConfirmation, setOpenCancelPaymentConfirmation] =
//     useState(false);
//     const [isCancelTransaction , setIsCancelTransaction] = useState(false)
//     const [serverPaymentStatus , setServerPaymentStatus] = useState<"Failure" | "Success"| "Processing">("Processing")
//   const dispatch = useAppDispatch();
//   const cancelPaymentStatus = useRef<boolean | null>(null);
//   const { currentTransactionDetails } = useAppSelector(
//     (state: RootState) => state.transactionMonitorReducer
//   );
//   const [timeExpired, setTimeExpired] = useState(false);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     pollingIntervalRef.current = setInterval(async () => {
//       console.log("token polling",currentTransactionDetails.token)
//       const res = await pollingTransactionStatus(currentTransactionDetails.token , currentTransactionDetails.transactionId) 
//       console.log("Polling", res);
//       if (res.success === "true") {
//         if (
//           res.transactionStatus.status !== "Processing" &&
//           pollingIntervalRef.current
//         ) {
//           clearInterval(pollingIntervalRef.current);
//           onClose()
//           return;
//         }
//       }
//     }, 10000);
//     return () => {
//       if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
//     };
//   }, [currentTransactionDetails.token, currentTransactionDetails.transactionId]);

//   useEffect(() => {
//     if (isOpen) {
//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           const newProgress = prev + 1;
//           if (newProgress >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return newProgress;
//         });
//       }, 3000);

//       return () => clearInterval(interval);
//     } else {
//       setProgress(0);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     window.addEventListener("beforeunload", () => {
//       if (!cancelPaymentStatus.current) {
//         const result = window.confirm("Do You want to cancel the transaction");
//         if (result && currentTransactionDetails.transactionId && currentTransactionDetails.token) {
//           updateTransactionStatus({
//             txnId: currentTransactionDetails.transactionId,
//             status: "Failure",
//             token: currentTransactionDetails.token,
//           }).then((res) => {
//             console.log("after canceling the transaction", res);

//           });
//         }
//       }
//     });
//   }, []);

//   if (!isOpen) return null;

//   const handleClick = async () => {
//     setIsCancelTransaction(true)
//     const res = await updateTransactionStatus({
//       txnId: currentTransactionDetails.transactionId!,
//       status: "Failure",
//       token: currentTransactionDetails.token!,
//     });
//     if (res.success === true) {
//       setOpenCancelPaymentConfirmation(true);
//       setIsCancelTransaction(false)
//       cancelPaymentStatus.current = true;
//       console.log("After cancelling the transaction",res)
//       dispatch(setUserTransaction(res.transaction));
//       setServerPaymentStatus(res.transaction.status)
//       if(pollingIntervalRef.current){
//         clearInterval(pollingIntervalRef.current)
//       }
//       onClose()
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
//         <div className="flex flex-col items-center space-y-6">
//           <div className="relative w-24 h-24">
//             {/* Outer spinning circle */}
//             <div className={`absolute inset-0 border-4 border-violet-200 ${paymentStatus==="payment_window_closed"? "bg-yellow-400" : "border-t-violet-600"} rounded-full animate-spin`}></div>

//             {/* Inner pulsing circle */}
//             <div className="absolute inset-4 bg-violet-100 rounded-full animate-pulse flex items-center justify-center">
//               {
//                 paymentStatus==="payment_window_closed"  ? (

//                   <CircleAlert fill="yellow" size={40}/>
//                 ) :serverPaymentStatus==="Success" ? (
//                 <CheckCheck size={40} color="green" />
//                 ) : serverPaymentStatus==="Failure" ? (
//                   <AlertTriangle size={40} color="yellow"/>
//                 ) : (
//                   <svg
//                   className="w-8 h-8 text-violet-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 )
//               }
//               {/* {paymentStatus === "processing" ? (
//                 <svg
//                   className="w-8 h-8 text-violet-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               ) : paymentStatus === "success" ? (
//                 <CheckCircleIcon
//                   size={50}
//                   fill="green"
//                   className="text-green-600"
//                 />
//               ) : (
//                 <svg
//                   className="w-8 h-8 text-red-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 18.628 18 16.368 18 12s.07-6.628.928-8H5.072C5.93 5.372 6 7.632 6 12s-.07 6.628-.938 8z"
//                   />
//                 </svg>
//               )} */}
//             </div>
//           </div>

//           <div className="text-center">
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               {/* {paymentStatus === "processing"
//                 ? "Processing Your Transaction"
//                 : paymentStatus === "success"
//                   ? "Your Transaction was successfull"
//                   : "Payment Failed"} */}
//                   {
//                    (paymentStatus==="processing"|| paymentStatus==="payment_window_closed") && serverPaymentStatus!=="Success" && serverPaymentStatus!=="Failure" ? (
//                       "Processing Your Transaction"
//                     ) :serverPaymentStatus ==="Success" ? (
//                       "Your Transaction was successfull"
//                     ) :serverPaymentStatus==="Failure" ? (
//                       "Payment Failed"
//                     ) : (
//                       "Processing Payment"
//                     )
//                   }
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               {/* {paymentStatus === "processing"
//                 ? "Processing Your Transaction"
//                 : paymentStatus === "success"
//                   ? "Amount added successfully to wallet"
//                   : "If amount debited will be refunded in 2-7 days..."} */}
//                    {
//                     paymentStatus==="payment_window_closed" && serverPaymentStatus!=="Success" && serverPaymentStatus!=="Failure" ? (
//                       "Processing Your Transaction"
//                     ) :serverPaymentStatus ==="Success" ? (
//                       "Amount added successfully to wallet"
//                     ) : serverPaymentStatus==="Failure" ? (
//                       "Payment Failed"
//                     ) : (
//                       "Processing Payment"
//                     )
//                   }
//             </p>
//           </div>

//           {/* Progress bar */}
//          {
//           paymentStatus==="payment_window_closed" ? (
//               null
//           ) :(
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-violet-600 h-2.5 rounded-full transition-all duration-300 ease-out"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>

//           )
//          }
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             Do not close this window or refresh the page
//           </p>
//           {
//             paymentStatus==="payment_window_closed" || isCancelTransaction ? null :(
//               <Button
//               onClick={handleClick}
//               variant="outline"
//               className="text-white bg-violet-500 cursor-pointer"
//             >
//               Cancel Transaction
//             </Button>
//             )
//           }
     
//         </div>
//       </div>
//     </div>
//   );
// };


"use client";

import { Button } from "@repo/ui/ui";
import { AlertTriangle, CheckCheck, CheckCircleIcon, CircleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@repo/store/redux";
import { RootState } from "@repo/store/store";
import { pollingTransactionStatus } from "../../actions/transactionStatus";
import { updateTransactionStatus } from "../../actions/transactions";
import { setUserTransaction } from "@repo/store/user-transaction";

interface TransactionLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  paymentStatus: "success" | "failure" | "processing" | "payment_window_closed" | null;
}

export const TransactionLoader = ({
  isOpen,
  onClose,
  paymentStatus,
}: TransactionLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [openCancelPaymentConfirmation, setOpenCancelPaymentConfirmation] =
    useState(false);
    const [isCancelTransaction , setIsCancelTransaction] = useState(false)
    const [serverPaymentStatus , setServerPaymentStatus] = useState<"Failure" | "Success"| "Processing">("Processing")
  const dispatch = useAppDispatch();
  const cancelPaymentStatus = useRef<boolean | null>(null);
  const { currentTransactionDetails } = useAppSelector(
    (state: RootState) => state.transactionMonitorReducer
  );
  const [timeExpired, setTimeExpired] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    pollingIntervalRef.current = setInterval(async () => {
      console.log("token polling",currentTransactionDetails.token)
      const res = await pollingTransactionStatus(currentTransactionDetails.token , currentTransactionDetails.transactionId) 
      console.log("Polling", res);
      if (res.success === "true") {
        if (res.transactionStatus.status !== "Processing") {
          setServerPaymentStatus(res.transactionStatus.status);
          const formattedTransaction = {
            ...res.transactionStatus,
            startTime : new Date(res.transactionStatus.startTime).toLocaleDateString(),
            amount: res.transactionStatus.amount / 100 // Convert amount if needed
          };  
          dispatch(setUserTransaction(formattedTransaction));
                if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            // Allow time to show the status before closing
            setTimeout(() => {
              onClose();
            }, 3000);
          }
          return;
        }
      }
    }, 10000);
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [currentTransactionDetails.token, currentTransactionDetails.transactionId]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!cancelPaymentStatus.current) {
        e.preventDefault();
        e.returnValue = "Do You want to cancel the transaction";
        
        if (currentTransactionDetails.transactionId && currentTransactionDetails.token) {
          updateTransactionStatus({
            txnId: currentTransactionDetails.transactionId,
            status: "Failure",
            token: currentTransactionDetails.token,
          }).then((res) => {
            console.log("after canceling the transaction", res);
          });
        }
        
        return e.returnValue;
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!isOpen) return null;

  const handleClick = async () => {
    setIsCancelTransaction(true)
    const res = await updateTransactionStatus({
      txnId: currentTransactionDetails.transactionId!,
      status: "Failure",
      token: currentTransactionDetails.token!,
    });
    if (res.success === true) {
      setOpenCancelPaymentConfirmation(true);
      cancelPaymentStatus.current = true;
      console.log("After cancelling the transaction",res)
      dispatch(setUserTransaction({...res.transaction , startTime : new Date(res.transaction.startTime).toLocaleDateString ,amount : res.transaction.amount/100}));
      setServerPaymentStatus(res.transaction.status)
      if(pollingIntervalRef.current){
        clearInterval(pollingIntervalRef.current)
      }
      
      // Show status for a moment before closing
      setTimeout(() => {
        onClose();
        setIsCancelTransaction(false)
      }, 3000);
    }
  };

  // Helper function to determine what icon to show
  const renderStatusIcon = () => {
    if (serverPaymentStatus === "Success") {
      return <CheckCheck size={40} color="green" />;
    } else if (serverPaymentStatus === "Failure") {
      return <AlertTriangle size={40} color="yellow" />;
    } 
    else if (paymentStatus === "payment_window_closed") {
      // return <CircleAlert fill="red" size={40} />;
      return (
        <svg
        className="w-8 h-8 text-violet-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      )
    }
    else {
      return (
        <svg
          className="w-8 h-8 text-violet-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
  };

  const getStatusTitle = () => {
    if (serverPaymentStatus === "Success") {
      return "Your Transaction was successful";
    } else if (serverPaymentStatus === "Failure") {
      return "Payment Failed";
    } else {
      return "Processing Your Transaction";
    }
  };

  const getStatusMessage = () => {
    if (serverPaymentStatus === "Success") {
      return "Amount added successfully to wallet";
    } else if (serverPaymentStatus === "Failure") {
      return "If amount debited, it will be refunded in 2-7 days...";
    } else {
      return "Processing Payment";
    }
  };

  // Determine if we should show the progress bar
  const shouldShowProgressBar = () => {
    return serverPaymentStatus === "Processing" && paymentStatus !== "payment_window_closed";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-24 h-24">
            {/* Outer spinning circle - only spin during processing */}
            <div 
              className={`absolute inset-0 border-4 border-violet-200 
                ${serverPaymentStatus === "Success" ? "border-green-500 bg-green-100" : 
                  serverPaymentStatus === "Failure" ? "border-yellow-500 bg-yellow-100" : 
                  paymentStatus === "payment_window_closed" ? "bg-yellow-400" : 
                  "border-t-violet-600 animate-spin"} 
                rounded-full`}
            ></div>

            {/* Inner pulsing circle - only pulse during processing */}
            <div 
              className={`absolute inset-4 
                ${serverPaymentStatus === "Success" ? "bg-green-100" : 
                  serverPaymentStatus === "Failure" ? "bg-yellow-100" : 
                  paymentStatus === "payment_window_closed" ? "bg-yellow-100" : 
                  "bg-violet-100 animate-pulse"} 
                rounded-full flex items-center justify-center`}
            >
              {renderStatusIcon()}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {getStatusTitle()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {getStatusMessage()}
            </p>
          </div>

          {/* Progress bar - only show during processing */}
          {shouldShowProgressBar() && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-violet-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Warning message */}
          {serverPaymentStatus === "Processing" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Do not close this window or refresh the page
            </p>
          )}
          
          {/* Cancel button - only show if not already showing results or cancelling */}
          {(serverPaymentStatus === "Processing" && 
            paymentStatus !== "payment_window_closed" && 
            !isCancelTransaction ) && (
            <Button
              onClick={handleClick}
              variant="outline"
              className="text-white bg-violet-500 cursor-pointer"
            >
              Cancel Transaction
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};