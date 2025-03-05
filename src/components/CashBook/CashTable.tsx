import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { CashItem } from "@/types/cashbook";

interface CashTableProps {
  cash: CashItem[];
  updateCashDetail: (cashDetail: CashItem) => void;
}

interface CustomTableHeadProps {
  label: string;
}
const CustomTableHead = ({ label }: CustomTableHeadProps) => (
  <TableHead className="font-semibold bg-background sticky top-0 z-50 text-primary py-4 min-w-[100px] w-full border-r text-center">
    {label}
  </TableHead>
);

const CashTable: React.FC<CashTableProps> = ({ cash, updateCashDetail }) => {
  const handleEdit = (item: CashItem, field: string, value: number) => {
    updateCashDetail({ ...item, [field]: value });
  };

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardContent className="p-0">
        {cash.length > 0 ? (
          <div
            className="overflow-y-auto max-h-[70vh]"
            style={{ maxHeight: "70vh" }}
          >
            <Table>
              <TableHeader className="sticky top-0 z-50 bg-background">
                <TableRow className="bg-background">
                  <CustomTableHead label="ID" />
                  <CustomTableHead label="Service" />
                  <CustomTableHead label="Sale" />
                  <CustomTableHead label="Purchase" />
                  <CustomTableHead label="Remaining Payment" />
                  <CustomTableHead label="Remaining Collection" />
                  <CustomTableHead label="General Expense" />
                  <CustomTableHead label="Adjust" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cash.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b hover:bg-background transition-colors duration-200 cursor-pointer"
                    onClick={() => handleEdit(item, "id", item.id)} // Example interaction
                  >
                    <TableCell className="py-4 text-center">
                      {item.id}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {item.service}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {item.sale}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {item.purchase}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {item.payyan}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {item.yayan}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <input
                        type="number"
                        defaultValue={item.generalExpense}
                        onBlur={(e) =>
                          handleEdit(item, "generalExpense", +e.target.value)
                        }
                        className="w-full text-center"
                      />
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <input
                        type="number"
                        defaultValue={item.adjust}
                        onBlur={(e) =>
                          handleEdit(item, "adjust", +e.target.value)
                        }
                        className="w-full text-center"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-blue-500 text-lg">No cash records available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashTable;
