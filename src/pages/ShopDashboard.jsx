import { useState, useEffect, useRef } from "react";
import ReportTable from "../components/ReportTable";
import AppLayout from "../AppLayout";
import BottomNav from "../components/BottomNav";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ShopDashboard() {
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  // Get current date
  useEffect(() => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("en-IN", options));
  }, []);

  // Click outside handler to close settings
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[var(--color-dark)] text-white p-4">
        {/* Top Header with Date and Settings Icon */}
        <div className="flex justify-between items-center mb-6">
          {/* Current Date */}
          <div className="text-sm text-amber-200 bg-[var(--color-dark-light)]  py-2 rounded-lg">
            {currentDate || "Loading..."}
          </div>

          {/* Settings Icon with Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Settings"
            >
              {/* Settings Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Simple Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-full top-0 mr-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 bg-red-400 rounded-xl hover:text-white hover:bg-red-600 text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  {/* Logout Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Reports Header */}
        <div className="mb-2 flex justify-between text-sm text-gray-300">
          <span>Daily Reports</span>
          <span className="text-gray-300]">
            MONTHLY BALANCE ₹ {monthlyBalance}
          </span>
        </div>

        {/* Pass callback */}
        <ReportTable onMonthlyBalance={setMonthlyBalance} />
      </div>
      <BottomNav />
    </AppLayout>
  );
}
