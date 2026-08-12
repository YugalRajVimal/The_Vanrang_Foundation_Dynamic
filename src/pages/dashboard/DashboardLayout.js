import { NavLink, Outlet } from "react-router-dom";

const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

const tabs = [
  { to: "/dashboard", label: "Profile Overview", end: true },
  { to: "/dashboard/donations", label: "Donation History" },
  { to: "/dashboard/certificate-requests", label: "Certificate Requests" },
];

// Shared shell for all /dashboard/* pages. Rendered inside
// <ProtectedRoute role="user"><DashboardLayout /></ProtectedRoute> with nested
// <Route> children rendering into <Outlet />.
export default function DashboardLayout() {
  return (
    <section className="pt-28 pb-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-serif" style={{ color: COLORS.primary }}>
          My Dashboard
        </h1>

        <div className="flex flex-wrap gap-3 mb-10 border-b pb-4" style={{ borderColor: COLORS.accent + "55" }}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                "px-4 py-2 rounded-lg font-semibold text-sm transition"
              }
              style={({ isActive }) => ({
                background: isActive ? COLORS.primary : COLORS.surface,
                color: isActive ? COLORS.surface : COLORS.primary,
                border: `1.5px solid ${COLORS.primary}`,
              })}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </div>
    </section>
  );
}

export { COLORS as DASHBOARD_COLORS };
