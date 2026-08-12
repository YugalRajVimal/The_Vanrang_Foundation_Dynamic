
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaTree,
  FaImages,
  FaUsers,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaHeart,
  FaClipboardList, // new icon for Internship
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Color definitions for icon backgrounds (using CSS vars)
const iconBgMap = [
  "bg-primary/10 text-primary",        // Home
  "bg-secondary/10 text-secondary",    // About
  "bg-accent/10 text-accent-dark",     // Plantation Drives
  "bg-orange-200 text-secondary",      // Gallery (closer to secondary)
  "bg-yellow-100 text-accent-dark",    // Team
  "bg-yellow-100 text-accent-dark",    // Contact / Volunteer
  "bg-pink-100 text-primary",          // Donate (new color, optional)
];

const navLinks = [
  { name: "Home", to: "/", icon: FaHome },
  { name: "About", to: "/about", icon: FaInfoCircle },
  { name: "Plantation Drives", to: "/plantation-drives", icon: FaTree },
  { name: "Gallery", to: "/gallery", icon: FaImages },
  { name: "Team", to: "/team", icon: FaUserFriends },
  { name: "Causes", to: "/causes", icon: FaTree },
  { name: "Certifications", to: "/certifications", icon: FaUsers },
  { name: "Contact / Volunteer", to: "/contact", icon: FaUsers },
  // { name: "Donate", to: "/donate", icon: FaHeart },
  { name: "Internship", to: "/internship-form", icon: FaClipboardList }, // NEW LINK
];

const DONATE_URL = "/donate";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [isAtTop, setIsAtTop] = useState(true);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const accountHref = isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login";
  const accountLabel = isAuthenticated ? (isAdmin ? "" : user?.name?.split(" ")[0] || "") : "Login";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 0) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For active states
  const activeLink =
    "border-b-2 border-primary text-primary font-semibold";
  const navLink =
    "hover:text-primary transition-colors duration-150 text-text-secondary px-1 pb-1";
  const donateBtn =
    "hidden lg:block bg-primary text-white hover:bg-primary-dark transition-colors duration-150 px-6 py-2 rounded-lg font-semibold shadow-md focus:ring-2 focus:ring-primary-dark focus:outline-none";
  const menuBtn =
    "lg:hidden text-primary hover:text-primary-dark focus:outline-none";
  // Mobile nav item
  const sideNavItem = (idx, path) =>
    `flex items-center gap-4 group ${location.pathname === path
      ? "text-primary font-semibold"
      : "text-text-secondary"
    }`;

  // For extra mobile nav bottom icon
  const internshipNavIdx = navLinks.findIndex(
    (l) => l.to === "/internship-form"
  );
  const internshipIcon = navLinks[internshipNavIdx]?.icon || FaClipboardList;

  return (
    <>
      {/* -- GLOBAL THEME -- */}
      {/* This should ideally go to index.css or App.js, but included for reference */}
      <style>{`
        :root {
          --primary: #E76F51;
          --primary-dark: #bf4a2a;
          --secondary: #F4A261;
          --secondary-dark: #cc7b32;
          --accent: #E9C46A;
          --accent-dark: #b68a27;
          --bg: #FDF6EC;
          --surface: #FFFFFF;
          --text-primary: #2D2D2D;
          --text-secondary: #6B6B6B;
        }
        .bg-primary { background-color: var(--primary) !important; }
        .bg-primary-dark { background-color: var(--primary-dark) !important; }
        .bg-secondary { background-color: var(--secondary) !important; }
        .bg-secondary-dark { background-color: var(--secondary-dark) !important; }
        .bg-accent { background-color: var(--accent) !important; }
        .bg-accent-dark { background-color: var(--accent-dark) !important; }
        .bg-bg { background-color: var(--bg) !important; }
        .bg-surface { background-color: var(--surface) !important; }
        .text-primary { color: var(--primary) !important; }
        .text-primary-dark { color: var(--primary-dark) !important; }
        .text-secondary { color: var(--secondary) !important; }
        .text-accent { color: var(--accent) !important; }
        .text-accent-dark { color: var(--accent-dark) !important; }
        .text-text-primary { color: var(--text-primary) !important; }
        .text-text-secondary { color: var(--text-secondary) !important; }
        .border-primary { border-color: var(--primary) !important; }
        .border-secondary { border-color: var(--secondary) !important; }
        .shadow-theme {
          box-shadow: 0 2px 12px 0 rgba(231, 111, 81, 0.08), 0 1.5px 5px 0 rgba(44, 34, 26, 0.03);
        }
        .bg-pink-100 { background-color: #fce7ef !important; }
      `}</style>

      {/* TOP NAVBAR */}
      <nav
        className={
          `fixed top-0 left-0 right-0 z-50 ` +
          "w-full flex justify-center py-3 bg-transparent"
        }
        style={isAtTop ? { margin: 0, padding: 0 } : undefined}
        aria-label="Main navigation"
      >
        <div
          className={
            isAtTop
              ? "bg-surface w-full rounded-none shadow-theme px-5 py-3 flex items-center justify-between"
              : "w-[95%] rounded-full md:rounded shadow-theme px-5 py-3 flex items-center justify-between backdrop-blur-md bg-surface/70"
          }
          style={
            isAtTop
              ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
              : {
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                }
          }
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              className="h-12"
              style={{ borderRadius: 6, background: "var(--bg)" }}
              alt="Vanrang Foundation Logo"
            />
            {/* Optionally, logo text */}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8 font-medium text-text-secondary">
            {navLinks.slice(0).map((link, idx) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  (location.pathname === link.to ? activeLink : navLink) +
                  " transition-all duration-200"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Account / Login + Donate */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to={accountHref}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-150 font-medium"
            >
              <FaUserCircle size={18} />
              {accountLabel}
            </Link>
            <a
              href={DONATE_URL}
              className={donateBtn}
              style={{ letterSpacing: "0.04em" }}
            >
              Donate <span role="img" aria-label="heart">❤️</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={menuBtn}
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open
              ? <FaTimes size={28} />
              : <FaBars size={28} />
            }
          </button>
        </div>
      </nav>

      {/* SIDE DRAWER MENU (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-fit bg-surface shadow-theme z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          maxWidth: "85vw",
          width: "320px",
          height: "100vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="p-6 flex items-center bg-surface border-b border-bg">
          <img src="/logo.png" className="h-10" style={{borderRadius: 5, background: 'var(--bg)'}} alt="Vanrang Foundation Logo" />
        </div>
        <p className="text-text-primary text-xl font-bold mb-4 pl-6 px-2 font-serif tracking-wide">
          THE VANRANG 
          <br/>
          FOUNDATION
        </p>

        <div className="flex flex-col gap-5"></div>
        <div className="px-6 pb-6 space-y-8">
          {/* ALL LINKS including Donate */}
          <div className="flex flex-col gap-5">
            {navLinks.map(({ to, name, icon: Icon }, idx) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={sideNavItem(idx, to)}
              >
                <span
                  className={
                    [
                      "bg-primary/10 text-primary",
                      "bg-secondary/10 text-secondary",
                      "bg-accent/10 text-accent-dark",
                      "bg-secondary/10 text-secondary-dark",
                      "bg-accent/10 text-accent-dark",
                      "bg-yellow-100 text-accent-dark",
                      "bg-pink-100 text-primary",
                      "bg-green-100 text-green-700" // Internship icon background
                    ][idx] +
                    " p-3 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-150"
                  }
                >
                  <Icon size={18} />
                </span>
                <span className="font-medium">{name}</span>
              </Link>
            ))}
            {/* Donate link in mobile drawer */}
            <a
              href={DONATE_URL}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 group text-pink-700 font-semibold`}
            >
              <span className="bg-pink-100 text-primary p-3 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-150">
                <FaHeart size={18} />
              </span>
              <span className="font-medium">Donate</span>
            </a>
            {/* Account / Login link in mobile drawer */}
            <Link
              to={accountHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 group text-text-secondary font-semibold"
            >
              <span className="bg-primary/10 text-primary p-3 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-150">
                <FaUserCircle size={18} />
              </span>
              <span className="font-medium">{accountLabel}</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-bg my-4"></div>

          {/* CONTACT DETAILS */}
          <div>
            <p className="text-text-primary text-sm font-semibold mb-3 tracking-wide">
              CONTACT DETAILS
            </p>
            <div className="flex flex-col gap-3">
              {/* Phones */}
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <FaUsers size={18} />
                </div>
                <div>
                  <div className="text-text-secondary font-medium">Phone:</div>
                  <a href="tel:+919783068493" className="block text-sm text-primary hover:underline hover:text-primary-dark">+91 9783068493</a>
                  <a href="tel:+919785720688" className="block text-sm text-primary hover:underline hover:text-primary-dark">+91 9785720688</a>
                  <a href="tel:+919256741759" className="block text-sm text-primary hover:underline hover:text-primary-dark">+91 9256741759</a>
                </div>
              </div>
              {/* Emails */}
              <div className="flex items-start gap-3">
                <div className="bg-secondary/10 text-secondary p-3 rounded-full">
                  <FaUsers size={18} />
                </div>
                <div>
                  <div className="text-text-secondary font-medium">E-mail:</div>
                  <a href="mailto:foundervanrang.org@gmail.com" className="block text-sm text-secondary hover:underline hover:text-secondary-dark">
                    foundervanrang.org@gmail.com
                  </a>
                  <a href="mailto:info@thevanrangfoundation.org" className="block text-sm text-secondary hover:underline hover:text-secondary-dark">
                    info@thevanrangfoundation.org
                  </a>
                </div>
              </div>
              {/* Office Location */}
              <div className="flex items-start gap-3">
                <div className="bg-accent/10 text-accent-dark p-3 rounded-full">
                  <FaTree size={18} />
                </div>
                <div>
                  <div className="text-text-secondary font-medium">Registered Office:</div>
                  <a
                    href="https://www.google.com/maps/place/THE+VANRANG+FOUNDATION/@27.572082,76.623481,14z/data=!4m6!3m5!1s0x39729954614bb1cd:0xa27c9c1ee1eab08b!8m2!3d27.5720816!4d76.6234807!16s%2Fg%2F11ylzs1klg?hl=en&entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-accent-dark hover:underline hover:text-accent"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-accent/10 text-accent-dark p-3 rounded-full">
                  <FaTree size={18} />
                </div>
                <div>
                  <div className="text-text-secondary font-medium">Sub Office:</div>
                  <a
                    href="https://www.google.com/maps?ll=27.569098,76.60414&z=14&t=m&hl=en&gl=IN&mapclient=embed&cid=9009522746295580750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-accent-dark hover:underline hover:text-accent"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
          aria-label="Backdrop"
        />
      )}

      {/* MOBILE BOTTOM NAV: Add Internship as last icon */}
      <div
        className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-[96%] rounded-full shadow-theme flex justify-between items-center px-2 py-2 z-40"
        style={{
          backgroundColor: "rgba(253,246,236,0.85)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* About */}
        <Link
          key={navLinks[1].to}
          to={navLinks[1].to}
          className={`flex flex-col items-center text-xs px-2 py-1 ${
            location.pathname === navLinks[1].to
              ? "text-primary font-semibold"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          {React.createElement(navLinks[1].icon, { size: 20 })}
          {navLinks[1].name === "Plantation Drives" ? "Drives" : navLinks[1].name}
        </Link>

        {/* Plantation Drives */}
        <Link
          key={navLinks[2].to}
          to={navLinks[2].to}
          className={`flex flex-col items-center text-xs px-2 py-1 ${
            location.pathname === navLinks[2].to
              ? "text-primary font-semibold"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <FaTree size={20} />
          Drives
        </Link>

        {/* Home - Center with emphasis */}
        <Link
          to="/"
          className={`bg-primary text-white p-4 rounded-full shadow-theme -mt-6 flex flex-col items-center justify-center z-10 border-2 border-surface hover:bg-primary-dark focus:ring-2 focus:ring-primary-dark transition-all duration-200 ${
            location.pathname === "/" ? "ring-2 ring-primary-dark" : ""
          }`}
          style={{ minWidth: 64 }}
        >
          <FaHome size={24} />
          <span className="text-xs mt-0.5">Home</span>
        </Link>

        {/* Gallery */}
        <Link
          key={navLinks[3].to}
          to={navLinks[3].to}
          className={`flex flex-col items-center text-xs px-2 py-1 ${
            location.pathname === navLinks[3].to
              ? "text-primary font-semibold"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <FaImages size={20} />
          {navLinks[3].name}
        </Link>

        {/* Team */}
        <Link
          key={navLinks[4].to}
          to={navLinks[4].to}
          className={`flex flex-col items-center text-xs px-2 py-1 ${
            location.pathname === navLinks[4].to
              ? "text-primary font-semibold"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <FaUserFriends size={20} />
          {navLinks[4].name}
        </Link>

        {/* Internship (new, last in mobile bottom nav) */}
        <Link
          key="/internship-form"
          to="/internship-form"
          className={`flex flex-col items-center text-xs px-2 py-1 ${
            location.pathname === "/internship-form"
              ? "text-primary font-semibold"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <FaClipboardList size={20} />
          Internship
        </Link>
      </div>
    </>
  );
}
