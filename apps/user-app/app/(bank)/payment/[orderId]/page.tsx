import { notFound } from 'next/navigation'
import PaymentForm from "../../../../components/PaymentForm"

 async function PaymentPage({params}:{params:{orderId:string}}){
const {orderId} = params
const res = await fetch(`http://localhost:4003/payment/?orderId=${orderId}`, {
    method :'GET'
})
const isTokenValid = await res.json()
console.log("is token valid",isTokenValid)

if(!JSON.parse(isTokenValid.success)){
 notFound()
}
return <>
{
    JSON.parse(isTokenValid.success)?? <PaymentForm paymentDetails={isTokenValid.paymentDetails}/> 
    
}
</>
}

export default PaymentPage