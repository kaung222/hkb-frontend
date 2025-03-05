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

export default function ServiceSummaryDialog({ service = [] }) {
  const [isRetrieved, setIsRetrived] = useQueryState(
    "is_retrived",
    parseAsString.withDefault("all")
  );
  const totalServiceCharges = service
    .reduce((a, b) => a + (Number(b.service_charges) || 0), 0)
    .toLocaleString();

  const totalExpense = service
    .reduce((a, b) => a + (Number(b.expense) || 0), 0)
    .toLocaleString();

  const totalPaid = service
    .reduce((a, b) => a + (Number(b.paid) || 0), 0)
    .toLocaleString();

  const totalRemain = service
    .reduce((a, b) => a + (Number(b.remain) || 0), 0)
    .toLocaleString();

  const totalProfit = service
    .reduce((a, b) => a + (Number(b.profit) || 0), 0)
    .toLocaleString();

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
              <SelectItem value="all">all</SelectItem>
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
              <span className=" font-semibold">{service?.length}</span>
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
              <span className=" font-semibold">{totalServiceCharges}</span>
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
