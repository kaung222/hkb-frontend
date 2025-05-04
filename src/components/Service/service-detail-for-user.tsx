import { useGetSingleService } from "@/api/service/service.query";
import React from "react";
import { useParams } from "react-router-dom";
import { Status } from "./Service";
import { format } from "date-fns";

const ServiceDetails = () => {
  const params = useParams();
  const { data } = useGetSingleService();

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        ဝန်ဆောင်မှု အချက်အလက် မတွေ့ရှိပါ
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg mt-8">
      <div className="space-y-6">
        {/* Service Status Banner */}
        <div
          className={`p-4 rounded-md ${
            data.status === "retrieved"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          <h2 className="text-lg font-semibold mb-1">
            ပြင်ဆင်မှုအခြေအနေ:{" "}
            {data.status === "retrieved" ? "ပြီးဆုံး" : "ပြင်ဆင်နေဆဲ"}
          </h2>
          <p>ရက်ချိန်း - {format(new Date(data.dueDate), "MMMM dd, yyyy")}</p>
        </div>

        {/* Device Information */}
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">ဖုန်းအချက်အလက်များ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">အမှတ်တံဆိပ်</p>
              <p className="font-medium">{data.brand}</p>
            </div>
            <div>
              <p className="text-muted-foreground">မော်ဒယ်</p>
              <p className="font-medium">{data.model}</p>
            </div>
            <div>
              <p className="text-muted-foreground">IMEI နံပါတ်</p>
              <p className="font-medium">{data.imeiNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">အရောင်</p>
              <p className="font-medium">{data.color}</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">ပြင်ဆင်မှုအသေးစိတ်</h3>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground">ဖြစ်ပေါ်နေသောပြဿနာ</p>
              <p className="font-medium">{data.error}</p>
            </div>
            <div>
              <p className="text-muted-foreground">
                လဲလှယ်/ပြင်ဆင်မည့် အပိုပစ္စည်းများ
              </p>
              <ul className="list-disc list-inside">
                {data.items.map((item, index) => (
                  <li key={index} className="font-medium">
                    {item.name} - {item.price.toLocaleString()} ကျပ်
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground">ပြင်ဆင်နိုင်မှုအခြေအနေ</p>
              <p className="font-medium">{data.condition}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">ငွေပေးချေမှုအချက်အလက်</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">စုစုပေါင်းကျသင့်ငွေ</span>
              <span className="font-medium">
                {data.price.toLocaleString()} ကျပ်
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ပေးချေပြီးငွေ</span>
              <span className="font-medium">
                {data.paidAmount.toLocaleString()} ကျပ်
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ပေးချေရန်ကျန်ငွေ</span>
              <span className="font-medium">
                {data.leftToPay.toLocaleString()} ကျပ်
              </span>
            </div>
          </div>
        </div>

        {/* Service Code */}
        <div className="text-center text-sm text-muted-foreground">
          ဝန်ဆောင်မှုကုဒ်: {data.code}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
