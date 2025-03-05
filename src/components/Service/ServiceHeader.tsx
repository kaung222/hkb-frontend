// ServiceHeader.tsx
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceHeaderProps {
  filterDate: string;
  setFilterDate: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  branches?: Array<{ branch: string }>;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  filterDate,
  setFilterDate,
  branch,
  setBranch,
  branches = [],
}) => {
  return (
    <div className="flex items-center justify-between bg-purple-700 p-4 rounded-md text-white shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Service Management</h1>

        <Select onValueChange={setFilterDate} value={filterDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Date Range</SelectLabel>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setBranch} value={branch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Branches</SelectLabel>
              <SelectItem value="all">All Branches</SelectItem>
              {branches?.map((shop) => (
                <SelectItem key={shop.branch} value={shop.branch}>
                  Branch {shop.branch}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/*<ModeToggle/>*/}
    </div>
  );
};

export default ServiceHeader;
