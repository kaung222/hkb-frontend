"use client";

import { useState, useRef } from "react";
import { QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import PrintSaveButtons from "./PrintSaveButton";
import { Service } from "@/types/service";
import { Branch } from "@/types/branch";

type ServiceVoucherProps = {
  service: Service;
  currentShop: Branch;
};

const rules = [
  {
    id: "၁",
    text: "အရေးကြီးသောအချက်အလက်များကိုသေချာစွာကြိုတင် Backup လုပ်ထားပေးပါရန်။ Data များပျက်ဆီးခဲ့ပါကတာဝန်မယူပါ။",
  },
  {
    id: "၂",
    text: "Service ပြုပြင်ထားသောဖုန်းကို Warranty မပေးသဖြင့် သေချာစွာစစ်ဆေးပြီးမှ ပြန်လည်း ပြန်လည်ရွေးယူပါ။ Service ပြုပြင်သောအစိတ်အပိုင်းနှင့် မသက်ဆိုင်သော Error များ အားတာဝန်မယူပါ။",
  },
  {
    id: "၃",
    text: "ဤဘောင်ချာဖြင့်သာ ပြည်လည်ရွေးယူပေးပါ။ ဘောင်ချာမပါပါက ပစ္စည်းရွေးယူခွင့်မပြုသည်ကို နားလည်ပေးပါရန်။",
  },
  {
    id: "၄",
    text: "ပြင်ဆင်မှုကို လူကြီးမင်းမှပယ်ဖျက်ပါက ထိုက်သင့်သောတန်ဖိုးနှင့်အညီပြုပြင်ခပေးရမည်ဖြစ်ပါသည်။",
  },
  {
    id: "၅",
    text: "Service ပြုလုပ်ရန်အပ်နှံထားသောဖုန်းများ၏ Memory Card နှင့် Sim Card များအားပြန်လည် များအားပြန်လည်ယူဆောင်သွားပေးပါရန်။",
  },
  {
    id: "၆",
    text: "ရေဝင်ဖုန်းများ၊ Shock ဖြစ်နေသောဖုန်းများအတွက်အခြားသော Error များအတွက်သီးသန့်ပြင်ဆင်ခပေးရမည် ဖြစ်ပါသည်။",
  },
  {
    id: "၇",
    text: "ပြုပြင်နေသော အစိတ်အပိုင်းမဟုတ်ဘဲအခြားအစိတ်အပိုင်းမှ Error များအတွက်သီးသန့်ပြင်ဆင်ခ ပေးရမည်ဖြစ်ပါသည်။",
  },
  {
    id: "၈",
    text: "Passward, Pattern Lock, i cloud, Mi cloud ş E-mail semm",
  },
  {
    id: "၉",
    text: "တစ်လကျော်၍လာမရွေးလျှင် ဆိုင်မှ တာဝန်မယူပါ။",
  },
];

const defaultParts = [
  "T+lcd",
  "Battery",
  "Body cover",
  "Pk+vk",
  "Software",
  "စက်ပြားဝယ်",
  "Touch+oca",
  "Usbcom",
  "Speaker",
];
export default function ServiceVoucher({
  service,
  currentShop,
}: ServiceVoucherProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const voucherRef = useRef<HTMLDivElement>(null);

  const handleAccessoryChange = (value: string) => {
    if (selectedAccessories.includes(value)) {
      setSelectedAccessories(
        selectedAccessories.filter((item) => item !== value)
      );
    } else {
      setSelectedAccessories([...selectedAccessories, value]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card
        className="w-full max-w-2xl bg-white shadow-sm px-4"
        ref={voucherRef}
      >
        <CardContent className="p-0 text-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="relative h-12 w-12">
                <img
                  src={"/hkb-logo2.png"}
                  alt="HLA KABAR Logo"
                  width={400}
                  height={400}
                  className=" bg-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">HLA KABAR</h1>
                <p className="text-xs text-muted-foreground">
                  Mobile Service Professional Team
                </p>
              </div>
            </div>
          </div>

          {/* Branch Info */}
          <div className="p-2 bg-black text-white flex items-center gap-2 text-xs">
            <span className="font-bold">{currentShop.name}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gray-500 ml-1 clip-arrow"
                ></div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-2 text-xs">
            <p>
              {currentShop.address}, {currentShop.phone}
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-2 p-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">Name :</span>
              <div className="flex-1 border-b border-dashed border-gray-400">
                {service.username}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">Invoice No :</span>
              <div className="flex-1 border-b border-dashed border-gray-400">
                {service.code}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">PH No :</span>
              <div className="flex-1 border-b border-dashed border-gray-400">
                {service.phone}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">Date :</span>
              <div className="flex-1 border-b border-dashed border-gray-400">
                {service.dueDate}
              </div>
            </div>
          </div>

          {/* Phone Details */}
          <div className="p-2 border-t border-b">
            <div className="grid grid-cols-2 gap-2 border border-gray-300">
              <div className="p-1 border-r border-gray-300 flex items-center">
                <span className="font-bold mr-1 text-xs">PH Model :</span>
                <Input readOnly value={service.model} className="h-6 text-xs" />
              </div>
              <div className="p-1 flex items-center">
                <span className="font-bold mr-1 text-xs">IMEI:</span>
                <Input
                  value={service.imeiNumber}
                  readOnly
                  className="h-6 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Color Options */}
          <div className="p-2 border-b grid grid-cols-6 items-center">
            <span className="font-bold col-span-1 text-xs">Color:</span>
            <div className="col-span-5">
              {service.color}
              {/* <RadioGroup
                value={"pink"}
                onValueChange={setSelectedColor}
                className="flex flex-wrap gap-2"
              >
                {["Black", "White", "Gold", "Pink", "Other"].map((color) => (
                  <div key={color} className="flex items-center space-x-1">
                    <RadioGroupItem
                      value={color.toLowerCase()}
                      id={color.toLowerCase()}
                    />
                    <Label htmlFor={color.toLowerCase()} className="text-xs">
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup> */}
            </div>
          </div>

          {/* Accessories */}
          <div className="p-2 border-b grid grid-cols-6 items-center">
            <span className="font-bold col-span-1 text-xs">Accessories:</span>
            <div className="col-span-5 flex flex-wrap gap-2">
              {service.items.map((i) => i.name).join(", ")}
              {/* {defaultParts.map((accessory) => (
                <div key={accessory} className="flex items-center space-x-1">
                  <Checkbox
                    id={accessory.toLowerCase().replace(" ", "-")}
                    checked={service.items
                      .map((s) => s.name.toLocaleLowerCase())
                      .includes(accessory.toLowerCase())}
                  />
                  <Label
                    htmlFor={accessory.toLowerCase().replace(" ", "-")}
                    className="text-xs"
                  >
                    {accessory}
                  </Label>
                </div>
              ))} */}
            </div>
          </div>

          {/* Pattern Lock */}
          <div className="grid grid-cols-3 border-b">
            <div className="col-span-3 p-2 ">
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs">{service.remark}</span>
              </div>
            </div>
            {/* <div className="col-span-1 p-2">
              <div className="flex flex-col items-center justify-center h-full">
                <span className="mb-1 text-xs">Pattern Lock</span>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"
                    ></div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>

          {/* Service Fee & Password */}
          <div className="grid grid-cols-2 border-b">
            <div className="p-2 border-r">
              <div className="flex items-center">
                <span className="font-bold mr-1 text-xs">Service Fee :</span>
                <div className="flex-1">{service.price}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="flex items-center">
                <span className="font-bold mr-1 text-xs">Password :</span>
                <div className="flex-1"></div>
              </div>
            </div>
          </div>

          {/* Service Center Note */}
          <div className="p-2 text-center text-xs border-b">
            <p>Error တစ်ခုခုဖြစ်ပါက Service Center သို့ ဆက်သွယ်ဆောင်ရွက်ပါ။</p>
          </div>

          {/* Signature Lines */}
          <div className="grid grid-cols-2 gap-2 p-2 border-b">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs">Customer Signature:</span>
                <div className="flex-1 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs">Date:</span>
                <div className="flex-1 border-b border-dashed border-gray-400"></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs">Technician Signature:</span>
                <div className="flex-1 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs">Service Completed:</span>
                <div className="flex-1 border-b border-dashed border-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="p-2 text-[10px] space-y-1 border-b">
            {rules.map((rule, index) => (
              <div key={index} className="flex gap-1">
                <span className="flex items-center justify-center bg-black text-white rounded-full w-4 h-4 shrink-0">
                  {rule.id}
                </span>
                <p>{rule.text}</p>
              </div>
            ))}
          </div>

          {/* QR Code */}
          {/* <div className="p-2 flex justify-end">
            <QrCode size={60} />
          </div> */}
        </CardContent>
      </Card>
      <PrintSaveButtons voucherRef={voucherRef} />
    </div>
  );
}
