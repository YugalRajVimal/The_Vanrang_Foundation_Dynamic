import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

const navItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/banners", label: "Banners" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/blogs", label: "Plantation Blogs" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/certifications", label: "Certifications" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/certificate-requests", label: "Certificate Requests" },
  { to: "/admin/donations", label: "Donations" },
  { to: "/admin/contact-settings", label: "Contact Settings" },
  { to: "/admin/counters", label: "Counters" },
  { to: "/admin/banner-card", label: "Banner Card" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen" style={{ background: COLORS.background }}>
      <aside
        className="w-64 shrink-0 hidden md:flex flex-col pt-24 px-4 pb-6 border-r"
        style={{ background: COLORS.surface, borderColor: COLORS.accent + "55" }}
      >
        <h2 className="font-serif font-bold text-lg mb-6 px-2" style={{ color: COLORS.primary }}>
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="px-3 py-2 rounded-lg text-sm font-medium transition"
              style={({ isActive }) => ({
                background: isActive ? COLORS.primary : "transparent",
                color: isActive ? COLORS.surface : COLORS.textPrimary,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 pt-4 border-t text-sm" style={{ borderColor: COLORS.accent + "55" }}>
          <p className="mb-2" style={{ color: COLORS.textSecondary }}>
            Signed in as <strong>{user?.name || user?.email}</strong>
          </p>
          <button onClick={logout} className="font-semibold hover:underline" style={{ color: COLORS.primary }}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 pt-24 px-4 md:px-8 pb-16">
        {/* Mobile nav */}
        <nav className="flex md:hidden flex-wrap gap-2 mb-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={({ isActive }) => ({
                background: isActive ? COLORS.primary : COLORS.surface,
                color: isActive ? COLORS.surface : COLORS.primary,
                borderColor: COLORS.primary,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
