import axiosClient from "../axiosClient";

export async function checkOrderIdAndGetPaymentDetails(orderId:string){
    const res = await axiosClient.get(`/payment?orderId=${orderId}`)
    return res

}