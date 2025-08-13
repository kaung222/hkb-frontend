import { useGetUnretrivedServices } from "@/api/service/service.query";
import { Service } from "@/types/service";
import { formatDate } from "date-fns";
import { useQueryState } from "nuqs";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const UnretrivedService = ({ services = [] }: { services: Service[] }) => {
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
        <Button>See Details</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ကြိုသုံးငွေ(စိုက်ငွေ) & ရရန်ငွေ</DialogTitle>
        </DialogHeader>
        <div className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Vr.</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Retrieved Date</TableCell>
                <TableCell>Expense</TableCell>
                {/* <TableCell>Profit</TableCell> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {used?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    {formatDate(item.createdAt, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {item.retrievedDate
                      ? formatDate(item.retrievedDate, "yyyy-MM-dd")
                      : ""}
                  </TableCell>
                  <TableCell>{item.expense}</TableCell>
                  {/* <TableCell>{item.expense}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className=" font-bold text-md">
            ကြိုသုံးငွေ(စိုက်ငွေ) : {preUsed}
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Vr.</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Retrieved Date</TableCell>
                <TableCell>Expense</TableCell>
                {/* <TableCell>Profit</TableCell> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidServices?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    {formatDate(item.createdAt, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {item.retrievedDate
                      ? formatDate(item.retrievedDate, "yyyy-MM-dd")
                      : ""}
                  </TableCell>
                  <TableCell>{item.expense}</TableCell>
                  {/* <TableCell>{item.expense}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className=" font-bold text-md">ရရန်ငွေ : {prepaid}</p>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnretrivedService;
