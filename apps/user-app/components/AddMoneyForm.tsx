"use client"

import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui"
import { createTransaction } from "../actions/transactions"
import { useAppDispatch } from "@repo/store/redux"
import { setUserTransaction } from "@repo/store/user-transaction"
import { useState } from "react"
import { TransactionLoader } from "../lib/loaders/TransactionLoader"
import { setTransactionDetails } from "@repo/store/transaction-loader"
import { Loader } from "lucide-react"

export type FormValues = {
  amount: string
  bankName: string
}

const AddMoneyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const dispatch = useAppDispatch()
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"processing"| "failure" | "success" |  null| "payment_window_closed">(null)

  const onSubmit = async (data: FormValues) => {
    try {
      setIsTransactionProcessing(true)
      setPaymentStatus("processing")

      const res = await createTransaction(data)

      console.log("res", res)
      if (res.success) {
        console.log("add money form res order id",res.orderId)
        const currentTransactionDetails = {
          amountToBePayed : res.transaction[0]?.amount,
          transactionId : res.transactionId,
          paymentStatus : res.transaction[0]?.status,
          token:res.orderId
        }
        dispatch(setUserTransaction(res.transaction))
        dispatch(setTransactionDetails(currentTransactionDetails))
        console.log("payment url", res.paymentUrl)
        // Add a small delay before redirecting to show the loader
        setTimeout(() => {  
          window.addEventListener("message", (event) => {
            console.log("event from the windwo",event)
            if (event.origin !== "http://localhost:5173") return;
          
            const { paymentStatus, orderId } = event.data;
            
            if(paymentStatus==="payment_window_closed" && orderId===res.orderId){
              setTimeout(()=>{
                setPaymentStatus("payment_window_closed")  
              },2000)

            }
            // if (paymentStatus === "success" && orderId === res.orderId) {
            //   setPaymentStatus("success")
            //   setTimeout(()=>{
            //     setIsTransactionProcessing(false)
            //     setPaymentStatus("failure")
            //     // setPaymentStatus(null)

            //   }, 5000)
            //   console.log("✅ Transaction complete!");
            // }
            // if (paymentStatus === "failure" && orderId === res.orderId) {
            //   setPaymentStatus("failure")
            //   setTimeout(()=>{
            //     setIsTransactionProcessing(false)
            //     setPaymentStatus(null)

            //   }, 5000)
            // }

            })
          
          // window.open(res.paymentUrl, '_blank');
          window.open(res.paymentUrl, '_blank')
        }, 1000)
      } else {
        setIsTransactionProcessing(false)
      }
    } catch (error) {
      console.log(error)
      setIsTransactionProcessing(false)
    }
  }

  return (
    <>
      <Card className="font-text md:col-span-2 lg:col-span-1 border-gray-200">
        <CardHeader>
          <CardTitle>Add Money to Wallet</CardTitle>
          <p className="text-sm text-muted-foreground">
            Funds will be available in your wallet immediately after successful payment.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  className="w-full p-2 pl-8 border-2 border-gray-300 focus:outline-none rounded-xl"
                  {...register("amount", { required: "Amount is required" })}
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="payment-method" className="text-sm font-medium">
                Payment Method
              </label>
              <div className="relative">
                <select
                  id="payment-method"
                  className="w-full rounded-xl border-2 border-gray-300 focus:outline-none p-2 bg-transparent appearance-none"
                  defaultValue=""
                  {...register("bankName", { required: "Select a bank" })}
                >
                  <option disabled value="">
                    Select Bank
                  </option>
                  <option value="hdfc">HDFC</option>
                  <option value="icici">ICICI</option>
                  <option value="sbi">SBI</option>
                </select>
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isTransactionProcessing}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-md flex items-center justify-center disabled:bg-violet-400 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {
                  isTransactionProcessing ? <><Loader size={10} className="animate-spin w-5 h-5"/> Processing </>  : "Add Money"
                }
              </button>
            </div>

            <div className="flex items-center justify-center pt-2">
              <p className="text-xs text-center text-muted-foreground">
                Secured by 256-bit encryption. Your payment details are safe with us.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

     {
      isTransactionProcessing ? <TransactionLoader onClose={()=> setIsTransactionProcessing(false)} paymentStatus={paymentStatus} isOpen={isTransactionProcessing} /> : null
     } 
    </>
  )
}

export default AddMoneyForm
