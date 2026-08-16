import React, { useState, useRef } from "react";
import { FaPhone, FaEnvelope, FaWhatsapp, FaLeaf, FaBug } from "react-icons/fa";
import GalleryCarousel from "../../components/Home/GalleryCarousel";

const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

function BugReportModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", title: "", screenshot: null, description: "" });
  const [screenshotName, setScreenshotName] = useState("");
  const fileInputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} aria-modal="true" tabIndex={-1}>
      <div className="relative bg-white rounded-xl p-8 max-w-xl w-full shadow-2xl border-t-8" style={{ borderTopColor: COLORS.primary }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close bug report modal" className="absolute right-4 top-4 text-xl text-gray-600 hover:text-gray-900">&times;</button>
        <div className="flex items-center gap-2 mb-4">
          <FaBug style={{ color: COLORS.primary }} size={22} />
          <h2 className="font-bold text-xl" style={{ color: COLORS.primary }}>Report a Bug</h2>
        </div>
        {submitted ? (
          <div className="text-green-600 font-bold text-center py-4">Thank you! Your bug report has been submitted.</div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // NOTE: no /bug-reports endpoint exists in the API contract — this
              // remains a client-side-only demo submission until one is added.
              setSubmitted(true);
              setTimeout(() => {
                setSubmitted(false);
                onClose();
                setForm({ name: "", email: "", phone: "", title: "", screenshot: null, description: "" });
                setScreenshotName("");
              }, 1600);
            }}
          >
            <Field label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Bug Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <div>
              <label className="block font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Screenshot (optional)</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setForm({ ...form, screenshot: file });
                    setScreenshotName(file ? file.name : "");
                  }}
                />
                {screenshotName && <span className="text-sm text-green-600">{screenshotName}</span>}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
                Bug Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                className="rounded-lg p-2 w-full outline-none h-24"
                placeholder="Please describe the bug in detail"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button type="submit" className="text-white px-4 py-2 rounded-lg font-semibold transition" style={{ backgroundColor: COLORS.primary }}>
                Submit Bug
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        className="rounded-lg p-2 w-full outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }}
      />
    </div>
  );
}

export default function ContactVolunteer() {
  const [bugModalOpen, setBugModalOpen] = useState(false);

  return (
    <section className="py-20 pt-32" style={{ backgroundColor: COLORS.background }}>
      <BugReportModal open={bugModalOpen} onClose={() => setBugModalOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative">
          <button
            className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold shadow-md transition z-20"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => setBugModalOpen(true)}
          >
            <FaBug size={18} /> Report a Bug
          </button>
        </div>

        <div className="grid lg:grid-cols-1 gap-16 mt-12">
          {/* INFO PANEL */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: COLORS.primary }}>
              Connect with The Vanrang Foundation
            </h1>
            <h2 className="text-3xl font-bold mb-8 font-serif" style={{ color: COLORS.primary }}>
              Connect, Contribute, Create Change
            </h2>
            <div className="rounded-full inline-flex items-center gap-3 px-5 py-2 mb-6 font-semibold" style={{ backgroundColor: COLORS.primary, color: COLORS.surface }}>
              India
            </div>

            <div className="mb-8 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8" style={{ color: COLORS.textPrimary }}>
              <div className="flex flex-col justify-between">
                <div className="mb-3">
                  <span className="font-semibold" style={{ color: COLORS.secondary }}>Registered Office:</span><br />
                  189, Adarsh Colony, Daudpur<br />Alwar, Rajasthan, India – 301001
                </div>
                <div className="flex items-start gap-3 mt-6">
                  <FaPhone style={{ color: COLORS.primary }} className="mt-1" />
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.primary }}>Call Us For Queries</p>
                    <div className="flex flex-col space-y-1 font-medium" style={{ color: COLORS.secondary }}>
                      <a href="tel:+919783068493" className="hover:underline">+91 9783068493</a>
                      <a href="tel:+919785720688" className="hover:underline">+91 9785720688</a>
                      <a href="tel:+919256741759" className="hover:underline">+91 9256741759</a>
                    </div>
                  </div>
                </div>
                <a href="https://wa.me/919783068493" className="flex items-center gap-3 mt-5 font-semibold hover:underline" style={{ color: COLORS.primary }} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp /> WhatsApp – Start a Green Conversation
                </a>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-semibold" style={{ color: COLORS.secondary }}>Sub Office:</span><br />
                  245, Malan Ki Gali, Hindu Pada<br />Vikas Path, Alwar, Rajasthan, India – 301001
                </div>
                <div className="flex items-start gap-3 mt-6">
                  <FaEnvelope style={{ color: COLORS.primary }} className="mt-1" />
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.primary }}>Email for Enquiries</p>
                    <div className="flex flex-col space-y-1 font-medium break-all" style={{ color: COLORS.secondary }}>
                      <a href="mailto:foundervanrang.org@gmail.com" className="hover:underline">foundervanrang.org@gmail.com</a>
                      <a href="mailto:info@thevanrangfoundation.org" className="hover:underline">info@thevanrangfoundation.org</a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-5 font-medium items-center" style={{ color: COLORS.textPrimary }}>
                  {[
                    ["https://www.instagram.com/thevanrangfoundation?igsh=ZG1sa20yN2kzcHdp", "Instagram"],
                    ["https://www.threads.com/@thevanrangfoundation", "Threads"],
                    ["https://x.com/vanrangofficial", "X (Twitter)"],
                    ["https://youtube.com/@vanrangfoundation?si=MEivV0bBvFrxjFTP", "YouTube"],
                    ["https://www.facebook.com/share/1AixPGcMh9/", "Facebook"],
                    ["https://linkedin.com/company/the-vanrang-foundation", "LinkedIn"],
                  ].map(([href, label]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VOLUNTEER FORM */}
          <div className="mt-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: COLORS.primary }}>
              Volunteer Registration Form – The Vanrang Foundation
            </h1>
            <div className="font-medium mb-3" style={{ color: COLORS.textSecondary }}>
              Thank you for your interest in volunteering with The Vanrang Foundation.
            </div>
            <div className="mb-1" style={{ color: COLORS.textSecondary, fontSize: 16 }}>
              Please fill out this form to register as a volunteer. Our team will contact you shortly.
            </div>
          </div>

          <div className="rounded-2xl shadow-lg p-10 border-t-8" style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.primary }}>
            <h2 className="text-2xl font-bold mb-2 text-center font-serif" style={{ color: COLORS.primary }}>
              Volunteer Registration Form
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: COLORS.textSecondary }}>
              This form isn't wired to the backend yet — the <code>/volunteer-applications</code> endpoint needs to
              be confirmed and added to the API contract first (see the addendum sent to backend). Submitting is
              disabled in the meantime.
            </p>
            <VolunteerFormFields />
          </div>
        </div>

        {/* MAPS */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-7xl mx-auto px-4">
          <MapBlock title="Registered Office" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7073.479267533285!2d76.6086606959559!3d27.57058990504498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39729954614bb1cd%3A0xa27c9c1ee1eab08b!2sTHE%20VANRANG%20FOUNDATION!5e0!3m2!1sen!2sin!4v1772962674709!5m2!1sen!2sin" />
          <MapBlock title="Sub Office" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7073.575408013053!2d76.59538566977537!3d27.5690984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299484a3e6e77%3A0x7d08413408bff84e!2sTHE%20VANRANG%20FOUNDATION!5e0!3m2!1sen!2sin!4v1772962692982!5m2!1sen!2sin" />
        </div>

        <div className="mt-24"></div>
        <GalleryCarousel />
      </div>
    </section>
  );
}

function MapBlock({ title, src }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.primary }}>{title}</h3>
      <div className="rounded-lg overflow-hidden shadow-md border" style={{ borderColor: COLORS.accent }}>
        <iframe title={title} src={src} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}

function VolunteerFormFields() {
  const disabledStyle = { border: `1.5px solid #E9C46A`, color: "#2D2D2D", opacity: 0.7 };
  return (
    <fieldset disabled className="space-y-5 opacity-90">
      <Field2 label="Email" required />
      <Field2 label="Full Name" required />
      <Field2 label="Mother Name / Father Name" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field2 label="Date of Birth" type="date" required />
        <Field2 label="City & State" required />
      </div>
      <Field2 label="Current Address" textarea required />
      <div>
        <label className="block font-semibold mb-2" style={{ color: "#2D2D2D" }}>Areas of Interest</label>
        <p className="text-sm" style={{ color: "#6B6B6B" }}>
          Education Support · Social Media & Content · Event Management · Fundraising · Field Work ·
          Administration · Graphic Design
        </p>
      </div>
      <Field2 label="How many hours can you volunteer per week?" type="number" required />
      <Field2 label="Why do you want to volunteer with The Vanrang Foundation?" textarea />
      <div className="text-center mt-2">
        <button type="button" disabled className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: "#F4A261", color: "#fff" }}>
          Submit Registration (temporarily disabled)
        </button>
        <div className="mt-3 text-sm italic flex items-center justify-center gap-2" style={{ color: "#6B6B6B" }}>
          <FaLeaf size={16} /> We welcome youth, schools, and communities to partner for a greener, sustainable India.
        </div>
      </div>
    </fieldset>
  );
}

function Field2({ label, required, type = "text", textarea }) {
  const style = { border: `1.5px solid #E9C46A`, color: "#2D2D2D" };
  return (
    <div>
      <label className="block font-semibold mb-1" style={{ color: "#2D2D2D" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea className="rounded-lg p-3 w-full outline-none h-20" style={style} />
      ) : (
        <input type={type} className="rounded-lg p-3 w-full outline-none" style={style} />
      )}
    </div>
  );
}
