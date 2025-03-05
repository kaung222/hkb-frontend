import React, { useState } from "react";
import { Input } from "../ui/input";
import VirtualizedTable from "../common/VirtualizedTable";

interface StockData {
  id: string;
  branch: string;
  itemCode: string;
  itemName: string;
  lot: string;
  category: string;
  qty: number;
  damage: number;
  total: number;
  date: string;
}

const StockTable: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]); // Load or fetch stock data
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof StockData>("date");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredData = stockData
    .filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
        return b[sortBy] - a[sortBy];
      }
      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    });

  const columns = [
    {
      label: "No.",
      renderCell: (_: StockData, index: number) => index + 1,
    },
    { label: "Branch No.", renderCell: (item: StockData) => item.branch },
    { label: "Item Code", renderCell: (item: StockData) => item.itemCode },
    { label: "Item Name", renderCell: (item: StockData) => item.itemName },
    { label: "Lot No.", renderCell: (item: StockData) => `Lot ${item.lot}` },
    { label: "Category", renderCell: (item: StockData) => item.category },
    { label: "Qty.", renderCell: (item: StockData) => item.qty },
    { label: "Damage", renderCell: (item: StockData) => item.damage },
    {
      label: "Total",
      renderCell: (item: StockData) => (
        <span
          className={`${
            item.total === 0
              ? "text-red-500"
              : item.total <= 3
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {item.total}
        </span>
      ),
    },
    { label: "Date", renderCell: (item: StockData) => item.date },
  ];

  return (
    <div>
      {/* <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="w-64"
          />
          <select
            className="border rounded px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof StockData)}
          >
            <option value="date">Date</option>
            <option value="itemCode">Item Code</option>
            <option value="itemName">Item Name</option>
            <option value="category">Category</option>
            <option value="branch">Branch</option>
          </select>
        </div>
        <p className="text-sm text-gray-500">
          Total Items: {filteredData.length}
        </p>
      </div> */}

      <VirtualizedTable
        data={filteredData}
        columns={columns}
        rowKey={(item) => item.id}
        onRowClick={(item) => console.log("Row clicked:", item)}
      />
    </div>
  );
};

export default StockTable;
