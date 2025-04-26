"use client";

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
import { CreditCard, IndianRupee, Send, User } from "lucide-react";

const P2PMoneyTransfer = () => {
  return (
    <Tabs defaultValue="phone" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Phone Number</span>
        </TabsTrigger>
        <TabsTrigger value="bank" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Bank Account</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="phone">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Send to Phone Number</CardTitle>
            <CardDescription>
              Enter the recipient's phone number and the amount you want to
              send.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Recipient's Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input id="amount" placeholder="0.00" className="pl-10" />
                <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input id="note" placeholder="What's this for?" />
            </div>

            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Transfer Fee</span>
                <span className="text-sm">₹ 0.00</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span>Total Amount</span>
                <span>₹ 0.00</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Money
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>{" "}
    </Tabs>
  );
};

export default P2PMoneyTransfer;
