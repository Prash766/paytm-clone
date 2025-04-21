import { useEffect, useState , useRef} from "react";
import { Link, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { checkOrderIdAndGetPaymentDetails } from "../utils/helper";
import NotFound from "./NotFound";
import axiosClient from "../axiosClient";

export default function Payment({isLoggedIn}:{isLoggedIn:boolean}) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    amountToBePayed: string;
    receiverAccountNumber: number;
    receiverName: string;
    transactionID: string
  } | null>(null);
  const [sessionExpired , setSessionExpired] = useState<boolean>(false)
  const [isFetching , setIsFetching] = useState(false)
  const orderId = searchParams.get("orderId");
  console.log("order id", orderId);
  const redirectUrl = searchParams.get("redirect");


  useEffect(() => {
    if (!isLoggedIn) {
      // Save the complete payment URL to redirect back after login
      navigate('/login', {
        state: {
          redirect: `/payment?orderId=${orderId}&redirect=${redirectUrl}`
        },
        replace: true
      });
      return;
    }
  }, [isLoggedIn, orderId, redirectUrl]);


  useEffect(() => {
    console.log("use effect runs");
    if (!orderId) {
      setSessionExpired(true)
      return
    }
    async function checkValidOrderId() {
      try {
        setIsFetching(true)
        const res = await checkOrderIdAndGetPaymentDetails(orderId!);
        setIsFetching(false)
        console.log(res);
        setPaymentDetails(res.data.paymentDetails);
      } catch (error) {
        setIsFetching(false)
        setSessionExpired(true)
      }
    }
    if(isLoggedIn){
      checkValidOrderId();
    }
    return ()=>{
      setIsFetching(false)
      setSessionExpired(false)
    }
  }, []);
  
  if(isFetching){
    return 
  }
  if(sessionExpired && !isFetching){
    return <NotFound/>
  }

  const handleClick = async()=>{
    const res = await axiosClient.post('/pay',{
      token :orderId?.replace(/ /g, "+"),
       transactionId :paymentDetails?.transactionID,
       amountToBePayed : paymentDetails?.amountToBePayed,
       attemptStatus:"success"
    })
    if(res.status===200){
      if(redirectUrl){
        window.location.href = `${redirectUrl}&status=success&key=4`
      }
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            SecureBank
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-green-700 rounded-md hover:bg-green-800 transition"
          >
            Logout
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Payment Details
          </h2>

          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Transaction Summary
              </h3>
              <p className="text-green-700">
                Please review the payment details before proceeding.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">
                  ₹{paymentDetails?.amountToBePayed}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium text-gray-900">{paymentDetails?.transactionID}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Receiver Name</span>
                <span className="font-medium text-gray-900">
                  {paymentDetails?.receiverName}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium text-gray-900">
                  {paymentDetails?.receiverAccountNumber}
                </span>
              </div>

              {/* <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">{paymentDetails.date}</span>
              </div> */}
            </div>

            <div className="pt-4">
              <button
              onClick={handleClick}
                type="button"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition text-lg font-medium"
              >
                Pay
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                By clicking "Pay", you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>
            © 2024 SecureBank. This is a fake banking application for
            demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
