import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthCard, AuthField, AuthBanner, AuthButton, validators } from "../../components/auth/AuthFormBits";
import { ApiError } from "../../api/client";

// Kept fully separate from the public /login page: its own route, its own
// component, and it calls adminLogin() (POST /auth/admin/login) rather than
// login() — no shared auth state logic between the two, per spec 3.3.
export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {
      email: validators.email(form.email),
      password: form.password && form.password.length >= 6 ? "" : "Password must be at least 6 characters",
    };
    setFieldErrors(errs);
    return !errs.email && !errs.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await adminLogin(form.email, form.password);
      navigate("/admin", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
        setBanner("Invalid email or password");
      } else {
        setBanner((err && err.message) || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Admin Login">
      <AuthBanner>{banner}</AuthBanner>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="Email"
          required
          type="email"
          value={form.email}
          error={fieldErrors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthField
          label="Password"
          required
          type="password"
          value={form.password}
          error={fieldErrors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <AuthButton disabled={submitting}>{submitting ? "Signing in…" : "Log In"}</AuthButton>
      </form>
    </AuthCard>
  );
}
