import IncomeExpensesCards from "@/components/main/transactions/components/IncomeExpensesCards";
import TransactionsBoardComponent from "@/components/main/transactions";

const TransactionsPage = () => {
  return (
    <div className="w-full">
      <IncomeExpensesCards />
      <TransactionsBoardComponent />
    </div>
  );
};

export default TransactionsPage;
