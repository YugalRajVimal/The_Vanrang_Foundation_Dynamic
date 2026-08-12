import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { AuthCard, AuthField, AuthBanner, AuthButton, COLORS, validators } from "../../components/auth/AuthFormBits";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validators.email(email);
    setError(err);
    if (err) return;

    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email }, { auth: false });
    } catch {
      // Intentionally ignored: always show the same success message below,
      // regardless of outcome, to avoid account enumeration.
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check Your Email">
        <AuthBanner type="success">
          If an account exists for this email, a reset link has been sent.
        </AuthBanner>
        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
            Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot Password">
      <p className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          label="Email"
          required
          type="email"
          value={email}
          error={error}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthButton disabled={submitting}>{submitting ? "Sending…" : "Send Reset Link"}</AuthButton>
      </form>
      <div className="text-center mt-5 text-sm" style={{ color: COLORS.textSecondary }}>
        <Link to="/login" className="hover:underline font-semibold" style={{ color: COLORS.primary }}>
          Back to Login
        </Link>
      </div>
    </AuthCard>
  );
}
