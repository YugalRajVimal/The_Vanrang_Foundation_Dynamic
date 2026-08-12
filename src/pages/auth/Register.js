import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthCard, AuthField, AuthBanner, AuthButton, COLORS, validators } from "../../components/auth/AuthFormBits";
import { ApiError } from "../../api/client";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {
      name: validators.required(form.name),
      email: validators.email(form.email),
      phone: validators.indianMobile(form.phone),
      password: validators.minLen(6)(form.password),
      confirmPassword: form.confirmPassword === form.password ? "" : "Passwords do not match",
    };
    setFieldErrors(errs);
    return Object.values(errs).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await register(payload);
      if (data && data.token) {
        // Backend auto-logs in — go straight to dashboard.
        navigate("/dashboard", { replace: true });
      } else {
        // Backend expects a separate login step — show success and redirect to /login.
        setSuccess(true);
        setTimeout(() => navigate("/login", { replace: true }), 1800);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFieldErrors((prev) => ({ ...prev, email: "This email is already registered" }));
      } else {
        setBanner((err && err.message) || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Registration Successful">
        <AuthBanner type="success">
          Your account has been created. Redirecting you to log in…
        </AuthBanner>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create an Account">
      <AuthBanner>{banner}</AuthBanner>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="Full Name"
          required
          value={form.name}
          error={fieldErrors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <AuthField
          label="Email"
          required
          type="email"
          value={form.email}
          error={fieldErrors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthField
          label="Mobile Number"
          required
          type="tel"
          placeholder="10-digit mobile number"
          value={form.phone}
          error={fieldErrors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <AuthField
          label="Password"
          required
          type="password"
          value={form.password}
          error={fieldErrors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <AuthField
          label="Confirm Password"
          required
          type="password"
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <AuthButton disabled={submitting}>{submitting ? "Creating account…" : "Register"}</AuthButton>
      </form>
      <div className="text-center mt-5 text-sm" style={{ color: COLORS.textSecondary }}>
        Already have an account?{" "}
        <Link to="/login" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
          Login
        </Link>
      </div>
    </AuthCard>
  );
}
