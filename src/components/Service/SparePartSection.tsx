import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { FormField, FormLabel } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SparePart } from "@/types/service";

// interface SparePart {
//   part: string;
//   price: number;
// }

// interface ServiceFormValues {
//   serviceDetail: {
//     spareParts: SparePart[];
//     item: string;
//     expense: number;
//     // Add other form fields as needed
//   };
// }

export function SparePartsSection({
  spareParts,
  setSpareParts,
}: {
  spareParts: SparePart[];
  setSpareParts: React.Dispatch<React.SetStateAction<SparePart[]>>;
}) {
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "spareParts",
  // });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // const spareParts: SparePart[] = useWatch({
  //   control,
  //   name: "spareParts",
  //   defaultValue: [],
  // });
  // console.log(spareParts);

  const totalExpense =
    spareParts?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  // const defaultParts = ["battery", "memory card", "sim card", "pen"];
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

  const handlePriceChange = (value: string, index: number) => {
    setSpareParts(
      spareParts.map((part, i) =>
        i === index ? { ...part, price: Number(value) } : part
      )
    );
  };

  const handleRemoveSparePart = (ind: number) => {
    setSpareParts(spareParts.filter((_, index) => index != ind));
  };

  const handleAddPart = (partName: string) => {
    const existed = spareParts.find((part) => part.name === partName);
    console.log("existest", existed);
    if (partName && !existed) {
      // append({ name: partName, price: 0 });
      setSpareParts((pre) => [...pre, { name: partName, price: 0 }]);
    }
    setPopoverOpen(false);
    setSearchValue("");
  };

  return (
    <div className="space-y-4">
      <FormLabel>Spare Parts (အပိုပစ္စည်း)</FormLabel>

      {/* Parts Selector */}
      <DropdownMenu open={popoverOpen} onOpenChange={setPopoverOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select or create spare part...
            <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search parts..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandGroup className="max-h-48 overflow-y-auto">
                {defaultParts
                  .filter((part) =>
                    part.toLowerCase().includes(searchValue?.toLowerCase())
                  )
                  ?.map((part) => (
                    <CommandItem
                      key={part}
                      value={part}
                      onSelect={() => handleAddPart(part)}
                    >
                      {part}
                    </CommandItem>
                  ))}
              </CommandGroup>
              {searchValue && !defaultParts.includes(searchValue) && (
                <CommandEmpty className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleAddPart(searchValue)}
                  >
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Create "{searchValue}"
                  </Button>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Parts List */}
      <div className="space-y-2">
        {spareParts.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              {/* <FormField
                // control={control}
                name={`spareParts.${index}.name`}
                render={({ field }) => (
                )}
              /> */}
              <Input value={field.name} readOnly className="" />
              <Input
                // {...field}
                type="number"
                placeholder="ပစ္စည်းဖိုး"
                value={field.price || 0}
                className=""
                onChange={(e) => handlePriceChange(e.target.value, index)}
                onWheel={(e) =>
                  e.target.addEventListener(
                    "wheel",
                    function (e) {
                      e.preventDefault();
                    },
                    { passive: false }
                  )
                }
              />
              {/* <FormField
                // control={control}
                name={`spareParts.${index}.price`}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="ပစ္စည်းဖိုး"
                    className=""
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    onWheel={(e) =>
                      e.target.addEventListener(
                        "wheel",
                        function (e) {
                          e.preventDefault();
                        },
                        { passive: false }
                      )
                    }
                  />
                )}
              /> */}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveSparePart(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className=" p-4 rounded-lg">
        {spareParts.map((part, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{part.name}:</span>
            <span>{part.price || 0} Ks</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-semibold">
          <div className="flex justify-between">
            <span>Total Expense:</span>
            <span>{totalExpense} Ks</span>
          </div>
        </div>
      </div>

      {/* Hidden Fields for Backend */}
      {/* <FormField
        control={control}
        name="item"
        render={({ field }) => (
          <Input {...field} type="hidden" value={JSON.stringify(spareParts)} />
        )}
      />
      <FormField
        control={control}
        name="expense"
        render={({ field }) => (
          <Input {...field} type="hidden" value={totalExpense} />
        )}
      /> */}
    </div>
  );
}
