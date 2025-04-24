import { UserTransactionType } from "@repo/store/user-transaction";
import { Badge } from "@repo/ui/ui";
import { Clock4, Loader, UploadCloud, XCircle } from "lucide-react";
import { TransactionProp } from "./TransactionHistory";
//
//added polling when transaction loader is mounted , and 
const NewTransaction = ({
  status = "Processing",
  startTime,
  amount,
}: TransactionProp) => {
  const paymentStatusMap = {
    Processing: {
      paymentStatusText: "Adding to Wallet",
      Icon: Clock4,
      textClass: "text-yellow-500",
      statusBadge: (
        <span className="flex items-center">
          <Badge className="h-5 px-2 text-yellow-900 bg-amber-200 flex items-center space-x-1">
            <Loader
              color="#8B8000"
              size={16}
              className="w-4 h-4 animate-spin"
            />
            <span>Pending</span>
          </Badge>
        </span>
      ),
    },
    Success: {
      paymentStatusText: "Added to Wallet",
      Icon: UploadCloud,
      textClass: "text-green-500",
      statusBadge: (
        <Badge className="w-18 h-5 text-green-900 bg-green-200">
          Completed
        </Badge>
      ),
    },
    Failure: {
      paymentStatusText: "Failed Adding to Wallet",
      Icon: XCircle,
      textClass: "text-red-500",
      statusBadge: (
        <Badge className="w-18 h-5 text-red-900 bg-red-200">Failed</Badge>
      ),
    },
  };

  const currentStatus = paymentStatusMap[status];

  return (
    <div className="flex items-center justify-between p-4 border-2 border-gray-300 mt-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
          <currentStatus.Icon color="green" className="w-6 h-6" />
        </div>
        <div>
          <p className="font-medium">{currentStatus.paymentStatusText}</p>
          <p className="text-sm text-muted-foreground">{startTime}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className={`font-semibold text-green-600`}>+ {amount}</p>
        {currentStatus.statusBadge}
      </div>
    </div>
  );
};

export default NewTransaction;
