import React from "react";
import SaleTable from "./SaleTable";
import PurchaseTable from "./PurchaseTable";
import StockTable from "./StockTable";
import ItemTable from "./ItemTable";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { screenList } from "@/constants/general.const";
// import useInventoryStore from "@/stores/inventory/useInventoryStore";

const InventoryBody: React.FC = () => {
  const [screen] = useQueryState(
    "screen",
    parseAsStringLiteral(screenList).withDefault("item")
  );

  switch (screen) {
    case "sale":
      return <SaleTable />;
    case "purchase":
      return <PurchaseTable />;
    case "stock":
      return <StockTable />;
    case "item":
      return <ItemTable />;
    default:
      return <div>Select a category to view details</div>;
  }
};

export default InventoryBody;
