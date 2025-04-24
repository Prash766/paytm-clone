"use client";

import { Button } from "@repo/ui/ui";
import { CheckCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TransactionStatus } from "../../../../packages/db/prisma-bank-db/bank-db";
import { useAppDispatch, useAppSelector } from "@repo/store/redux";
import { RootState } from "@repo/store/store";
import { pollingTransactionStatus } from "../../actions/transactionStatus";
import { updateTransactionStatus } from "../../actions/transactions";
import { setUserTransaction } from "@repo/store/user-transaction";

interface TransactionLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  paymentStatus: "success" | "failure" | "processing";
}

export const TransactionLoader = ({
  isOpen,
  onClose,
  paymentStatus,
}: TransactionLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [openCancelPaymentConfirmation, setOpenCancelPaymentConfirmation] =
    useState(false);
  const dispatch = useAppDispatch();
  const cancelPaymentStatus = useRef<boolean | null>(null);
  const { currentTransactionDetails } = useAppSelector(
    (state: RootState) => state.transactionMonitorReducer
  );
  const [timeExpired, setTimeExpired] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    pollingIntervalRef.current = setInterval(async () => {
      const res = await pollingTransactionStatus(currentTransactionDetails.token , currentTransactionDetails.transactionId) 
      console.log("Polling", res);
      if (res.success === "true") {
        if (
          res.transactionStatus.status !== "Processing" &&
          pollingIntervalRef.current
        ) {
          clearInterval(pollingIntervalRef.current);
          onClose()
          return;
        }
      }
    }, 10000);
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

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
    window.addEventListener("beforeunload", () => {
      if (!cancelPaymentStatus.current) {
        const result = window.confirm("Do You want to cancel the transaction");
        if (result) {
          updateTransactionStatus({
            txnId: currentTransactionDetails.transactionId,
            status: "Failure",
            token: currentTransactionDetails.token,
          }).then((res) => {
            console.log("after canceling the transaction", res);
          });
        }
      }
    });
  }, []);

  if (!isOpen) return null;

  const handleClick = async () => {
    const res = await updateTransactionStatus({
      txnId: currentTransactionDetails.transactionId,
      status: "Failure",
      token: currentTransactionDetails.token,
    });
    if (res.success === true) {
      setOpenCancelPaymentConfirmation(true);
      cancelPaymentStatus.current = true;
      console.log("After cancelling the transaction",res)
      dispatch(setUserTransaction(res.transaction));
      if(pollingIntervalRef.current){
        clearInterval(pollingIntervalRef.current)
      }
      onClose()
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-24 h-24">
            {/* Outer spinning circle */}
            <div className="absolute inset-0 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-violet-100 rounded-full animate-pulse flex items-center justify-center">
              {paymentStatus === "processing" ? (
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
              ) : paymentStatus === "success" ? (
                <CheckCircleIcon
                  size={50}
                  fill="green"
                  className="text-green-600"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 18.628 18 16.368 18 12s.07-6.628.928-8H5.072C5.93 5.372 6 7.632 6 12s-.07 6.628-.938 8z"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {paymentStatus === "processing"
                ? "Processing Your Transaction"
                : paymentStatus === "success"
                  ? "Your Transaction was successfull"
                  : "Payment Failed"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {paymentStatus === "processing"
                ? "Processing Your Transaction"
                : paymentStatus === "success"
                  ? "Amount added successfully to wallet"
                  : "If amount debited will be refunded in 2-7 days..."}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Do not close this window or refresh the page
          </p>
          <Button
            onClick={handleClick}
            variant="outline"
            className="text-white bg-violet-500 cursor-pointer"
          >
            Cancel Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};
