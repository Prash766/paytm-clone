"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/ui";
import { CreditCard, IndianRupee, Loader, Send, User } from "lucide-react";
import { p2pTransfer } from "../../actions/p2ptransfer";
import {toast} from 'sonner'
import P2PTransactionHistory from "./P2PTransactionHistory";

type PhoneFormValues = {
  phoneNumber: string;
  amount: string;
  message: string;
};

type BankFormValues = {
  accountNumber: string;
  ifsc: string;
  amount: string;
  message: string;
};

const P2PMoneyTransfer = () => {
  const [activeTab, setActiveTab] = useState("phone");
  const [isSendingMoney,setIsSendingMoney] = useState<boolean>(false)
  
  const phoneForm = useForm<PhoneFormValues>({
    defaultValues: {
      phoneNumber: "",
      amount: "",
      message: "",
    },
  });

  const bankForm = useForm<BankFormValues>({
    defaultValues: {
      accountNumber: "",
      ifsc: "",
      amount: "",
      message: "",
    },
  });

  const handlePhoneSubmit = async (data: PhoneFormValues) => {
    setIsSendingMoney(true)
    const res = await p2pTransfer(data)
    setIsSendingMoney(false)

    if(res.success===true){
      phoneForm.reset()
        console.log("res", res)
        toast.success("Money Sent Sucessfully")
        
    }
  };

  const handleBankSubmit = (data: BankFormValues) => {
    console.log("Bank transfer submitted:", data);
    // Here you would handle the actual transfer logic
  };

  const calculateTotal = (amount: string) => {
    const value = parseFloat(amount) || 0;
    return value.toFixed(2);
  };

  return (
    <div className="flex gap-10  ">

    
    <Tabs 
      defaultValue="phone" 
      className="w-1/2 h-1/2 "
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="bg-gradient-to-r from-gray-100 to-gray-50 grid w-full grid-cols-2 mb-6 rounded-xl p-1 h-1/2 shadow-md">
        <TabsTrigger value="phone" className="flex items-center gap-2 rounded-lg py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md">
          <User className="h-5 w-5 text-green-600" />
          <span className="font-medium">UPI / Mobile Number</span>
        </TabsTrigger>
        <TabsTrigger value="bank" className="flex items-center gap-2 rounded-lg py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md">
          <CreditCard className="h-5 w-5 text-green-600" />
          <span className="font-medium">Bank Account</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="phone">
        <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-xl font-semibold text-gray-800">Send via UPI / Mobile Number</CardTitle>
            <CardDescription className="text-gray-500">
              Enter the recipient's mobile number registered with UPI and amount to transfer.
            </CardDescription>
          </CardHeader>
          <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    placeholder="10-digit mobile number"
                    className="pl-10 w-full h-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                    {...phoneForm.register("phoneNumber")}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount (₹)</Label>
                <div className="relative">
                  <Input 
                    id="amount" 
                    placeholder="0.00" 
                    className="pl-10 w-full h-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                    {...phoneForm.register("amount", {
                      required: "Amount is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Please enter a valid amount"
                      }
                    })} 
                  />
                  <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {phoneForm.formState.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message (Optional)</Label>
                <Input 
                  id="message" 
                  placeholder="What's this payment for?" 
                  className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                  {...phoneForm.register("message")}
                />
              </div>

              <div className="rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-5 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount</span>
                  <span className="text-green-700 text-lg font-bold">₹ {calculateTotal(phoneForm.watch("amount"))}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Button 
                type="submit" 
                disabled={isSendingMoney}
                className="w-full h-12 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                {
                  isSendingMoney ? <Loader className="w-5 h-5 animate-spin"/> : (
                    <>
                    <Send className="h-4 w-4" />
                    Send Money
                    </>
                  )
                }
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      
      {/* <TabsContent value="bank">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Send to Bank Account</CardTitle>
            <CardDescription>
              Enter the recipient's bank account details for NEFT/IMPS transfer.
            </CardDescription>
          </CardHeader>
          <form onSubmit={bankForm.handleSubmit(handleBankSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  {...bankForm.register("accountNumber", {
                    required: "Account number is required",
                    pattern: {
                      value: /^\d{9,18}$/,
                      message: "Please enter a valid account number"
                    }
                  })}
                />
                {bankForm.formState.errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {bankForm.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  placeholder="IFSC Code (e.g., SBIN0001234)"
                  {...bankForm.register("ifsc", {
                    required: "IFSC code is required",
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: "Please enter a valid IFSC code"
                    }
                  })}
                />
                {bankForm.formState.errors.ifsc && (
                  <p className="text-red-500 text-sm mt-1">
                    {bankForm.formState.errors.ifsc.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <div className="relative">
                  <Input 
                    id="amount" 
                    placeholder="0.00" 
                    className="pl-10"
                    {...bankForm.register("amount", {
                      required: "Amount is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Please enter a valid amount"
                      }
                    })} 
                  />
                  <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {bankForm.formState.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {bankForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">message (Optional)</Label>
                <Input 
                  id="message" 
                  placeholder="What's this payment for?" 
                  {...bankForm.register("message")}
                />
              </div>

              <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Amount</span>
                  <span>₹ {calculateTotal(bankForm.watch("amount"))}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Money
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent> */}
    </Tabs>

    <div className="w-1/2 -mt-5">
    <P2PTransactionHistory />
  </div>

    </div>
  );
};

export default P2PMoneyTransfer;