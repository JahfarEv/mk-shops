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



import { HashRouter, Routes, Route } from "react-router-dom";
import ShopLogin from "./pages/ShopLogin";
import ShopDashboard from "./pages/ShopDashboard";
import TodayAccount from "./pages/TodayAccount";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ShopLogin />} />
        <Route path="/dashboard" element={<ShopDashboard />} />
        <Route path="/today" element={<TodayAccount />} />
      </Routes>
    </HashRouter>
  );
}
