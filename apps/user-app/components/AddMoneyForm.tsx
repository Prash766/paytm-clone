"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import { createTransaction } from "../actions/transactions";
import { useAppDispatch } from "@repo/store/redux";
import { setUserTransaction } from "@repo/store/user-transaction";

export type FormValues = {
  amount: string;
  bankName: string;
};

const AddMoneyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await createTransaction(data);
      console.log("res", res);
      dispatch(setUserTransaction(res.transaction));
      // window.location.href = process.env.NEXT_PUBLIC_ADDING_MONEY_REDIRECT_URL!;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="font-text md:col-span-2 lg:col-span-1 border-gray-200">
      <CardHeader>
        <CardTitle>Add Money to Wallet</CardTitle>
        <p className="text-sm text-muted-foreground">
          Funds will be available in your wallet immediately after successful
          payment.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                ₹
              </span>
              <input
                id="amount"
                type="text"
                placeholder="0.00"
                className="w-full p-2 pl-8 border-2 border-gray-300 focus:outline-none rounded-xl"
                {...register("amount", { required: "Amount is required" })}
              />
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-md flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Money
            </button>
          </div>

          <div className="flex items-center justify-center pt-2">
            <p className="text-xs text-center text-muted-foreground">
              Secured by 256-bit encryption. Your payment details are safe with
              us.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMoneyForm;
