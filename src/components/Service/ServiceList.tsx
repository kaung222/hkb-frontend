import React, { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Service, SparePart } from "@/types/service";
import { UseFormReturn } from "react-hook-form";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import { useDataStore } from "@/stores/useDataStore";
import { customFormatDate } from "@/lib/utils";

interface ServiceListProps {
  service: Service[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any, any, undefined>;
}

interface TableHeadProps {
  label: string;
}
const CustomTableHead = ({ label }: TableHeadProps) => (
  <TableHead className="font-semibold bg-background sticky top-0 z-50 text-primary py-4 min-w-[100px] w-full border-r text-center">
    {label}
  </TableHead>
);

interface TableCellProps {
  label: string;
}
const CustomTableCell = ({ label }: TableCellProps) => (
  <TableCell className="py-4 w-auto text-center">{label}</TableCell>
);

const ServiceList: React.FC<ServiceListProps> = ({ service }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openDialog } = useDialogStore();
  const { setData, data } = useDataStore();

  const handleRowClick = (item: Service) => {
    // form.setValue("serviceDetail", item);
    setData(item);
    openDialog(dialogKeys.serviceDetail);
  };

  // const getSparePartNames = (items?: SparePart[]): string => {
  //   const getSparePartNames = (items?: SparePart[] | string): string => {
  //     if (!items) return "";

  //     // If items is a string, try to parse it
  //     if (typeof items === 'string') {
  //       try {
  //         items = JSON.parse(items);
  //       } catch (e) {
  //         console.error('Error parsing items:', e);
  //         return "";
  //       }
  //     }

  //     // Now items should be an array of SparePart
  //     return Array.isArray(items)
  //       ? items.map((item) => item.name).join(", ")
  //       : "";
  //   };
  // };

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardContent className="p-0">
        {service?.length > 0 ? (
          <div
            ref={containerRef}
            className="overflow-y-auto max-h-[70vh]"
            style={{ maxHeight: "70vh" }}
            // onScroll={handleScroll}
          >
            <Table>
              <TableHeader className="sticky top-0 z-50">
                <TableRow className="sticky top-0 z-50 bg-background">
                  <CustomTableHead label="စဥ်" />
                  <CustomTableHead label="ဆိုင်ခွဲ" />
                  <CustomTableHead label="User" />
                  <CustomTableHead label="ရက်စွဲ" />
                  <CustomTableHead label="ဘောက်ချာ" />
                  <CustomTableHead label="အမည်" />
                  <CustomTableHead label="ဖုန်းနံပါတ်" />
                  <CustomTableHead label="Brand" />
                  <CustomTableHead label="မော်ဒယ်" />
                  <CustomTableHead label="IMEI" />
                  <CustomTableHead label="အရောင်" />
                  <CustomTableHead label="ဝရန်တီ" />
                  <CustomTableHead label="Return" />
                  <CustomTableHead label="Error" />
                  <CustomTableHead label="မှတ်ချက်" />
                  <CustomTableHead label="ရက်ချိန်း" />
                  <CustomTableHead label="Technician" />
                  <CustomTableHead label="Progress" />
                  <CustomTableHead label="Condition" />
                  <CustomTableHead label="Spare Parts" />
                  <CustomTableHead label="ကျသင့်ငွေ" />
                  <CustomTableHead label="ပစ္စည်းဖိုး" />
                  <CustomTableHead label="ပေးငွေ" />
                  <CustomTableHead label="ကျန်ငွေ" />
                  <CustomTableHead label="အမြတ်ငွေ" />
                  <CustomTableHead label="ပစ္စည်း Supplier" />
                  {/* <CustomTableHead label="ပြန်ပေးနေ့" /> */}
                  <CustomTableHead label="ရွေးပြီး/မရွေးရသေး" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Spacer row to take up space before the visible rows */}
                <TableRow style={{ height: "10px" }}>
                  <TableCell colSpan={25} />
                </TableRow>

                {/* Render only the visible rows */}
                {service.map((item, index) => (
                  <TableRow
                    onClick={() => handleRowClick(item)}
                    key={index}
                    className="border-b hover:bg-opacity-50 transition-colors cursor-pointer duration-200"
                  >
                    <CustomTableCell label={String(index + 1)} />
                    <CustomTableCell label={item.branchId?.toString()} />
                    <CustomTableCell label={item.username} />
                    <CustomTableCell label={item.createdAt?.toString()} />
                    <CustomTableCell label={item.code} />
                    <CustomTableCell label={item.username} />
                    <CustomTableCell label={item.phone} />
                    <CustomTableCell label={item.brand} />
                    <CustomTableCell label={item.model} />
                    <CustomTableCell label={item.imeiNumber} />
                    <CustomTableCell label={item.color} />
                    <CustomTableCell label={item.warranty} />
                    <CustomTableCell
                      label={
                        item.serviceRetrun == true
                          ? "Yes"
                          : item.serviceRetrun == false
                          ? "No"
                          : ""
                      }
                    />
                    <CustomTableCell label={item.error} />
                    <CustomTableCell label={item.remark} />
                    <CustomTableCell label={item.dueDate?.toString()} />
                    <CustomTableCell label={item.technician} />
                    <CustomTableCell label={item.status} />
                    <CustomTableCell label={item.condition} />
                    <CustomTableCell label={""} />
                    <CustomTableCell
                      label={Number(item?.price)?.toLocaleString()}
                    />
                    <CustomTableCell
                      label={Number(item?.expense).toLocaleString()}
                    />
                    <CustomTableCell label={Number("4000").toLocaleString()} />
                    <CustomTableCell label={Number("3000").toLocaleString()} />
                    <CustomTableCell label={Number("3000").toLocaleString()} />
                    <CustomTableCell label={"2000"} />
                    {/* <CustomTableCell label={item.return_date} /> */}
                    <CustomTableCell
                      label={
                        item.retrieveDate !== null
                          ? `ရွေးပြီး, (${customFormatDate(
                              item.retrieveDate.toDateString()
                            )}) `
                          : "မရွေးရသေး"
                      }
                    />
                  </TableRow>
                ))}

                {/* Spacer row to take up space after the visible rows */}
                <TableRow style={{ height: "10px" }}>
                  <TableCell colSpan={25} />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-blue-500 text-lg">No services available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceList;
