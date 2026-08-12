import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const COLORS = { primary: "#E76F51", secondary: "#F4A261", background: "#FDF6EC", surface: "#FFFFFF", textSecondary: "#6B6B6B" };

// After a Cashfree checkout, the gateway redirects here. No frontend action is
// needed to record the donation — POST /donations/webhook (signature-verified)
// handles that server-side. This page just reflects back whatever status
// Cashfree includes in the return URL query string, for reassurance.
export default function DonateStatus() {
  const [params] = useSearchParams();
  const status = (params.get("order_status") || params.get("status") || "").toLowerCase();

  const config = {
    paid: { icon: <FaCheckCircle size={48} style={{ color: "#3F7A2E" }} />, title: "Thank You!", message: "Your donation was successful. We're grateful for your support of our mission." },
    success: { icon: <FaCheckCircle size={48} style={{ color: "#3F7A2E" }} />, title: "Thank You!", message: "Your donation was successful. We're grateful for your support of our mission." },
    pending: { icon: <FaClock size={48} style={{ color: "#B3801F" }} />, title: "Payment Pending", message: "We're waiting for confirmation from the payment gateway. This can take a few minutes." },
    failed: { icon: <FaTimesCircle size={48} style={{ color: "#B3401F" }} />, title: "Payment Failed", message: "Something went wrong with your payment. No amount has been deducted, or it will be refunded automatically." },
  };

  const { icon, title, message } = config[status] || {
    icon: <FaClock size={48} style={{ color: COLORS.secondary }} />,
    title: "Payment Status",
    message: "Thanks for donating to The Vanrang Foundation. If your payment went through, it will reflect in your donation history shortly.",
  };

  return (
    <section className="pt-32 pb-20 px-4" style={{ background: COLORS.background, minHeight: "100vh" }}>
      <div className="max-w-md mx-auto rounded-2xl shadow-lg p-10 text-center border-t-8" style={{ background: COLORS.surface, borderTopColor: COLORS.primary }}>
        <div className="flex justify-center mb-4">{icon}</div>
        <h1 className="text-2xl font-bold mb-2 font-serif" style={{ color: COLORS.primary }}>{title}</h1>
        <p className="mb-6" style={{ color: COLORS.textSecondary }}>{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/donations" className="px-5 py-2.5 rounded-lg font-semibold" style={{ background: COLORS.primary, color: "#fff" }}>
            View Donation History
          </Link>
          <Link to="/" className="px-5 py-2.5 rounded-lg font-semibold border" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
