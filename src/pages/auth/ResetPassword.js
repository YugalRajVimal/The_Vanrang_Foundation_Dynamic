import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../../api/client";
import { AuthCard, AuthField, AuthBanner, AuthButton, COLORS, validators } from "../../components/auth/AuthFormBits";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <AuthCard title="Invalid Link">
        <AuthBanner>Invalid or expired link.</AuthBanner>
        <div className="text-center mt-4 text-sm">
          <Link to="/forgot-password" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  const validate = () => {
    const errs = {
      newPassword: validators.minLen(6)(form.newPassword),
      confirmPassword: form.confirmPassword === form.newPassword ? "" : "Passwords do not match",
    };
    setFieldErrors(errs);
    return !errs.newPassword && !errs.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: form.newPassword }, { auth: false });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 401 || err.status === 410)) {
        setExpired(true);
      } else {
        setBanner((err && err.message) || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (expired) {
    return (
      <AuthCard title="Link Expired">
        <AuthBanner>This link has expired. Request a new one.</AuthBanner>
        <div className="text-center mt-4 text-sm">
          <Link to="/forgot-password" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard title="Password Updated">
        <AuthBanner type="success">Your password has been updated. Redirecting to login…</AuthBanner>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset Password">
      <AuthBanner>{banner}</AuthBanner>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="New Password"
          required
          type="password"
          value={form.newPassword}
          error={fieldErrors.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <AuthField
          label="Confirm New Password"
          required
          type="password"
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <AuthButton disabled={submitting}>{submitting ? "Updating…" : "Update Password"}</AuthButton>
      </form>
    </AuthCard>
  );
}
