import React, { useState } from "react";

interface DebtItem {
  id: number;
  date: string;
  branch: string;
  name?: string;
  voucher?: string;
  description?: string;
  payyan: number;
  yayan: number;
  paid?: number | string;
}

interface DebtDetailsModalProps {
  debtDetail: DebtItem;
  onClose: () => void;
  onSave: (debtDetail: DebtItem) => void;
}

const DebtDetailsModal: React.FC<DebtDetailsModalProps> = ({
  debtDetail,
  onClose,
  onSave,
}) => {
  const [paidAmount, setPaidAmount] = useState<number | string>(debtDetail.paid || "");

  return (
    <div className="modal">
      <h3>Debt Details</h3>
      <p>Date: {debtDetail.date}</p>
      <p>Branch: {debtDetail.branch}</p>
      {/* Render other fields as needed */}
      <input
        type="number"
        placeholder="Enter paid amount"
        value={paidAmount}
        onChange={(e) => setPaidAmount(Number(e.target.value))}
      />
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSave({ ...debtDetail, paid: paidAmount })}>
        Save
      </button>
    </div>
  );
};

export default DebtDetailsModal;
