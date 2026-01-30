// import { useNavigate } from "react-router-dom";
// import ReportTable from "../components/ReportTable";

// export default function ShopDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[var(--color-dark)] text-white p-4">

//       <h2 className="text-center text-lg text-[var(--color-gold)] mb-4">
//         MK FASHION SHOP
//       </h2>

//       {/* Buttons */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <button className="bg-[var(--color-panel)] border border-[var(--color-gold)]/40 rounded-xl p-4">
//           📊 Reports
//         </button>

//         <button
//           onClick={() => navigate("/today")}
//           className="bg-[var(--color-panel)] border border-[var(--color-gold)]/40 rounded-xl p-4"
//         >
//           💰 Today’s Accounts
//         </button>
//       </div>

//       {/* Daily Reports */}
//       <div className="mb-2 flex justify-between text-sm text-gray-300">
//         <span>Daily Reports</span>
//         <span className="text-[var(--color-gold)]">TOTAL CASH ₹18,000</span>
//       </div>

//       <ReportTable />
//     </div>
//   );
// }










// import { useNavigate, useLocation } from "react-router-dom";
// import ReportTable from "../components/ReportTable";

// export default function ShopDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // helper to check active route
//   const isActive = (path) => location.pathname === path;

//   const baseBtn =
//     "border rounded-xl p-4 transition-all duration-200";

//   const activeBtn =
//     "bg-[var(--color-gold)] text-black border-[var(--color-gold)]";

//   const inactiveBtn =
//     "bg-[var(--color-panel)] text-white border-[var(--color-gold)]/40";

//   return (
//     <div className="min-h-screen bg-[var(--color-dark)] text-white p-4">

//       <h2 className="text-center text-lg text-[var(--color-gold)] mb-4">
//         MK FASHION SHOP
//       </h2>

//       {/* Buttons */}
//       <div className="grid grid-cols-2 gap-4 mb-6">

//         {/* Reports */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           className={`${baseBtn} ${
//             isActive("/dashboard") ? activeBtn : inactiveBtn
//           }`}
//         >
//           📊 Reports
//         </button>

//         {/* Today Accounts */}
//         <button
//           onClick={() => navigate("/today")}
//           className={`${baseBtn} ${
//             isActive("/today") ? activeBtn : inactiveBtn
//           }`}
//         >
//           💰 Today’s Accounts
//         </button>

//       </div>

//       {/* Daily Reports */}
//       <div className="mb-2 flex justify-between text-sm text-gray-300">
//         <span>Daily Reports</span>
//         <span className="text-[var(--color-gold)]">TOTAL CASH ₹18,000</span>
//       </div>

//       <ReportTable />
//     </div>
//   );
// }



import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ReportTable from "../components/ReportTable";
import AppLayout from "../AppLayout";
import BottomNav from "../components/BottomNav";

export default function ShopDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [monthlyBalance, setMonthlyBalance] = useState(0);

  const isActive = (path) => location.pathname === path;

  const baseBtn =
    "border rounded-xl p-4 transition-all duration-200";

  const activeBtn =
    "bg-[var(--color-gold)] text-black border-[var(--color-gold)]";

  const inactiveBtn =
    "bg-[var(--color-panel)] text-white border-[var(--color-gold)]/40";
console.log(monthlyBalance,'bala');

  return (
    <AppLayout>
    <div className="min-h-screen bg-[var(--color-dark)] text-white p-4">

      <h2 className="text-center text-lg text-[var(--color-gold)] mb-4">
        MK Mens Wear
      </h2>

      {/* Buttons */}
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className={`${baseBtn} ${
            isActive("/dashboard") ? activeBtn : inactiveBtn
          }`}
        >
          📊 Reports
        </button>

        <button
          onClick={() => navigate("/today")}
          className={`${baseBtn} ${
            isActive("/today") ? activeBtn : inactiveBtn
          }`}
        >
          💰 Today’s Accounts
        </button>
      </div> */}

      {/* Daily Reports Header */}
      <div className="mb-2 flex justify-between text-sm text-gray-300">
        <span>Daily Reports</span>
        <span className="text-[var(--color-gold)]">
          MONTHLY BALANCE ₹{monthlyBalance}
        </span>
      </div>

      {/* Pass callback */}
      <ReportTable onMonthlyBalance={setMonthlyBalance} />
    </div>
    <BottomNav/>
    </AppLayout>
  );
}
