import { useGerBraches } from "@/api/branch/branch.query";
import { useStatistics } from "@/api/stats/stats.query";
import { useCurrentUser } from "@/api/user/current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsString, useQueryState } from "nuqs";

const DashBoardPage = () => {
  const { data } = useStatistics();
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault("01")
  );
  const [branch, setBranch] = useQueryState(
    "branch",
    parseAsString.withDefault("all")
  );
  const { data: branches } = useGerBraches();
  const { data: user } = useCurrentUser();
  console.log(data);
  if (!data) return null;
  if (user?.role !== "admin")
    return <div className="">Hello welcome to Hlakabar</div>;
  return (
    <div className="p-7">
      <div className="flex gap-5">
        <Select onValueChange={(val) => setMonth(val)} value={month}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01">January</SelectItem>
            <SelectItem value="02">Feb</SelectItem>
            <SelectItem value="03">March</SelectItem>
            <SelectItem value="04">April</SelectItem>
            <SelectItem value="05">May</SelectItem>
            <SelectItem value="06">June</SelectItem>
            <SelectItem value="07">July</SelectItem>
            <SelectItem value="08">August</SelectItem>
            <SelectItem value="09">Sep</SelectItem>
            <SelectItem value="10">Oct</SelectItem>
            <SelectItem value="11">Nov</SelectItem>
            <SelectItem value="12">Dec</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setBranch(val)} value={branch}>
          <SelectTrigger className="border-gray-300 shadow-sm rounded-lg">
            <SelectValue placeholder="All branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key="all" value="all">
                All branches
              </SelectItem>
              {branches?.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.branchNumber.toString()}
                >
                  {option.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className=" flex justify-items-center flex-wrap gap-6 mt-7">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {data.totalIncome.totalServices} services
            </CardDescription>
            <CardDescription>
              {data.totalIncome.totalExpense} MMK expense
            </CardDescription>
            <CardDescription>
              {data.totalIncome.totalProfit} MMK profit
            </CardDescription>
            <CardDescription>
              {data.totalIncome.totalPrice} MMK price
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>From last Month</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {data.previousMonth.totalServices} services
            </CardDescription>
            <CardDescription>
              {data.previousMonth.totalExpense} MMK expense
            </CardDescription>
            <CardDescription>
              {data.previousMonth.totalProfit} MMK profit
            </CardDescription>
            <CardDescription>
              {data.previousMonth.totalPrice} MMK price
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Month</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {data.nextMonth.totalServices} services
            </CardDescription>
            <CardDescription>
              {data.nextMonth.totalExpense} MMK expense
            </CardDescription>
            <CardDescription>
              {data.nextMonth.totalProfit} MMK profit
            </CardDescription>
            <CardDescription>
              {data.nextMonth.totalPrice} MMK price
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoardPage;
