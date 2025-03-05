import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dateFilterOptions } from "@/constants/general.const";

interface Props {
  shop: { branch: string }[];
  form: any;
  toggleCreditList: () => void;
  creditList: boolean;
}
const CashBookHeader: React.FC<Props> = ({
  shop,
  form,
  // toggleCreditList,
  // creditList,
}) => {
  return (
    <Card className="w-full mx-auto shadow-lg rounded-lg">
      <CardContent className="p-6 space-y-4">
        <Form {...form}>
          <form className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Date Filter */}
              <FormField
                control={form.control}
                name="filterDate"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[200px]">
                    <FormLabel>Date Filter</FormLabel>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-lg">
                        <SelectValue placeholder="Select Date Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {dateFilterOptions.map((data) => (
                          <SelectItem key={data.value} value={data.value}>
                            {data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch Filter */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[200px]">
                    <FormLabel>Branch</FormLabel>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-lg">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {shop.map((shopItem) => (
                          <SelectItem
                            key={shopItem.branch}
                            value={shopItem.branch}
                          >
                            Branch {shopItem.branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Search Field */}
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                      <Input placeholder="Search..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button>Add New</Button>
                {/* <Button type="button" onClick={toggleCreditList}>
                  {creditList ? "အကြွေးစာရင်းပိတ်ပါ" : "အကြွေးစာရင်းပြပါ"}
                </Button> */}
                <Button>စာရင်းအနှစ်ချုပ်ပြရန်</Button>
              </div>
              <Select
                value={form.getValues().sortByItem}
                onValueChange={(value) => form.setValue("sortByItem", value)}
              >
                <SelectTrigger className="w-[180px] rounded-lg">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="voucher">Voucher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CashBookHeader;
