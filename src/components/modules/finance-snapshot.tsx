import { FinanceSummary } from "@/lib/store/types";

interface FinanceSnapshotProps {
  data: FinanceSummary;
}

export function FinanceSnapshot({ data }: FinanceSnapshotProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Josh Net Monthly</span>
        <span>${data.joshNetMonthly}</span>
      </div>
      <div className="flex justify-between">
        <span>Rental Income</span>
        <span>${data.rentalIncome}</span>
      </div>
      <div className="flex justify-between">
        <span>Rent Paid</span>
        <span>${data.rentPaid}</span>
      </div>
      <div className="flex justify-between">
        <span>Mortgage Payment</span>
        <span>${data.mortgagePayment}</span>
      </div>
      <div className="flex justify-between">
        <span>Re-draw Available</span>
        <span>${data.reDrawAvailable}</span>
      </div>
      <div className="flex justify-between">
        <span>Groceries Monthly</span>
        <span>${data.groceriesMonthly}</span>
      </div>
      <div className="flex justify-between">
        <span>Fuel Monthly</span>
        <span>${data.fuelMonthly}</span>
      </div>
    </div>
  );
}