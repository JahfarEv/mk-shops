// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { ref, get } from "firebase/database";
// import { auth, rtdb } from "../firebase";
// import AppLayout from "../AppLayout";

// export default function ShopLogin() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= SHOP LOGIN ================= */
//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Please enter email and password");
//       return;
//     }

//     try {
//       setLoading(true);

//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email.trim(),
//         password,
//       );

//       const uid = userCredential.user.uid;

//       const snapshot = await get(ref(rtdb, "shops/" + uid));

//       if (!snapshot.exists()) {
//         alert("This account is not registered as a shop");
//         return;
//       }

//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error.code);

//       if (error.code === "auth/user-not-found") {
//         alert("Shop account not found");
//       } else if (error.code === "auth/wrong-password") {
//         alert("Incorrect password");
//       } else if (error.code === "auth/invalid-email") {
//         alert("Invalid email");
//       } else {
//         alert(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center px-4 text-white">
//         <div className="w-full max-w-sm bg-[var(--color-panel)] p-6 rounded-2xl border border-white/10">
//           <h1 className="text-3xl text-center text-[var(--color-gold)] font-serif mb-2">
//             MK MENS WEAR
//           </h1>
//           <p className="text-center text-gray-400 mb-6">Shop Login</p>

//           <input
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mb-4 px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-[var(--color-gold)] outline-none"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full mb-6 px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-[var(--color-gold)] outline-none"
//           />

//           <button
//             disabled={loading}
//             onClick={handleLogin}
//             className="w-full bg-[var(--color-gold)] text-black py-3 rounded-lg font-semibold disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "LOGIN"}
//           </button>

//           {/* <p className="text-center text-sm mt-4 text-gray-400">
//           Forgot Password?
//         </p> */}
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, rtdb } from "../firebase";
import AppLayout from "../AppLayout";

export default function ShopLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ NEW

  /* ================= INITIAL AUTH CHECK ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false); // ❌ Not logged in → show login
        return;
      }

      const snapshot = await get(ref(rtdb, "shops/" + user.uid));

      // ❌ Logged in but not shop
      if (!snapshot.exists()) {
        await signOut(auth);
        setCheckingAuth(false);
        return;
      }

      // ✅ Logged in shop → dashboard
      navigate("/dashboard", { replace: true });
    });

    return () => unsubscribe();
  }, [navigate]);

  /* ================= SHOP LOGIN ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const snapshot = await get(ref(rtdb, "shops/" + res.user.uid));

      if (!snapshot.exists()) {
        alert("This account is not registered as a shop");
        await signOut(auth);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADER WHILE CHECKING AUTH ================= */
  if (checkingAuth) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark)] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-gold)] mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">Checking session...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* ================= LOGIN UI ================= */
  return (
    <AppLayout>
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center px-4 text-white">
        <div className="w-full max-w-sm bg-[var(--color-panel)] p-6 rounded-2xl border border-white/10">
          <h1 className="text-3xl text-center text-[var(--color-gold)] font-serif mb-2">
            MK MENS WEAR
          </h1>
          <p className="text-center text-gray-400 mb-6">Shop Login</p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-[var(--color-gold)] outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-[var(--color-gold)] outline-none"
          />

          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-[var(--color-gold)] text-black py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
