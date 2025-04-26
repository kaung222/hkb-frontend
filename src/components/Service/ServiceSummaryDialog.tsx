import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { parseAsString, useQueryState } from "nuqs";
import { Service } from "@/types/service";

export default function ServiceSummaryDialog({
  services = [],
}: {
  services: Service[];
}) {
  const [isRetrieved, setIsRetrived] = useQueryState(
    "is_retrived",
    parseAsString.withDefault("all")
  );
  const filteredServices = () => {
    if (isRetrieved === "all") {
      return services;
    } else if (isRetrieved === "1") {
      return services.filter((data) => data.retrieveDate !== null);
    } else {
      return services.filter((data) => data.retrieveDate === null);
    }
  };

  console.log(filteredServices());
  const totalPrice = filteredServices().reduce((a, b) => a + b.price, 0);

  const totalExpense = filteredServices().reduce((a, b) => a + b.expense, 0);

  const totalPaid = filteredServices().reduce((a, b) => a + b.paidAmount, 0);

  const totalRemain = filteredServices().reduce((a, b) => a + b.leftToPay, 0);

  const totalProfit = filteredServices().reduce((a, b) => a + b.profit, 0);

  // const retrievdTotalExpense = service
  //   .filter((data) => data.is_retrieved === "1")
  //   .reduce((a, b) => a + (Number(b.expense) || 0), 0);

  // const retrivedTotalPaid = service
  //   .filter((data) => data.is_retrieved === "1")
  //   .reduce((a, b) => a + (Number(b.paid) || 0), 0);

  // const retrievedTotalPaidWithoutExpense =
  //   retrivedTotalPaid - retrievdTotalExpense;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>စာရင်းအနှစ်ချုပ်ပြရန်</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Service Summary</DialogTitle>
        </DialogHeader>
        <div className="">
          <Select value={isRetrieved} onValueChange={setIsRetrived}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">အားလုံး</SelectItem>
              <SelectItem value="1">ရွေးပြီး</SelectItem>
              <SelectItem value="0">မရွေးရသေး</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid gap-4 py-4">
            {/* Each row */}
            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">စုစုပေါင်းဆားဗစ်:</span>
              <span className=" font-semibold">
                {filteredServices()?.length}
              </span>
            </div>
            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">ကျသင့်ငွေ:</span>
              <span className=" font-semibold">{totalPrice}</span>
            </div>

            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">ပစ္စည်းဖိုး:</span>
              <span className=" font-semibold">{totalExpense}</span>
            </div>

            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">ပေးငွေ:</span>
              <span className=" font-semibold">{totalPaid}</span>
            </div>

            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">ကျန်ငွေ:</span>
              <span className=" font-semibold">{totalRemain}</span>
            </div>

            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">အမြတ်ငွေ:</span>
              <span className=" font-semibold">{totalProfit}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
