import CashTable from "./CashTable";
import DebtDetailDialog from "./DebtDetailDialog";
import DebtDetailsModal from "./DebtDetailModal";
import DebtTable from "./DebtTable";
import Footer from "./Footer";
import Header from "./Header";
import useCashBook from "./hooks/useCashBook";

const CashBook: React.FC = () => {
  const {
    form,
    cash,
    debt,
    creditList,
    toggleCreditList,
    debtDetail,
    setDebtDetail,
    updateCashDetail,
    updateDebtDetail,
    totals,
  } = useCashBook();

  return (
    <div className="p-8 ">
      <Header
        form={form}
        creditList={creditList}
        toggleCreditList={toggleCreditList}
        shop={[]}
      />
      <DebtTable debt={debt} />
      <DebtDetailDialog debtFunction={updateDebtDetail} />
    </div>
  );
};

export default CashBook;
