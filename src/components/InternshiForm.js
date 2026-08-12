import React, { useState } from 'react'
import { api, ApiError } from '../api/client'

// Color Palette from instructions
const COLORS = {
  primary: "#E76F51",      // Warm NGO Red
  secondary: "#F4A261",    // Soft Orange
  accent: "#E9C46A",       // Warm Yellow
  background: "#FDF6EC",   // Light Beige
  surface: "#FFFFFF",      // Card Color
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B"
};

// NOTE — contract gap (see section2-addendum-internship.md):
// POST /internship-applications only accepts { name, email, phone, college?, message, resumeUrl? }.
// This form also collects a passport photo and an ID proof, and the resume field here is a raw
// file upload rather than a pre-hosted URL. None of the three files can be submitted until either
// (a) a file-upload endpoint is added that returns a URL to pass as resumeUrl, or (b) the contract
// adds multipart fields for all three files. Until then: the file inputs are collected but NOT
// submitted, and the UI says so explicitly rather than silently dropping them.

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  college: "",
  course: "",
  duration: "",
  fieldOfInterest: [],
  why: "",
  skills: "",
  declare: false,
};

export default function InternshiForm() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleInterest = (value) => {
    setForm((f) => ({
      ...f,
      fieldOfInterest: f.fieldOfInterest.includes(value)
        ? f.fieldOfInterest.filter((v) => v !== value)
        : [...f.fieldOfInterest, value],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.dob) errs.dob = "Required";
    if (!form.gender) errs.gender = "Required";
    if (!form.college.trim()) errs.college = "Required";
    if (!form.course.trim()) errs.course = "Required";
    if (!form.duration.trim()) errs.duration = "Required";
    if (form.fieldOfInterest.length === 0) errs.fieldOfInterest = "Select at least one";
    if (!form.why.trim()) errs.why = "Required";
    if (!form.skills.trim()) errs.skills = "Required";
    if (!form.declare) errs.declare = "You must agree to continue";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;
    setStatus("submitting");
    try {
      // Contract only has name/email/phone/college/message/resumeUrl — fold the
      // richer fields we collect into a structured message body for now.
      const message = [
        `DOB: ${form.dob}`,
        `Gender: ${form.gender}`,
        `Course: ${form.course}`,
        `Preferred duration: ${form.duration}`,
        `Field(s) of interest: ${form.fieldOfInterest.join(", ")}`,
        `Why they want to intern: ${form.why}`,
        `Skills: ${form.skills}`,
      ].join("\n");

      await api.post(
        "/internship-applications",
        { name: form.fullName, email: form.email, phone: form.mobile, college: form.college, message },
        { auth: false }
      );
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("idle");
      setBanner(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section className="py-20 pt-32 px-4 md:px-20" style={{ backgroundColor: COLORS.background }}>
        <div
          className="max-w-3xl mx-auto rounded-2xl shadow-lg p-10 text-center border-t-8"
          style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.primary }}
        >
          <h2 className="text-2xl font-bold mb-3 font-serif" style={{ color: COLORS.primary }}>
            Application Received!
          </h2>
          <p style={{ color: COLORS.textSecondary }}>
            Thank you for applying to intern with The Vanrang Foundation. Our team will review your
            application and reach out by email or phone.
          </p>
          <p className="text-sm mt-4" style={{ color: COLORS.textSecondary }}>
            Please also email your resume, photo, and ID proof to{" "}
            <a href="mailto:info@thevanrangfoundation.org" className="underline" style={{ color: COLORS.primary }}>
              info@thevanrangfoundation.org
            </a>{" "}
            — document upload isn't wired to this form yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 pt-32 px-4 md:px-20" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="mt-4 mx-auto px-4 md:px-6 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: COLORS.primary }}>
          Internship Registration Form – The Vanrang Foundation
        </h1>
        <div className="font-medium mb-3" style={{ color: COLORS.textSecondary }}>
          Thank you for your interest in joining The Vanrang Foundation as an intern.
        </div>
        <div className="mb-2" style={{ color: COLORS.textSecondary, fontSize: 16 }}>
          We are a Section 8 non-profit organization registered under the Ministry of Corporate Affairs, Government of India, working towards social impact and youth development across India.
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 15 }}>
          Please fill out this form carefully. All information will remain confidential and used only for official purposes.
        </div>
      </div>

      <div
        className="rounded-2xl shadow-lg p-10 border-t-8 mx-auto px-4 md:px-6 max-w-7xl mt-20"
        style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.primary }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center font-serif" style={{ color: COLORS.primary }}>
          Internship Registration Form
        </h2>

        {banner && (
          <div className="rounded-lg p-3 text-sm font-medium mb-5" style={{ background: "#FBEAE6", color: "#B3401F", border: `1px solid ${COLORS.primary}` }}>
            {banner}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Field label="Full Name" required error={fieldErrors.fullName}>
            <input type="text" value={form.fullName} onChange={update("fullName")} className="rounded-lg p-3 w-full outline-none" placeholder="Enter your Full Name" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <Field label="Mobile Number" required error={fieldErrors.mobile}>
            <input type="tel" value={form.mobile} onChange={update("mobile")} className="rounded-lg p-3 w-full outline-none" placeholder="Enter your Mobile Number" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <Field label="Email ID" required error={fieldErrors.email}>
            <input type="email" value={form.email} onChange={update("email")} className="rounded-lg p-3 w-full outline-none" placeholder="Enter your Email" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Date of Birth" required error={fieldErrors.dob}>
              <input type="date" value={form.dob} onChange={update("dob")} className="rounded-lg p-3 w-full outline-none" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
            </Field>
          </div>

          <div>
            <label className="block font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-6 items-center">
              {["Male", "Female", "Prefer not to say"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={update("gender")} className="accent-orange-600" />
                  {g}
                </label>
              ))}
            </div>
            {fieldErrors.gender && <p className="text-sm mt-1 text-red-600">{fieldErrors.gender}</p>}
          </div>

          <Field label="College / University Name" required error={fieldErrors.college}>
            <input type="text" value={form.college} onChange={update("college")} className="rounded-lg p-3 w-full outline-none" placeholder="Enter College or University Name" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <Field label="Course (B.A, BBA, etc.)" required error={fieldErrors.course}>
            <input type="text" value={form.course} onChange={update("course")} className="rounded-lg p-3 w-full outline-none" placeholder="Course (B.A, BBA, etc.)" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <Field label="Preferred Internship Duration" required error={fieldErrors.duration}>
            <input type="text" value={form.duration} onChange={update("duration")} className="rounded-lg p-3 w-full outline-none" placeholder="e.g. 1 month, 2 months" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <div>
            <label className="block font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
              Field of Interest <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-6 items-center">
              {[
                "Marketing / Social Media", "Event Management", "Awareness Campaign",
                "Content Writing / Copywriting", "Graphic Designing / Poster Making",
                "Fundraising / Sponsorship", "Team Coordination / Leadership",
                "Environmental Activities", "Video Editing / Reels Creation", "Other",
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.fieldOfInterest.includes(opt)}
                    onChange={() => toggleInterest(opt)}
                    className="accent-orange-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {fieldErrors.fieldOfInterest && <p className="text-sm mt-1 text-red-600">{fieldErrors.fieldOfInterest}</p>}
          </div>

          <Field label="Why do you want to do this internship?" required error={fieldErrors.why}>
            <textarea value={form.why} onChange={update("why")} className="rounded-lg p-3 w-full outline-none h-20" placeholder="Explain your reasons for applying for internship" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          <Field label="What are your skills?" required error={fieldErrors.skills}>
            <textarea value={form.skills} onChange={update("skills")} className="rounded-lg p-3 w-full outline-none h-20" placeholder="List your skills" style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }} />
          </Field>

          {/* File fields — collected for the user's benefit but NOT submitted yet; see note above. */}
          <div className="rounded-lg p-4" style={{ background: COLORS.background, border: `1px dashed ${COLORS.accent}` }}>
            <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>
              Resume, photo, and ID upload aren't wired to this form yet
            </p>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              The API contract doesn't yet support file uploads for internship applications. Please
              email your resume, a passport-size photo, and an ID proof to{" "}
              <a href="mailto:info@thevanrangfoundation.org" className="underline">info@thevanrangfoundation.org</a>{" "}
              after submitting this form.
            </p>
          </div>

          <div className="flex items-start gap-2 text-sm" style={{ color: COLORS.primary }}>
            <input
              type="checkbox"
              id="declare"
              checked={form.declare}
              onChange={(e) => setForm({ ...form, declare: e.target.checked })}
              className="mt-1 accent-orange-600"
              style={{ accentColor: COLORS.primary }}
            />
            <label htmlFor="declare" className="flex flex-col">
              <span>I hereby declare that the information provided is true and correct.</span>
              <span>I agree to follow all rules and regulations of the organization during the internship.</span>
            </label>
          </div>
          {fieldErrors.declare && <p className="text-sm text-red-600">{fieldErrors.declare}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 rounded-lg font-semibold transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.primary, color: COLORS.surface }}
            onMouseOver={e => status !== "submitting" && (e.currentTarget.style.backgroundColor = COLORS.secondary)}
            onMouseOut={e => status !== "submitting" && (e.currentTarget.style.backgroundColor = COLORS.primary)}
          >
            {status === "submitting" ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
      </div>
    </section>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-semibold mb-1" style={{ color: "#2D2D2D" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
}
