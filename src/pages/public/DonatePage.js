import { FaUniversity, FaQrcode, FaCheckCircle } from "react-icons/fa";

const COLORS = {
  primary: "#F4A261",
  accent: "#E76F51",
  secondary: "#264653",
  background: "#FFF7ED",
  surface: "#FAE1CB",
  textPrimary: "#22223B",
  textSecondary: "#6B6B6B",
};

export default function DonationPage() {
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
          {/* Bank Details */}
          <div style={{ background: COLORS.surface, borderRadius: "1rem", boxShadow: "0 1px 10px 2px #0001", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 360 }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.accent }}>
              <FaUniversity style={{ color: COLORS.accent }} /> Bank Account Details
            </h2>
            <ul style={{ color: COLORS.textPrimary, listStyle: "none", padding: 0, fontSize: "1.07rem", lineHeight: 1.65 }}>
              <li style={{ marginBottom: "0.7rem" }}><b>Account Name:</b> The Vanrang Foundation</li>
              <li style={{ marginBottom: "0.7rem" }}><b>Bank Name:</b> ICICI</li>
              <li style={{ marginBottom: "0.7rem" }}><b>IFSC Code:</b> ICIC0006736</li>
              <li style={{ marginBottom: "0.7rem" }}><b>Account No:</b> 673605601281</li>
              <li><b>UPI ID:</b> 9256741759.ibz@icici</li>
            </ul>
            <a
              href="https://payments-test.cashfree.com/forms/donate-tvf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: COLORS.accent, color: "#fff", padding: "0.75rem 1.2rem", borderRadius: "0.375rem", textDecoration: "none", fontWeight: 600, boxShadow: "0 1px 8px 0 #0001", marginTop: "1.4rem", marginBottom: "0.8rem", letterSpacing: ".03em", textAlign: "center" }}
            >
              Donate Online
            </a>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <h4 style={{ color: COLORS.accent, fontWeight: 500, marginBottom: "0.5rem" }}>PAYMENT QR</h4>
              <img src="/CASHFREE-QR.png" alt="Payment QR for Online Donation" className="mx-auto" style={{ width: 200, maxWidth: "75%", borderRadius: "0.35rem", border: `1px solid ${COLORS.accent}22` }} />
            </div>
          </div>

          {/* Scan to Pay */}
          <div style={{ background: COLORS.surface, borderRadius: "1rem", boxShadow: "0 1px 10px 2px #0001", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 360 }}>
            <h3 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem", color: COLORS.accent }}>
              <FaQrcode style={{ color: COLORS.accent }} /> Scan to Pay
            </h3>
            <img src="/QR.jpeg" alt="QR Payment" style={{ width: 210, maxWidth: "80%", borderRadius: "0.5rem", border: `1px solid ${COLORS.accent}33`, marginBottom: "1.15rem" }} />
            <div style={{ fontSize: "0.97rem", color: COLORS.textSecondary, textAlign: "center", fontFamily: "serif" }}>
              <span style={{ display: "block", marginBottom: 2 }}>Or use UPI ID:</span>
              <strong>9256741759.ibz@icici</strong>
            </div>
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
