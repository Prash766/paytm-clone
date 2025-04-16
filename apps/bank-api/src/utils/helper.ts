import { tokenMapWithSecretKey } from "..";

export default function isTokenValid(token: string): boolean {
    const paymentDetails = tokenMapWithSecretKey.get(token)
    if (!paymentDetails) {
        return false
    }
    const expiryTime = paymentDetails.expireTime;
    const currentTime = new Date().getTime();
    if( expiryTime <currentTime) {
        tokenMapWithSecretKey.delete(token)
        return false
    }
    return true
}