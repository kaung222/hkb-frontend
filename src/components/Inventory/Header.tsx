import React from "react";
// import useInventoryStore from "@/stores/inventory/useInventoryStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dateFilterOptions, screenList } from "@/constants/general.const";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/configs/firebase";

const Header: React.FC = () => {
  // const {
  //   // filterDate,
  //   // branch,
  //   // setFilterDate,
  //   // setBranch,
  //   setSearch,
  //   setScreen,
  //   screen,
  // } = useInventoryStore();

  const [shops] = useCollectionData(
    query(collection(db, "Shops"), orderBy("branch"))
  );

  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault("today")
  );
  const [branch, setBranch] = useQueryState(
    "branch",
    parseAsString.withDefault("all")
  );
  const [screen, setScreen] = useQueryState(
    "screen",
    parseAsStringLiteral(screenList).withDefault("item")
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Date Filter</label>
          <Select value={date} onValueChange={(value) => setDate(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptions.map((data) => (
                <SelectItem key={data.value} value={data.value}>
                  {data.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Branch</label>
          <Select value={branch} onValueChange={(value) => setBranch(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {shops?.map((shopItem) => (
                <SelectItem
                  key={shopItem.branch}
                  value={shopItem.branch.toString()}
                >
                  {shopItem.branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="block mb-2">Search</label>
          <Input placeholder="Search inventory..." onChange={() => {}} />
        </div>
      </div>

      <div className="flex gap-4 justify-between items-center">
        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant={screen === "sale" ? "default" : "outline"}
            onClick={() => setScreen("sale")}
          >
            Sale
          </Button>
          <Button
            variant={screen === "purchase" ? "default" : "outline"}
            onClick={() => setScreen("purchase")}
          >
            Purchase
          </Button>
          <Button
            variant={screen === "stock" ? "default" : "outline"}
            onClick={() => setScreen("stock")}
          >
            Stock
          </Button>
          <Button
            variant={screen === "item" ? "default" : "outline"}
            onClick={() => setScreen("item")}
          >
            Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
