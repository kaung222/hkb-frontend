import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { dialogKeys } from "@/constants/general.const";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
// import VoucherB3 from "@/assets/voucher-b3.jpg";
import VoucherCommon from "@/assets/voucher-common.jpg";
import { format } from "date-fns";
import { useRef } from "react";
import domToImage from "dom-to-image-more";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDataStore } from "@/stores/useDataStore";
import { Service } from "@/types/service";
import { useGerBraches } from "@/api/branch/get-branch";

interface Props {
  serviceDetail: Service;
}
export default function VoucherDialog({ serviceDetail }: Props) {
  const { isOpen, handleDialogChange } = useDialogStore();
  const { clearData } = useDataStore();
  const { data: shops, isLoading: shopInfoLoading } = useGerBraches();
  const shopInfo = shops?.find(
    (shop) => shop?.branchNumber === serviceDetail?.branchId
  );
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
  const parsedSpareParts = JSON.parse(serviceDetail?.item || "[]");
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
      <DialogContent className="w-full p-0 bg-transparent border-none">
        <div className="max-h-[90vh] overflow-y-auto">
          <div
            ref={voucherRef}
            className="relative text-xs voucher-container text-black"
          >
            <img src={VoucherCommon} />
            <div>
              {/* branch info */}
              <p className="absolute top-[26%] left-[16%] text-white font-bold text-[10px]">
                {serviceDetail?.branchId}
              </p>
              <p className="absolute top-[26%] left-[25%] font-bold text-[10px] text-center max-w-[300px]">
                {shopInfoLoading ? "loading" : shopInfo?.address}
              </p>
              <p className="absolute bottom-[11.2%] right-[6%] text-xs  font-bold text-[10px]">
                {serviceDetail?.branchId}
              </p>

              {/* customer name */}
              <p className="absolute top-[33.5%] left-[18%]">
                {serviceDetail?.username}
              </p>
              {/* voucher no */}
              <p className="absolute top-[33%] right-[2%] text-[10px] font-semibold">
                {serviceDetail?.code}
              </p>
              {/* phone no */}
              <p className="absolute top-[35.6%] left-[18%]">
                {serviceDetail?.phone}
              </p>
              {/* date */}
              <p className="absolute top-[35.6%] right-[15%]">
                {format(new Date(), "dd MMM yyyy")}
              </p>
              {/* phone model */}
              <p className="absolute top-[40%] left-[20%]">
                {serviceDetail?.model}
              </p>
              {/* imei */}
              <p className="absolute top-[40%] right-[30%]">
                {serviceDetail?.imeiNumber}
              </p>
              {/* color */}
              {phoneColors.includes(serviceDetail?.color?.toLowerCase()) ? (
                <div
                  className={cn(
                    "absolute top-[44%] h-3 w-3 bg-black rounded-full",
                    getColorsPosition(serviceDetail?.color?.toLowerCase())
                  )}
                ></div>
              ) : (
                <p className="absolute top-[44%] right-[8%]">
                  {serviceDetail?.color}
                </p>
              )}
              {/* အပိုပစ္စည်း */}
              {parsedSpareParts?.length > 0 ? (
                parsedSpareParts.map((data, index: number) =>
                  knownSpareParts.includes(data?.part?.toLowerCase()) ? (
                    <div
                      key={index}
                      className={cn(
                        "absolute top-[47.3%] h-3 w-3 bg-black rounded-full",
                        getSparePartsPosition(data?.part?.toLowerCase())
                      )}
                    ></div>
                  ) : (
                    // fallback position for unknown part
                    <p key={index} className="absolute top-[47%] right-[8%]">
                      {data?.part}
                    </p>
                  )
                )
              ) : // If no spare parts array => fallback to old behavior (single item)
              knownSpareParts.includes(serviceDetail?.item?.toLowerCase()) ? (
                <div
                  className={cn(
                    "absolute top-[47.3%] h-3 w-3 bg-black rounded-full",
                    getSparePartsPosition(serviceDetail?.item?.toLowerCase())
                  )}
                ></div>
              ) : (
                <p className="absolute top-[47%] right-[8%]">
                  {serviceDetail?.item}
                </p>
              )}
              {/* {spareParts.includes(serviceDetail?.item?.toLowerCase()) ? (
                <div
                  className={cn(
                    "absolute top-[47.3%] h-3 w-3 bg-black rounded-full",
                    getSparePartsPosition(serviceDetail?.item?.toLowerCase())
                  )}
                ></div>
              ) : (
                <p className="absolute top-[47%] right-[8%]">
                  {serviceDetail?.item}
                </p>
              )} */}
              {/* error */}
              <p className="absolute top-[52%] left-[8%] max-w-[300px]">
                {serviceDetail?.error}
              </p>
              {/* service fee */}
              <p className="absolute top-[61%] left-[20%]">
                {serviceDetail?.price}
              </p>
            </div>
          </div>

          <div className="flex gap-x-3 absolute bottom-1 left-0 right-0 mx-1">
            <Button
              className="w-full"
              onClick={handleSaveAsImage}
              type="button"
            >
              Save as png
            </Button>
            <Button className="w-full" onClick={handleSaveAsPDF} type="button">
              Save as pdf
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
