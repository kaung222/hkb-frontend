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
import { Service } from "@/types/service";
import { formatDate } from "date-fns";

export default function ServiceSummaryDialog({
  services = [],
}: {
  services: Service[];
}) {
  const totalPrice = services.reduce((a, b) => a + b.price, 0);

  const totalExpense = services.reduce((a, b) => a + b.expense, 0);

  const totalPaid = services.reduce((a, b) => a + b.paidAmount, 0);

  const totalRemain = services.reduce((a, b) => a + b.leftToPay, 0);

  const totalProfit = services.reduce((a, b) => a + b.profit, 0);

  const partsFees = services
    .filter(
      (service) =>
        formatDate(service.createdAt, "yyyy-MM-dd") !==
        formatDate(new Date(), "yyyy-MM-dd")
    )
    .reduce((a, b) => a + b.expense, 0);

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
          {/* <Select value={isRetrieved} onValueChange={setIsRetrived}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">အားလုံး</SelectItem>
              <SelectItem value="1">ရွေးပြီး</SelectItem>
              <SelectItem value="0">မရွေးရသေး</SelectItem>
            </SelectContent>
          </Select> */}
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
              <span className=" font-semibold">{services?.length}</span>
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
            <div
              className="flex justify-between items-center p-4"
              style={{
                backgroundColor: "#6836838f",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <span className="">လက်ကျန်ငွေ:</span>
              <span className=" font-semibold">{totalProfit + partsFees}</span>
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
