import { Badge, Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui";
import { IndianRupeeIcon } from "lucide-react";

const TotalBalance = () => {
  return (
    <Card className="w-full h-full text-white3">
      <CardHeader>
        <CardTitle>
          <p className="text-xl font-bold ">Total Balance</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-5xl font-extrabold ">
          <span>
            <IndianRupeeIcon  /> 25,0000
          </span>
        </p>
        <p className="space-x-2">
          <span>
            <Badge className="bg-[#9E6DED]">Available</Badge>
            Last Updated : Today, 7:45 pm
          </span>{" "}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalBalance;
