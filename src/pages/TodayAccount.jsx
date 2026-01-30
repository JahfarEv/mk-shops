import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ref, set, get } from "firebase/database";
import { auth, rtdb } from "../firebase";
import AppLayout from "../AppLayout";

export default function TodayAccount() {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cash, setCash] = useState("");
  const [market, setMarket] = useState("");
  const [card, setCard] = useState("");
  const [expense, setExpense] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT TODAY ACCOUNT ================= */
  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("Please login again");
      return;
    }

    try {
      setLoading(true);

      const uid = auth.currentUser.uid;

      // ✅ MONTH KEY (YYYY-MM)
      const monthKey = date.slice(0, 7);

      // ✅ DATE PATH INSIDE MONTH
      const entryRef = ref(rtdb, `dailyAccounts/${uid}/${monthKey}/${date}`);

      // ❌ PREVENT DUPLICATE DATE IN SAME MONTH
      const snapshot = await get(entryRef);
      if (snapshot.exists()) {
        alert("❌ Entry already exists for this date in this month");
        return;
      }

      // ✅ SAVE DATA
      await set(entryRef, {
        cash: Number(cash || 0),
        market: Number(market || 0),
        card: Number(card || 0),
        expense: Number(expense || 0),
        createdAt: Date.now(),
      });

      alert("✅ Today account saved");
      navigate(-1);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col">
        {/* HEADER */}
        <div
          className="flex items-center gap-3 p-4 border-b border-white/10"
          onClick={() => navigate(-1)}
        >
          <h2 className="text-lg font-semibold">← Home</h2>
        </div>

        {/* FORM */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md space-y-4 bg-[var(--color-panel)] p-4 rounded-xl border border-white/10">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-2 rounded-lg"
            />

            <input
              placeholder="Cash"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-2 rounded-lg"
            />

            <input
              placeholder="Market"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-2 rounded-lg"
            />

            <input
              placeholder="Card"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-2 rounded-lg"
            />

            <input
              placeholder="Expense"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-2 rounded-lg"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 border border-white/30 py-2 rounded-lg"
              >
                CANCEL
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 bg-[var(--color-gold)] text-black py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
