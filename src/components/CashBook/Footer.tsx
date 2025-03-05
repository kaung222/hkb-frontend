import React from "react";

interface Totals {
  [key: string]: number;
}

interface FooterProps {
  creditList: boolean;
  totals: Totals;
}

const Footer: React.FC<FooterProps> = ({ creditList, totals }) => {
  return (
    <div className="footer">
      {creditList ? (
        <div>
          <p>Total Debt: {totals.totalDebt}</p>
          <p>Total Credit: {totals.totalCredit}</p>
        </div>
      ) : (
        <div>
          <p>Total Service: {totals.totalService}</p>
          <p>Total Purchase: {totals.totalPurchase}</p>
          <p>Total Sale: {totals.totalSale}</p>
          <p>Total General Expense: {totals.totalGeneralExpense}</p>
          <p>Total Adjust: {totals.totalAdjust}</p>
        </div>
      )}
    </div>
  );
};

export default Footer;
