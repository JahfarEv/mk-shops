// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ShopLogin from "./pages/ShopLogin";
// import ShopDashboard from "./pages/ShopDashboard";
// import TodayAccount from "./pages/TodayAccount";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<ShopLogin />} />
//         <Route path="/dashboard" element={<ShopDashboard />} />
//         <Route path="/today" element={<TodayAccount />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



// import { HashRouter, Routes, Route } from "react-router-dom";
// import ShopLogin from "./pages/ShopLogin";
// import ShopDashboard from "./pages/ShopDashboard";
// import TodayAccount from "./pages/TodayAccount";

// export default function App() {
//   return (
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<ShopLogin />} />
//         <Route path="/dashboard" element={<ShopDashboard />} />
//         <Route path="/today" element={<TodayAccount />} />
//       </Routes>
//     </HashRouter>
//   );
// }



import { HashRouter, Routes, Route } from "react-router-dom";
import ShopLogin from "./pages/ShopLogin";
import ShopDashboard from "./pages/ShopDashboard";
import TodayAccount from "./pages/TodayAccount";
import ShopProtectedRoute from "./components/ShopProtectedRoute";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 🔓 PUBLIC */}
        <Route path="/" element={<ShopLogin />} />

        {/* 🔐 PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ShopProtectedRoute>
              <ShopDashboard />
            </ShopProtectedRoute>
          }
        />

        <Route
          path="/today"
          element={
            <ShopProtectedRoute>
              <TodayAccount />
            </ShopProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
