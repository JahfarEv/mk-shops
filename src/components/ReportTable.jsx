// const reports = [
//   { date: "Apr 24, 2024", cash: 6500, market: 3500, card: 2400, expense: 4000 },
//   { date: "Apr 20, 2024", cash: 5200, market: 7900, card: 1300, expense: 2500 },
//   { date: "Apr 19, 2024", cash: 4500, market: 2500, card: 900, expense: 1400 },
// ];

// export default function ReportTable() {
//   return (
//     <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
//       <thead className="bg-white/5">
//         <tr>
//           <th className="p-2 text-left">DATE</th>
//           <th className="p-2 text-right">CASH</th>
//           <th className="p-2 text-right">MARKET</th>
//           <th className="p-2 text-right">CARD</th>
//           <th className="p-2 text-right">EXPENSE</th>
//         </tr>
//       </thead>
//       <tbody>
//         {reports.map((r, i) => (
//           <tr key={i} className="border-t border-white/10">
//             <td className="p-2">{r.date}</td>
//             <td className="p-2 text-right">₹{r.cash}</td>
//             <td className="p-2 text-right">₹{r.market}</td>
//             <td className="p-2 text-right">₹{r.card}</td>
//             <td className="p-2 text-right">₹{r.expense}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// import { useEffect, useState } from "react";
// import { ref, get } from "firebase/database";
// import { auth, rtdb } from "../firebase";

// export default function ReportTable() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH REPORTS ================= */
//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!auth.currentUser) {
//         setReports([]);
//         setLoading(false);
//         return;
//       }

//       try {
//         const uid = auth.currentUser.uid;
//         const snapshot = await get(ref(rtdb, `dailyAccounts/${uid}`));

//         if (!snapshot.exists()) {
//           setReports([]);
//           return;
//         }

//         const data = snapshot.val();

//         // Convert object → array
//         const rows = Object.keys(data).map((date) => ({
//           date,
//           cash: data[date].cash || 0,
//           market: data[date].market || 0,
//           card: data[date].card || 0,
//           expense: data[date].expense || 0,
//         }));

//         // Sort by date (latest first)
//         rows.sort((a, b) => new Date(b.date) - new Date(a.date));

//         setReports(rows);
//       } catch (error) {
//         console.error("Report fetch error:", error);
//         setReports([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         Loading reports...
//       </div>
//     );
//   }

//   /* ================= EMPTY ================= */
//   if (!reports.length) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         No records found
//       </div>
//     );
//   }

//   return (
//     <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
//       <thead className="bg-white/5">
//         <tr>
//           <th className="p-2 text-left">DATE</th>
//           <th className="p-2 text-right">CASH</th>
//           <th className="p-2 text-right">MARKET</th>
//           <th className="p-2 text-right">CARD</th>
//           <th className="p-2 text-right">EXPENSE</th>
//         </tr>
//       </thead>
//       <tbody>
//         {reports.map((r, i) => (
//           <tr key={i} className="border-t border-white/10">
//             <td className="p-2">{r.date}</td>
//             <td className="p-2 text-right">₹{r.cash}</td>
//             <td className="p-2 text-right">₹{r.market}</td>
//             <td className="p-2 text-right">₹{r.card}</td>
//             <td className="p-2 text-right">₹{r.expense}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// import { useEffect, useState } from "react";
// import { ref, get, set } from "firebase/database";
// import { auth, rtdb } from "../firebase";

// export default function ReportTable({ onMonthlyBalance }) {
//   const [reports, setReports] = useState([]);
//   const [openingBalance, setOpeningBalance] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!auth.currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const uid = auth.currentUser.uid;
//         const snapshot = await get(ref(rtdb, `dailyAccounts/${uid}`));

//         if (!snapshot.exists()) {
//           setReports([]);
//           setOpeningBalance(0);
//           return;
//         }

//         const data = snapshot.val();

//         /* OPENING BALANCE */
//         setOpeningBalance(Number(data.openingBalance) || 0);
//         delete data.openingBalance;

//         /* DAILY ROWS */
//         const rows = Object.keys(data).map((date) => ({
//           date,
//           cash: Number(data[date].cash) || 0,
//           market: Number(data[date].market) || 0,
//           card: Number(data[date].card) || 0,
//           expense: Number(data[date].expense) || 0,
//         }));

//         rows.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setReports(rows);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setReports([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   /* ================= SAVE OPENING BALANCE ================= */
//   const saveOpeningBalance = async () => {
//     if (!auth.currentUser) return;

//     try {
//       setSaving(true);
//       const uid = auth.currentUser.uid;

//       await set(
//         ref(rtdb, `dailyAccounts/${uid}/openingBalance`),
//         Number(openingBalance)
//       );
//     } catch (error) {
//       console.error("Save error:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= TOTALS ================= */
//   const totals = reports.reduce(
//     (acc, r) => {
//       acc.cash += r.cash;
//       acc.market += r.market;
//       acc.card += r.card;
//       acc.expense += r.expense;
//       return acc;
//     },
//     { cash: 0, market: 0, card: 0, expense: 0 }
//   );

//   /* ================= MONTHLY BALANCE FORMULA ================= */
//   const monthlyBalance =
//     Number(openingBalance) +
//     totals.cash +
//     totals.card -
//     totals.market;
// console.log(monthlyBalance, 'monthly');

//     /* ================= MONTHLY SALES FORMULA ================= */
//   const monthlySales =
//     totals.cash +
//     totals.card +
//     totals.expense;

//   /* ================= SEND TO DASHBOARD ================= */
//   useEffect(() => {
//     if (onMonthlyBalance) {
//       onMonthlyBalance(monthlyBalance);
//     }
//   }, [monthlyBalance, onMonthlyBalance]);

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         Loading reports...
//       </div>
//     );
//   }

//   /* ================= EMPTY ================= */
//   if (!reports.length) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         No records found
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* OPENING BALANCE */}
//       <div className="flex items-center justify-between mb-3 bg-white/5 p-3 rounded-lg">
//         <span className="text-sm text-gray-300">Opening Balance</span>

//         <div className="flex gap-2">
//           <input
//             type="number"
//             value={openingBalance}
//             onChange={(e) =>
//               setOpeningBalance(Number(e.target.value))
//             }
//             className="w-28 bg-black/40 border border-white/10 rounded px-2 py-1 text-right"
//           />

//           <button
//             onClick={saveOpeningBalance}
//             disabled={saving}
//             className="text-xs bg-[var(--color-gold)] text-black px-3 rounded"
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>

//       {/* REPORT TABLE */}
//       <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
//         <thead className="bg-white/5">
//           <tr>
//             <th className="p-2 text-left">DATE</th>
//             <th className="p-2 text-right">CASH</th>
//             <th className="p-2 text-right">MARKET</th>
//             <th className="p-2 text-right">CARD</th>
//             <th className="p-2 text-right">EXPENSE</th>
//           </tr>
//         </thead>

//         <tbody>
//           {reports.map((r, i) => (
//             <tr key={i} className="border-t border-white/10">
//               <td className="p-2">{r.date}</td>
//               <td className="p-2 text-right">₹{r.cash}</td>
//               <td className="p-2 text-right">₹{r.market}</td>
//               <td className="p-2 text-right">₹{r.card}</td>
//               <td className="p-2 text-right">₹{r.expense}</td>
//             </tr>
//           ))}
//         </tbody>

//         {/* TOTALS */}
//         <tfoot className="bg-white/10 font-semibold">
//           <tr>
//             <td className="p-2">TOTAL</td>
//             <td className="p-2 text-right">₹{totals.cash}</td>
//             <td className="p-2 text-right">₹{totals.market}</td>
//             <td className="p-2 text-right">₹{totals.card}</td>
//             <td className="p-2 text-right">₹{totals.expense}</td>
//           </tr>

//           <tr className="bg-[var(--color-gold)] text-black">
//             <td colSpan="4" className="p-2 text-right">
//               MONTHLY SALES
//             </td>
//             <td className="p-2 text-right">
//               ₹{monthlySales}
//             </td>
//           </tr>
//         </tfoot>
//       </table>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import { ref, get } from "firebase/database";
// import { auth, rtdb } from "../firebase";

// export default function ReportTable({ onMonthlyBalance }) {
//   const [reports, setReports] = useState([]);
//   const [openingBalance, setOpeningBalance] = useState(0);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!auth.currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const uid = auth.currentUser.uid;
//         const snapshot = await get(ref(rtdb, `dailyAccounts/${uid}`));

//         if (!snapshot.exists()) {
//           setReports([]);
//           setOpeningBalance(0);
//           return;
//         }

//         const data = snapshot.val();

//         /* OPENING BALANCE (READ ONLY) */
//         setOpeningBalance(Number(data.openingBalance) || 0);
//         delete data.openingBalance;

//         /* DAILY ROWS */
//         const rows = Object.keys(data).map((date) => ({
//           date,
//           cash: Number(data[date].cash) || 0,
//           market: Number(data[date].market) || 0,
//           card: Number(data[date].card) || 0,
//           expense: Number(data[date].expense) || 0,
//         }));

//         rows.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setReports(rows);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setReports([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   /* ================= TOTALS ================= */
//   const totals = reports.reduce(
//     (acc, r) => {
//       acc.cash += r.cash;
//       acc.market += r.market;
//       acc.card += r.card;
//       acc.expense += r.expense;
//       acc.dailyTotal += r.cash + r.card;
//       return acc;
//     },
//     { cash: 0, market: 0, card: 0, expense: 0, dailyTotal: 0 }
//   );

//   /* ================= MONTHLY BALANCE ================= */
//   const monthlyBalance =
//     openingBalance + totals.cash + totals.card - totals.market;

//   /* ================= SEND TO DASHBOARD ================= */
//   useEffect(() => {
//     if (onMonthlyBalance) {
//       onMonthlyBalance(monthlyBalance);
//     }
//   }, [monthlyBalance, onMonthlyBalance]);

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         Loading reports...
//       </div>
//     );
//   }

//   /* ================= EMPTY ================= */
//   if (!reports.length) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         No records found
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* OPENING BALANCE (DISPLAY ONLY) */}
//       <div className="mb-3 bg-white/5 p-3 rounded-lg flex justify-between">
//         <span className="text-sm text-gray-300">
//           Opening Balance
//         </span>
//         <span className="font-semibold">
//           ₹{openingBalance}
//         </span>
//       </div>

//       {/* REPORT TABLE */}
//       <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
//         <thead className="bg-white/5">
//           <tr>
//             <th className="p-2 text-left">DATE</th>
//             <th className="p-2 text-right">CASH</th>
//             <th className="p-2 text-right">MARKET</th>
//             <th className="p-2 text-right">CARD</th>
//             <th className="p-2 text-right">EXPENSE</th>
//             <th className="p-2 text-right">DAILY TOTAL</th>
//           </tr>
//         </thead>

//         <tbody>
//           {reports.map((r, i) => {
//             const dailyTotal = r.cash + r.card;

//             return (
//               <tr key={i} className="border-t border-white/10">
//                 <td className="p-2">{r.date}</td>
//                 <td className="p-2 text-right">₹{r.cash}</td>
//                 <td className="p-2 text-right">₹{r.market}</td>
//                 <td className="p-2 text-right">₹{r.card}</td>
//                 <td className="p-2 text-right">₹{r.expense}</td>
//                 <td className="p-2 text-right font-semibold">
//                   ₹{dailyTotal}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>

//         {/* COLUMN TOTALS */}
//         <tfoot className="bg-white/10 font-semibold">
//           <tr>
//             <td className="p-2">TOTAL</td>
//             <td className="p-2 text-right">₹{totals.cash}</td>
//             <td className="p-2 text-right">₹{totals.market}</td>
//             <td className="p-2 text-right">₹{totals.card}</td>
//             <td className="p-2 text-right">₹{totals.expense}</td>
//             <td className="p-2 text-right">₹{totals.dailyTotal}</td>
//           </tr>

//           <tr className="bg-[var(--color-gold)] text-black">
//             <td colSpan="5" className="p-2 text-right">
//               MONTHLY BALANCE
//             </td>
//             <td className="p-2 text-right">
//               ₹{monthlyBalance}
//             </td>
//           </tr>
//         </tfoot>
//       </table>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import { ref, get } from "firebase/database";
// import { auth, rtdb } from "../firebase";

// export default function ReportTable({ onMonthlyBalance }) {
//   const [reports, setReports] = useState([]);
//   const [openingBalance, setOpeningBalance] = useState(0);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH CURRENT MONTH DATA ================= */
//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!auth.currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const uid = auth.currentUser.uid;

//         // ✅ CURRENT MONTH KEY (YYYY-MM)
//         const currentMonth = new Date().toISOString().slice(0, 7);

//         const baseRef = ref(rtdb, `dailyAccounts/${uid}`);
//         const snapshot = await get(baseRef);

//         if (!snapshot.exists()) {
//           setReports([]);
//           setOpeningBalance(0);
//           return;
//         }

//         const data = snapshot.val();

//         /* 🔹 OPENING BALANCE (GLOBAL, READ ONLY) */
//         setOpeningBalance(Number(data.openingBalance) || 0);

//         /* 🔹 ONLY CURRENT MONTH DATA */
//         if (!data[currentMonth]) {
//           setReports([]);
//           return;
//         }

//         const monthData = data[currentMonth];

//         const rows = Object.keys(monthData).map((date) => ({
//           date,
//           cash: Number(monthData[date].cash) || 0,
//           market: Number(monthData[date].market) || 0,
//           card: Number(monthData[date].card) || 0,
//           expense: Number(monthData[date].expense) || 0,
//         }));

//         rows.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setReports(rows);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setReports([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   /* ================= TOTALS ================= */
//   const totals = reports.reduce(
//     (acc, r) => {
//       acc.cash += r.cash;
//       acc.market += r.market;
//       acc.card += r.card;
//       acc.expense += r.expense;
//       acc.dailyTotal += r.cash + r.card;
//       return acc;
//     },
//     { cash: 0, market: 0, card: 0, expense: 0, dailyTotal: 0 }
//   );

//   /* ================= MONTHLY BALANCE ================= */
//   const monthlyBalance =
//     openingBalance + totals.cash + totals.card - totals.market;

//   /* ================= SEND TO DASHBOARD ================= */
//   useEffect(() => {
//     if (onMonthlyBalance) {
//       onMonthlyBalance(monthlyBalance);
//     }
//   }, [monthlyBalance, onMonthlyBalance]);

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         Loading reports...
//       </div>
//     );
//   }

//   /* ================= EMPTY ================= */
//   if (!reports.length) {
//     return (
//       <div className="text-center text-gray-400 py-6">
//         No records found for this month
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* OPENING BALANCE (DISPLAY ONLY) */}
//       <div className="mb-3 bg-white/5 p-3 rounded-lg flex justify-between">
//         <span className="text-sm text-gray-300">
//           Opening Balance
//         </span>
//         <span className="font-semibold">
//           ₹{openingBalance}
//         </span>
//       </div>

//       {/* REPORT TABLE */}
//       <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
//         <thead className="bg-white/5">
//           <tr>
//             <th className="p-2 text-left">DATE</th>
//             <th className="p-2 text-right">CASH</th>
//             <th className="p-2 text-right">MARKET</th>
//             <th className="p-2 text-right">CARD</th>
//             <th className="p-2 text-right">EXPENSE</th>
//             <th className="p-2 text-right">DAILY TOTAL</th>
//           </tr>
//         </thead>

//         <tbody>
//           {reports.map((r, i) => {
//             const dailyTotal = r.cash + r.card;

//             return (
//               <tr key={i} className="border-t border-white/10">
//                 <td className="p-2">{r.date}</td>
//                 <td className="p-2 text-right">₹{r.cash}</td>
//                 <td className="p-2 text-right">₹{r.market}</td>
//                 <td className="p-2 text-right">₹{r.card}</td>
//                 <td className="p-2 text-right">₹{r.expense}</td>
//                 <td className="p-2 text-right font-semibold">
//                   ₹{dailyTotal}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>

//         {/* COLUMN TOTALS */}
//         <tfoot className="bg-white/10 font-semibold">
//           <tr>
//             <td className="p-2">TOTAL</td>
//             <td className="p-2 text-right">₹{totals.cash}</td>
//             <td className="p-2 text-right">₹{totals.market}</td>
//             <td className="p-2 text-right">₹{totals.card}</td>
//             <td className="p-2 text-right">₹{totals.expense}</td>
//             <td className="p-2 text-right">₹{totals.dailyTotal}</td>
//           </tr>

//           <tr className="bg-[var(--color-gold)] text-black">
//             <td colSpan="5" className="p-2 text-right">
//               MONTHLY BALANCE
//             </td>
//             <td className="p-2 text-right">
//               ₹{monthlyBalance}
//             </td>
//           </tr>
//         </tfoot>
//       </table>
//     </>
//   );
// }

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
