import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { auth, rtdb } from "../firebase";

export default function ReportTable({ onMonthlyBalance }) {
  const [reports, setReports] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CURRENT MONTH DATA ================= */
  useEffect(() => {
    const fetchReports = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const uid = auth.currentUser.uid;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const baseRef = ref(rtdb, `dailyAccounts/${uid}`);
        const snapshot = await get(baseRef);

        if (!snapshot.exists()) {
          setReports([]);
          setOpeningBalance(0);
          return;
        }

        const data = snapshot.val();
        setOpeningBalance(Number(data.openingBalance) || 0);

        if (!data[currentMonth]) {
          setReports([]);
          return;
        }

        const monthData = data[currentMonth];
        const rows = Object.keys(monthData).map((date) => ({
          date,
          cash: Number(monthData[date].cash) || 0,
          market: Number(monthData[date].market) || 0,
          card: Number(monthData[date].card) || 0,
          expense: Number(monthData[date].expense) || 0,
        }));

        rows.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(rows);
      } catch (error) {
        console.error("Fetch error:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  /* ================= CALCULATE TOTALS ================= */
  const totals = reports.reduce(
    (acc, r) => {
      acc.cash += r.cash;
      acc.market += r.market;
      acc.card += r.card;
      acc.expense += r.expense;
      acc.dailyTotal += r.cash + r.card;
      return acc;
    },
    { cash: 0, market: 0, card: 0, expense: 0, dailyTotal: 0 },
  );

  const monthlyBalance =
    openingBalance + totals.cash + totals.card - totals.market;

  /* ================= SEND TO DASHBOARD ================= */
  useEffect(() => {
    if (onMonthlyBalance) {
      onMonthlyBalance(monthlyBalance);
    }
  }, [monthlyBalance, onMonthlyBalance]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-gold)] mx-auto mb-2"></div>
        Loading reports...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!reports.length) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">📊</div>
        <p className="text-gray-400 mb-4">No records found for this month</p>
        <button className="text-[var(--color-gold)] border border-[var(--color-gold)]/30 rounded-lg px-4 py-2 text-sm">
          Add First Record
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* OPENING BALANCE CARD */}
      <div className="mb-4 bg-[var(--color-panel)] border border-white/10 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-300">Opening Balance</p>
          </div>
          <span className="text-xl font-bold text-[var(--color-gold)]">
            ₹{openingBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* TABLE CONTAINER WITH HORIZONTAL SCROLL */}
      <div className="bg-[var(--color-panel)] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full text-sm">
              {/* TABLE HEADER */}
              <thead className="bg-white/5">
                <tr className="text-xs">
                  <th className="p-3 text-left font-medium text-gray-300">
                    DATE
                  </th>
                  <th className="p-3 text-right font-medium text-gray-300">
                    CASH
                  </th>
                  <th className="p-3 text-right font-medium text-gray-300">
                    MARKET
                  </th>
                  <th className="p-3 text-right font-medium text-gray-300">
                    CARD
                  </th>
                  <th className="p-3 text-right font-medium text-gray-300">
                    EXPENSE
                  </th>
                  <th className="p-3 text-right font-medium text-gray-300">
                    DAILY TOTAL
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-white/10">
                {reports.map((r, i) => {
                  const dailyTotal = r.cash + r.card;
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-medium">{r.date}</div>
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-medium ${r.cash > 0 ? "text-green-400" : "text-gray-400"}`}
                        >
                          ₹{r.cash.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-medium ${r.market > 0 ? "text-amber-400" : "text-gray-400"}`}
                        >
                          ₹{r.market.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-medium ${r.card > 0 ? "text-blue-400" : "text-gray-400"}`}
                        >
                          ₹{r.card.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-medium ${r.expense > 0 ? "text-red-400" : "text-gray-400"}`}
                        >
                          ₹{r.expense.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-[var(--color-gold)]">
                          ₹{dailyTotal.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* COLUMN TOTALS SECTION */}
              <tfoot>
                {/* SEPARATOR */}
                <tr>
                  <td colSpan="6" className="border-t border-white/20"></td>
                </tr>

                {/* TOTALS ROW */}
                <tr className="bg-white/10">
                  <td className="p-3 font-bold">TOTALS</td>
                  <td className="p-3 text-right">
                    <div className="font-bold text-green-400">
                      ₹{totals.cash.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Cash Total</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-bold text-amber-400">
                      ₹{totals.market.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Market Total
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-bold text-blue-400">
                      ₹{totals.card.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Card Total</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-bold text-red-400">
                      ₹{totals.expense.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Expense Total
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-bold text-[var(--color-gold)]">
                      ₹{totals.dailyTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Daily Total
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* MONTHLY BALANCE BANNER */}
        <div className="bg-[var(--color-gold)] text-black p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">MONTHLY BALANCE</p>
            </div>
            <span className="text-2xl font-black">
              ₹{monthlyBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
