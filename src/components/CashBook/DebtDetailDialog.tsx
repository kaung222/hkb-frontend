import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebtDialogStore from "@/stores/cashbook/useDebtDialogStore";

export default function DebtDetailDialog({ debtFunction }) {
  const { debtDetail, dialogOpen, setDialogOpen, resetDialog } =
    useDebtDialogStore();

  const [paidAmount, setPaidAmount] = useState(debtDetail?.paid || "");

  useEffect(() => {
    if (debtDetail) {
      setPaidAmount(debtDetail.paid || "");
    }
  }, [debtDetail]);

  const handlePaidAmountChange = (e) => setPaidAmount(e.target.value);

  const remainingAmount = useMemo(() => {
    const payyan = debtDetail?.payyan || 0;
    const yayan = debtDetail?.yayan || 0;
    const paid = parseInt(paidAmount) || 0;
    return payyan !== 0 ? payyan - paid : yayan - paid;
  }, [debtDetail, paidAmount]);

  const handleClose = useCallback(() => {
    resetDialog();
    setPaidAmount("");
  }, [resetDialog]);

  const handlePayment = useCallback(async () => {
    if (!parseInt(paidAmount)) {
      alert("No Paid Amount");
      return;
    }
    await debtFunction({ ...debtDetail, paid: paidAmount });
    handleClose();
  }, [paidAmount, debtFunction, debtDetail, handleClose]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Debt Detail</DialogTitle>
          <DialogDescription>
            Review and manage debt details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <DetailRow label="ရက်စွဲ" value={debtDetail?.date} />
          <DetailRow label="ဆိုင်ခွဲ" value={debtDetail?.branch} />
          <DetailRow label="အမည်" value={debtDetail?.name} />
          <DetailRow label="ဘောက်ချာနံပါတ်" value={debtDetail?.voucher} />
          <DetailRow label="အကြောင်းအရာ" value={debtDetail?.description} />
          <DetailRow label="ပေးရန်ကျန်ငွေ" value={debtDetail?.payyan} />
          <DetailRow label="ရရန်ကျန်ငွေ" value={debtDetail?.yayan} />

          <div className="flex items-center gap-4">
            <Label>ပြန်ဆပ်ငွေ</Label>
            <Input
              type="number"
              value={paidAmount}
              onChange={handlePaidAmountChange}
              placeholder="ပြန်ဆပ်ငွေ"
              className="w-full"
            />
          </div>

          <DetailRow label="ဆပ်ပြီးကျန်ငွေ" value={remainingAmount} />
        </div>

        <DialogFooter className="flex gap-4">
          <Button variant="outline" onClick={handleClose} className="text-sm">
            ပိတ်မည်
          </Button>
          <Button onClick={handlePayment} className="text-sm">
            အကြွေးဆပ်မည်
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
