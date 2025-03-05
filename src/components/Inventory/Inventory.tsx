import React from "react";
import Header from "./Header";
import InventoryBody from "./InventoryBody";

const Inventory: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      <Header
      />
      <InventoryBody />
    </div>
  );
};

export default Inventory;
