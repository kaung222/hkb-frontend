import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { dialogKeys } from "@/constants/general.const";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
// import VoucherB3 from "@/assets/voucher-b3.jpg";
import { format } from "date-fns";
import { useRef } from "react";
import domToImage from "dom-to-image-more";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDataStore } from "@/stores/useDataStore";
import { Service } from "@/types/service";
import { useGerBraches } from "@/api/branch/branch.query";
import ServiceVoucher from "./VoucherUi";

interface Props {
  serviceDetail: Service;
}
export default function VoucherDialog({ serviceDetail }: Props) {
  const { isOpen, handleDialogChange } = useDialogStore();
  const { clearData } = useDataStore();
  const { data: shops, isLoading: shopInfoLoading } = useGerBraches();
  const shopInfo = shops?.find((shop) => shop?.id === serviceDetail?.branchId);
  const voucherRef = useRef<HTMLDivElement>(null);

  const handleSaveAsImage = async () => {
    if (voucherRef.current) {
      try {
        const dataUrl = await domToImage.toPng(voucherRef.current, {
          quality: 1,
        });
        const link = document.createElement("a");
        link.download = "voucher.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        toast.error("Failed to save as image:", error);
      }
    }
  };

  const handleSaveAsPDF = async () => {
    if (voucherRef.current) {
      try {
        const dataUrl = await domToImage.toPng(voucherRef.current, {
          quality: 1,
        });
        const pdf = new jsPDF("portrait", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
          (voucherRef.current.offsetHeight * pdfWidth) /
          voucherRef.current.offsetWidth;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("voucher.pdf");
      } catch (error) {
        console.error("Failed to save as PDF:", error);
      }
    }
  };

  const phoneColors = ["black", "white", "gold", "pink"];
  const getColorsPosition = (
    color: "black" | "white" | "gold" | "pink" | string
  ) => {
    switch (color) {
      case "black":
        return "left-[31.5%]";
      case "white":
        return "left-[42.43%]";
      case "gold":
        return "left-[55.38%]";
      case "pink":
        return "left-[67.6%]";
      default:
        break;
    }
  };

  // const parsedSparePart = JSON.parse(serviceDetail?.item || "[]");
  // const spareParts = ["battery", "memory card", "sim card", "pen"];
  // const parsedSpareParts = JSON.parse(serviceDetail?.items || "[]");
  const knownSpareParts = ["battery", "memory card", "sim card", "pen"];
  const getSparePartsPosition = (color: string) => {
    switch (color) {
      case "battery":
        return "left-[33%]";
      case "memory card":
        return "left-[48.43%]";
      case "sim card":
        return "left-[60%]";
      case "pen":
        return "left-[69.1%]";
      default:
        break;
    }
  };

  return (
    <Dialog
      open={isOpen(dialogKeys.getVoucher)}
      onOpenChange={(isOpen) => {
        handleDialogChange(dialogKeys.getVoucher, isOpen);
        clearData();
      }}
    >
      <DialogContent className="w-full max-h-screen overflow-auto max-w-4xl p-0 bg-transparent border-none">
        {shops && serviceDetail && (
          <ServiceVoucher
            service={serviceDetail}
            currentShop={shops.find((s) => s.id == serviceDetail.branchId)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
