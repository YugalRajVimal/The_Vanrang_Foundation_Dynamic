import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthCard, AuthField, AuthBanner, AuthButton, COLORS, validators } from "../../components/auth/AuthFormBits";
import { ApiError } from "../../api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

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
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
        setBanner("Invalid email or password");
      } else {
        setBanner(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Welcome Back">
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
      <div className="text-center mt-5 text-sm space-y-2" style={{ color: COLORS.textSecondary }}>
        <div>
          <Link to="/forgot-password" className="hover:underline" style={{ color: COLORS.primary }}>
            Forgot password?
          </Link>
        </div>
        <div>
          New here?{" "}
          <Link to="/register" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
            Register
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
