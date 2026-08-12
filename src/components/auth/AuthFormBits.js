// Small shared pieces reused across Login / Register / ForgotPassword / ResetPassword
// so the four pages stay visually identical without copy-pasting styles.

export const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

export function AuthField({ label, error, required, ...inputProps }) {
  return (
    <div>
      <label className="block font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="rounded-lg p-3 w-full outline-none"
        style={{
          border: `1.5px solid ${error ? "#E76F51" : COLORS.accent}`,
          color: COLORS.textPrimary,
        }}
        {...inputProps}
      />
      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
}

export function AuthBanner({ type = "error", children }) {
  if (!children) return null;
  const isError = type === "error";
  return (
    <div
      className="rounded-lg p-3 text-sm font-medium mb-4"
      style={{
        background: isError ? "#FBEAE6" : "#EFF7EA",
        color: isError ? "#B3401F" : "#3F7A2E",
        border: `1px solid ${isError ? COLORS.primary : "#7AAE5A"}`,
      }}
    >
      {children}
    </div>
  );
}

export function AuthCard({ title, children }) {
  return (
    <section className="pt-32 pb-20 px-4" style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <div
        className="max-w-md mx-auto rounded-2xl shadow-lg p-8 border-t-8"
        style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.primary }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center font-serif" style={{ color: COLORS.primary }}>
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}

export function AuthButton({ children, ...props }) {
  return (
    <button
      type="submit"
      className="w-full py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: COLORS.primary, color: COLORS.surface }}
      onMouseOver={(e) => !props.disabled && (e.currentTarget.style.backgroundColor = COLORS.secondary)}
      onMouseOut={(e) => !props.disabled && (e.currentTarget.style.backgroundColor = COLORS.primary)}
      {...props}
    >
      {children}
    </button>
  );
}

// Simple client-side validators shared by the auth forms.
export const validators = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address"),
  required: (v) => (v && String(v).trim() ? "" : "This field is required"),
  minLen: (n) => (v) => (v && v.length >= n ? "" : `Must be at least ${n} characters`),
  indianMobile: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit Indian mobile number"),
  matches: (other, label = "fields") => (v, all) => (v === all[other] ? "" : `Must match ${label}`),
};
