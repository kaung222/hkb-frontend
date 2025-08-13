import {
  useGetServiceQuery,
  useGetUnretrivedServices,
} from "@/api/service/service.query";
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
import { addDays, formatDate } from "date-fns";
import { useQueryState } from "nuqs";

export default function ServiceSummaryDialog({
  services = [],
}: {
  services: Service[];
}) {
  const [queryMode] = useQueryState("queryMode");

  const { data: usedServices } = useGetUnretrivedServices();
  const [date] = useQueryState("date", {
    defaultValue: formatDate(new Date(), "yyyy-MM-dd"),
  });

  const totalPrice = services.reduce((a, b) => a + b.price, 0);

  const totalExpense = services.reduce((a, b) => a + b.expense, 0);
  const today = new Date(date);
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const paidServices = services?.filter((s) => {
    if (s.purchasedDate) {
      const purchasedDate = new Date(s.purchasedDate);
      purchasedDate.setHours(0, 0, 0, 0); // normalize
      return purchasedDate < today;
    }
  });
  // to collect the used expense in the past day
  const prepaid = paidServices.reduce((a, b) => a + b.expense, 0);

  const used = usedServices?.filter(
    (s) =>
      formatDate(s.purchasedDate, "yyyy-MM-dd") !==
        formatDate(s.retrievedDate, "yyyy-MM-dd") || s.retrievedDate == null
  );
  console.log(used, "site money");
  const preUsed = used?.reduce((a, b) => a + b.expense, 0);
  const totalProfit = services.reduce((a, b) => a + b.profit, 0);
  const latest = totalProfit - preUsed + prepaid;
  console.log("To get", paidServices);

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
              <span className="">အမြတ်ငွေ:</span>
              <span className=" font-semibold">{totalProfit}</span>
            </div>

            {queryMode == "retrievedDate" && (
              <>
                {" "}
                <span className="text-white bg-red-500 p-2 rounded-full">
                  new
                </span>
                <div
                  className="flex justify-between items-center p-4"
                  style={{
                    backgroundColor: "#6836838f",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <span className="">ကြိုသုံးငွေ(စိုက်ငွေ):</span>
                  <span className=" font-semibold">{preUsed}</span>
                </div>
                <div
                  className="flex justify-between items-center p-4"
                  style={{
                    backgroundColor: "#6836838f",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <span className="">ရရန်ငွေ:</span>
                  <span className=" font-semibold">{prepaid}</span>
                </div>
                <div
                  className="flex justify-between items-center p-4"
                  style={{
                    backgroundColor: "#6836838f",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <span className="">
                    လက်ကျန်ငွေ (အမြတ်ငွေ + ရရန်ငွေ - စိုက်ငွေ):
                  </span>
                  <span className=" font-semibold">{latest}</span>
                </div>
              </>
            )}
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
