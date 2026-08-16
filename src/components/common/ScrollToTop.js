import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mount this ONCE, inside your <BrowserRouter> (or <Router>), above/alongside
// your <Routes>. It has no visible output — it just watches the current
// pathname and scrolls the window to the top on every route change, so every
// existing <Link> or navigate("/...") call across the site starts scrolling
// to top with zero changes needed anywhere else.
//
// Usage in your root App.js:
//
//   import { BrowserRouter } from "react-router-dom";
//   import ScrollToTop from "./components/common/ScrollToTop";
//
//   function App() {
//     return (
//       <BrowserRouter>
//         <ScrollToTop />
//         <Routes>
//           ...
//         </Routes>
//       </BrowserRouter>
//     );
//   }
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}