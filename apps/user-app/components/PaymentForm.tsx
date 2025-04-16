"use client"
import { Label , Input, Button } from "@repo/ui/ui"
import { useForm } from "react-hook-form"

const PaymentForm = ({paymentDetails}:{paymentDetails : {amount : number ,merchantName :string , transactionId : string }}) => {
    const {
        handleSubmit ,
        register
    } = useForm({
        defaultValues:{
            amount: paymentDetails.amount,
            merchantName : paymentDetails.merchantName,
            transactionId : paymentDetails.transactionId
        }
    })
    const onSubmit = ()=>{
    
    }
        return (<div className="h-screen w-screen flex flex-col justify-center items-center gap-2 ">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="amount">Amount</label>
                <Input
                type="text" 
                {...register("amount")}
                />
    
                <Label htmlFor="merchantName">To</Label>
                <Input type="text"
                {...register("merchantName")}
                />
    
            </form>
    
            <Button type="submit">Pay</Button>
    
        </div>)
    
}

export default PaymentForm