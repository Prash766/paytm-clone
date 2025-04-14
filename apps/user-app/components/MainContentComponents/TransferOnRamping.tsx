
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import BalanceAmount from "../BalanceAmount";
import AddMoneyForm from "../AddMoneyForm";
import TransactionHistoryPage from "../TransactionHistoryPage";

const TransferOnRamping = () => {
  return (
    <div className="flex flex-col h-full p-4 space-y-8 ">
      <div className="-mt-4">
        <h1 className="text-2xl font-bold tracking-tight">Transfer Money</h1>
        <p className="text-muted-foreground">
          Add money to your wallet or view your transaction history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-4 md:col-span-2 lg:col-span-1">
          <Card className="bg-gradient-to-br from-violet-500 to-purple-700 text-white ">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹24,500.00</div>
              <div className="flex items-center mt-4 text-sm">
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 mr-2"
                >
                  Available
                </Badge>
                <span>Last updated: Today, 7:45 PM</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <BalanceAmount amount="18,750" balanceType="unlocked" />
            <BalanceAmount amount="5,750" balanceType="locked" />
          </div>
        </div>
        <AddMoneyForm />
      </div>
      <div className="grid grid-cols-1">
      </div>
        <TransactionHistoryPage/>
    </div>
  );
};

export default TransferOnRamping;
