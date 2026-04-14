"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLocalStore } from "@/lib/store/useLocalStore";
import { FinanceSummary } from "@/lib/store/types";

interface IncomeSource {
  label: string;
  amount: number;
}

interface ExpenseCategory {
  label: string;
  amount: number;
}

interface RedrawEntry {
  date: string;
  amount: number;
  type: 'drawn' | 'deposited';
  reason: string;
}

interface PropertySnapshot {
  address: string;
  estimatedValue: number;
  remainingMortgage: number;
  estimatedEquity: number;
  weeklyRent: number;
  rentalYield: string;
}

export default function FinancesPage() {
  // 1. All useLocalStore calls first
  const [financeSummary, setFinanceSummary] = useLocalStore<FinanceSummary>('finances', {
    joshNetMonthly: 4853,
    rentalIncome: 2687,
    rentPaid: 2427,
    mortgagePayment: 1300,
    reDrawAvailable: 12000,
    groceriesMonthly: 1529,
    fuelMonthly: 592,
  });

  const [incomeSources, setIncomeSources] = useLocalStore<IncomeSource[]>('incomeSources', [
    { label: "Josh salary", amount: 4853 },
    { label: "Rental income", amount: 2687 },
  ]);

  const [expenseCategories, setExpenseCategories] = useLocalStore<ExpenseCategory[]>('expenseCategories', [
    { label: "Rent", amount: 2427 },
    { label: "Mortgage", amount: 1300 },
    { label: "Groceries", amount: 1529 },
    { label: "Fuel", amount: 592 },
  ]);

  const [reDrawLog, setReDrawLog] = useLocalStore<RedrawEntry[]>('reDrawLog', []);

  const [propertySnapshot] = useLocalStore<PropertySnapshot>('propertySnapshot', {
    address: "53 Buckland Street, Dubbo",
    estimatedValue: 750000,
    remainingMortgage: 130000,
    estimatedEquity: 620000,
    weeklyRent: 620,
    rentalYield: "Good yield for area",
  });

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [editingIncome, setEditingIncome] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [newIncomeLabel, setNewIncomeLabel] = useState("");
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [newExpenseLabel, setNewExpenseLabel] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newRedrawDate, setNewRedrawDate] = useState("");
  const [newRedrawAmount, setNewRedrawAmount] = useState("");
  const [newRedrawType, setNewRedrawType] = useState<'drawn' | 'deposited'>('drawn');
  const [newRedrawReason, setNewRedrawReason] = useState("");

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic and JSX
  const totalIncome = incomeSources.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseCategories.reduce((sum, item) => sum + item.amount, 0);
  const netPosition = totalIncome - totalExpenses;

  const addIncomeSource = () => {
    if (newIncomeLabel && newIncomeAmount) {
      setIncomeSources([...incomeSources, { label: newIncomeLabel, amount: parseFloat(newIncomeAmount) }]);
      setNewIncomeLabel("");
      setNewIncomeAmount("");
    }
  };

  const updateIncome = (index: number, amount: number) => {
    const updated = [...incomeSources];
    updated[index].amount = amount;
    setIncomeSources(updated);
    setEditingIncome(null);
  };

  const addExpenseCategory = () => {
    if (newExpenseLabel && newExpenseAmount) {
      setExpenseCategories([...expenseCategories, { label: newExpenseLabel, amount: parseFloat(newExpenseAmount) }]);
      setNewExpenseLabel("");
      setNewExpenseAmount("");
    }
  };

  const updateExpense = (index: number, amount: number) => {
    const updated = [...expenseCategories];
    updated[index].amount = amount;
    setExpenseCategories(updated);
    setEditingExpense(null);
  };

  const addRedrawEntry = () => {
    if (newRedrawDate && newRedrawAmount && newRedrawReason) {
      const entry: RedrawEntry = {
        date: newRedrawDate,
        amount: parseFloat(newRedrawAmount),
        type: newRedrawType,
        reason: newRedrawReason,
      };
      setReDrawLog([...reDrawLog, entry]);
      setNewRedrawDate("");
      setNewRedrawAmount("");
      setNewRedrawReason("");
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Finances" />
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Monthly Summary */}
          <SectionCard title="Monthly Summary">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard label="Josh Net Income" value={`$${financeSummary.joshNetMonthly}`} />
              <MetricCard label="Rental Income" value={`$${financeSummary.rentalIncome}`} />
              <MetricCard label="Rent Paid" value={`$${financeSummary.rentPaid}`} subtitle="outgoing" color="red" />
              <MetricCard label="Mortgage Payment" value={`$${financeSummary.mortgagePayment}`} subtitle="outgoing" color="red" />
              <MetricCard
                label="Net Position"
                value={`$${netPosition}`}
                subtitle={netPosition >= 0 ? "surplus" : "deficit"}
                color={netPosition >= 0 ? 'green' : 'red'}
              />
            </div>
          </SectionCard>

          {/* Income vs Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Income Sources">
              <div className="space-y-2">
                {incomeSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{source.label}</span>
                    {editingIncome === index ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          defaultValue={source.amount}
                          onBlur={(e) => updateIncome(index, parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <Button size="sm" onClick={() => setEditingIncome(null)}>Save</Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>${source.amount}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingIncome(index)}>Edit</Button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Input
                    placeholder="New income source"
                    value={newIncomeLabel}
                    onChange={(e) => setNewIncomeLabel(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newIncomeAmount}
                    onChange={(e) => setNewIncomeAmount(e.target.value)}
                  />
                  <Button onClick={addIncomeSource}>Add</Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Expense Categories">
              <div className="space-y-2">
                {expenseCategories.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{expense.label}</span>
                    {editingExpense === index ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          defaultValue={expense.amount}
                          onBlur={(e) => updateExpense(index, parseFloat(e.target.value))}
                          className="w-20"
                        />
                        <Button size="sm" onClick={() => setEditingExpense(null)}>Save</Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>${expense.amount}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingExpense(index)}>Edit</Button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Input
                    placeholder="New expense category"
                    value={newExpenseLabel}
                    onChange={(e) => setNewExpenseLabel(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                  />
                  <Button onClick={addExpenseCategory}>Add</Button>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Redraw Tracker */}
          <SectionCard title="Redraw Tracker">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Redraw Available</span>
                  <span>${financeSummary.reDrawAvailable} / $20,000</span>
                </div>
                <Progress value={(financeSummary.reDrawAvailable / 20000) * 100} />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Redraw Log</h4>
                {reDrawLog.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">{entry.date}</span> - {entry.reason}
                    </div>
                    <span className={entry.type === 'drawn' ? 'text-red-600' : 'text-green-600'}>
                      {entry.type === 'drawn' ? '-' : '+'}${entry.amount}
                    </span>
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Input
                    type="date"
                    value={newRedrawDate}
                    onChange={(e) => setNewRedrawDate(e.target.value)}
                  />
                  <select
                    value={newRedrawType}
                    onChange={(e) => setNewRedrawType(e.target.value as 'drawn' | 'deposited')}
                    className="border rounded px-2 py-1"
                  >
                    <option value="drawn">Drawn</option>
                    <option value="deposited">Deposited</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newRedrawAmount}
                    onChange={(e) => setNewRedrawAmount(e.target.value)}
                  />
                  <Input
                    placeholder="Reason"
                    value={newRedrawReason}
                    onChange={(e) => setNewRedrawReason(e.target.value)}
                  />
                  <Button onClick={addRedrawEntry}>Add Entry</Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Property Snapshot Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700">
        <Card>
          <CardHeader>
            <CardTitle>Property Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Address:</strong> {propertySnapshot.address}</div>
            <div><strong>Estimated Value:</strong> ${propertySnapshot.estimatedValue.toLocaleString()}</div>
            <div><strong>Remaining Mortgage:</strong> ${propertySnapshot.remainingMortgage.toLocaleString()}</div>
            <div><strong>Estimated Equity:</strong> ${propertySnapshot.estimatedEquity.toLocaleString()}</div>
            <div><strong>Weekly Rent:</strong> ${propertySnapshot.weeklyRent}</div>
            <div><strong>Rental Yield:</strong> {propertySnapshot.rentalYield}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}