import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { parseAsString, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useGerBraches } from "@/api/branch/branch.query";

const BranchFilter = () => {
  const form = useForm();
  const { data: shops } = useGerBraches();
  const [branch, setBranch] = useQueryState(
    "branch",
    parseAsString.withDefault("1")
  );
  return (
    <>
      <FormField
        control={form.control}
        name="branch"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[200px]">
            <FormLabel>Branch</FormLabel>
            <Select
              {...field}
              defaultValue={branch}
              value={field.value}
              onValueChange={(e) => {
                field.onChange(e);
                setBranch(e);
              }}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="all">All Branches</SelectItem> */}
                {shops?.map((shopItem) => (
                  <SelectItem
                    key={shopItem.id}
                    value={shopItem.branchNumber.toString()}
                  >
                    {shopItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BranchFilter;
