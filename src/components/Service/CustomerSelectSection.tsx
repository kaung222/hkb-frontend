import { useState } from "react";
import { Search, Loader2, Check, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useSearchCustomers } from "@/api/customer/customer.query";
import { Customer } from "@/types/customer";
import { useCurrentUser } from "@/api/user/current-user";

export function CustomerSelectSection({ form }) {
  const { data: currentUser } = useCurrentUser();
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [query, setQuery] = useState("");
  const branchId =
    currentUser?.role === "admin"
      ? Number(form.getValues("branchId"))
      : currentUser?.branchId;
  const { data: customers, isLoading } = useSearchCustomers({
    branchId,
    search: query,
  });

  const handleSearch = () => {
    setQuery(search);
    console.log(search);
  };

  const handleSelect = (customer: Customer) => {
    setSelected(customer);
    setResults([]);
    form.setValue("customerId", customer.id);
    // prefill voucher fields from the selected customer
    if (customer.username) form.setValue("username", customer.username);
    if (customer.phone) form.setValue("phone", customer.phone);
  };

  const handleClear = () => {
    setSelected(null);
    form.setValue("customerId", undefined);
    form.setValue("points", undefined);
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) {
      setSearch("");
      setResults([]);
      handleClear();
    }
  };

  return (
    <div className="col-span-1 sm:col-span-2 space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-customer"
          checked={enabled}
          onCheckedChange={(checked) => handleToggle(checked === true)}
        />
        <label
          htmlFor="select-customer"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Select Customer
        </label>
      </div>

      {enabled && (
        <div className="space-y-3 rounded-lg border border-gray-200 p-3">
          {selected ? (
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium">{selected.username}</span>
                {selected.phone && (
                  <span className="text-gray-500">({selected.phone})</span>
                )}
                <span className="text-gray-500">• {selected.points} pts</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FormLabel>Search Customer</FormLabel>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter") {
                    //     e.preventDefault();
                    //     handleSearch();
                    //   }
                    // }}
                    placeholder="Customer name"
                    className="border-gray-300 shadow-sm rounded-lg"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLoading || !branchId}
                  className="text-white rounded-lg shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {customers?.length > 0 && (
                <ul className="max-h-48 divide-y overflow-y-auto rounded-md border border-gray-200">
                  {customers?.map((customer) => (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(customer)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <span className="font-medium">{customer.username}</span>
                        <span className="text-gray-500">
                          {customer.phone} • {customer.points} pts
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && results.length === 0 && search && (
                <p className="text-sm text-gray-500">No customers found.</p>
              )}
            </>
          )}

          {selected && (
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points to add</FormLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ""}
                    className="border-gray-300 shadow-sm rounded-lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
