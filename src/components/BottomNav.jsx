import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tab = (path) =>
    `flex-1 text-center py-2 ${
      pathname === path ? "text-[var(--color-gold)]" : "text-gray-400"
    }`;

  return (
    <div className="fixed bottom-0 w-full max-w-[430px] bg-black border-t border-white/10 flex pb-[env(safe-area-inset-bottom)]">
      <button onClick={() => navigate("/dashboard")} className={tab("/dashboard")}>
        📊<br />Reports
      </button>
      <button onClick={() => navigate("/today")} className={tab("/today")}>
        💰<br />New
      </button>
    </div>
  );
}
