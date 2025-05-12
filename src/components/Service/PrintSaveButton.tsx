"use client";

import type React from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface PrintSaveButtonsProps {
  voucherRef: React.RefObject<HTMLDivElement>;
}

const PrintSaveButtons: React.FC<PrintSaveButtonsProps> = ({ voucherRef }) => {
  const handlePrint = () => {
    if (voucherRef.current) {
      const printContent = voucherRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleSaveAsPNG = async () => {
    if (voucherRef.current) {
      try {
        const dataUrl = await toPng(voucherRef.current, {
          quality: 1.0,
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = "service_voucher.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Error generating PNG:", err);
      }
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <Button onClick={handlePrint} className="flex items-center gap-2">
        <Printer size={16} />
        Print
      </Button>
      <Button onClick={handleSaveAsPNG} className="flex items-center gap-2">
        <Download size={16} />
        Save as PNG
      </Button>
    </div>
  );
};

export default PrintSaveButtons;
