import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import { Clock4, IndianRupeeIcon, Wallet, Wallet2Icon } from "lucide-react";

const BalanceAmount = ({
  balanceType,
  amount,
}: {
  balanceType: "unlocked" | "locked";
  amount: string;
}) => {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {balanceType === "unlocked" ? "Unlocked" : "Locked"}{" "}
          <span>Balance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{amount}.00</div>
        <div className="flex items-center mt-2">
          {balanceType === "unlocked" ? (
            <Wallet className="w-4 h-4 mr-1 text-green-500" />
          ) : (
            <Clock4 className="w-4 h-4 mr-1 text-yellow-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {balanceType === "unlocked"
              ? "Available for use"
              : "Pending clearance"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceAmount;
