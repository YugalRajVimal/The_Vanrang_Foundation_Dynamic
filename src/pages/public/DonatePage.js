import { useState } from "react";
import { FaUniversity, FaQrcode, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  primary: "#F4A261",
  accent: "#E76F51",
  secondary: "#264653",
  background: "#FFF7ED",
  surface: "#FAE1CB",
  textPrimary: "#22223B",
  textSecondary: "#6B6B6B",
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: "", pan: "", address1: "", address2: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleDonate = async () => {
    setError("");
    if (!user) {
      navigate("/login", { state: { from: "/donate" } });
      return;
    }
    const amt = Number(form.amount);
    if (!amt || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Couldn't load the payment gateway. Check your connection.");

      const order = await api.post("/donations/order", {
        amount: amt,
        donorPAN: form.pan || undefined,
        donorAddress1: form.address1 || undefined,
        donorAddress2: form.address2 || undefined,
      });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "The Vanrang Foundation",
        description: "Donation",
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: COLORS.accent },
        handler: async (response) => {
          try {
            await api.post("/donations/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/donate/thank-you?status=paid&donationId=${order.donationId}`);
          } catch (err) {
            navigate(`/donate/thank-you?status=pending&donationId=${order.donationId}`);
          }
        },
        modal: {
          ondismiss: () => {
            navigate(`/donate/thank-you?status=failed&donationId=${order.donationId}`);
          },
        },
      });

      rzp.on("payment.failed", () => {
        navigate(`/donate/thank-you?status=failed&donationId=${order.donationId}`);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong starting the payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ background: COLORS.background, padding: "6rem 1.5rem 4rem 1.5rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ color: COLORS.accent, fontFamily: "serif", fontSize: "2.25rem", fontWeight: 700 }}>
            Support Our Mission
          </h1>
          <p style={{ color: COLORS.textSecondary, marginTop: "0.75rem" }}>
            Your contribution helps us create a positive impact in society.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Online donation form (Razorpay) */}
          <div style={{ background: COLORS.surface, borderRadius: "1rem", boxShadow: "0 1px 10px 2px #0001", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.accent }}>
              <FaUniversity style={{ color: COLORS.accent }} /> Donate Online
            </h2>

            {error && (
              <div style={{ background: "#FBEAE6", color: "#B3401F", padding: "0.6rem 0.9rem", borderRadius: "0.4rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Amount (₹) *</label>
            <input type="number" min="1" value={form.amount} onChange={set("amount")} placeholder="e.g. 1000"
              style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", border: `1px solid ${COLORS.accent}55`, marginBottom: "0.9rem" }} />

            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>PAN (optional, for receipt)</label>
            <input type="text" value={form.pan} onChange={set("pan")} maxLength={10} placeholder="ABCDE1234F"
              style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", border: `1px solid ${COLORS.accent}55`, marginBottom: "0.9rem", textTransform: "uppercase" }} />

            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Address (optional, for receipt)</label>
            <input type="text" value={form.address1} onChange={set("address1")} placeholder="Address line 1"
              style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", border: `1px solid ${COLORS.accent}55`, marginBottom: "0.6rem" }} />
            <input type="text" value={form.address2} onChange={set("address2")} placeholder="Address line 2"
              style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", border: `1px solid ${COLORS.accent}55`, marginBottom: "1.2rem" }} />

            <button onClick={handleDonate} disabled={submitting}
              style={{ display: "block", width: "100%", background: COLORS.accent, color: "#fff", padding: "0.8rem 1.2rem", borderRadius: "0.375rem", border: 0, fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Starting payment…" : "Donate Now"}
            </button>
          </div>

          {/* Scan to Pay — manual UPI, unaffected by the gateway change */}
          <div style={{ background: COLORS.surface, borderRadius: "1rem", boxShadow: "0 1px 10px 2px #0001", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 360 }}>
            <h3 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.accent }}>
              <FaQrcode style={{ color: COLORS.accent }} /> Scan to Pay
            </h3>
            <img src="/QR.jpeg" alt="QR Payment" style={{ width: 210, maxWidth: "80%", borderRadius: "0.5rem", border: `1px solid ${COLORS.accent}33`, marginBottom: "1.15rem" }} />
            <div style={{ fontSize: "0.97rem", color: COLORS.textSecondary, textAlign: "center", fontFamily: "serif" }}>
              <span style={{ display: "block", marginBottom: 2 }}>Or use UPI ID:</span>
              <strong>9256741759.ibz@icici</strong>
            </div>
            <ul style={{ color: COLORS.textPrimary, listStyle: "none", padding: 0, fontSize: "0.95rem", lineHeight: 1.6, marginTop: "1.2rem", textAlign: "left" }}>
              <li><b>Account Name:</b> The Vanrang Foundation</li>
              <li><b>Bank Name:</b> ICICI</li>
              <li><b>IFSC Code:</b> ICIC0006736</li>
              <li><b>Account No:</b> 673605601281</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "4.5rem" }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DonationSection
            title="Membership"
            items={["Monthly Membership – ₹100 per month", "Annual Membership – ₹5100 per year", "Life Time Membership – ₹51000 one time", "Patron Membership – ₹250001 one time"]}
          />
          <DonationSection title="Food Sponsorship (Bhojan Seva)" items={["One time meal for 200 people – ₹3000"]} />
        </div>
      </div>
    </section>
  );
}

function DonationSection({ title, items }) {
  return (
    <div style={{ background: "#FFF7ED", border: `1px solid #F4A261`, borderRadius: "1rem", padding: "2rem" }}>
      <h3 style={{ fontSize: "1.17rem", fontWeight: 700, color: "#E76F51", marginBottom: "1rem", fontFamily: "serif", letterSpacing: "0.02em" }}>
        {title}
      </h3>
      <ul style={{ color: "#22223B", padding: 0, listStyle: "none", margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "1.04rem" }}>
            <FaCheckCircle style={{ color: "#F4A261", minWidth: 21 }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}