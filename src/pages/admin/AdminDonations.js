// import { useState } from "react";
// import { api, ApiError } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
// import { AdminPageHeader, PrimaryButton, Modal, FormField, inputClass, inputStyle, COLORS } from "../../components/admin/AdminUI";

// const STATUS_STYLES = {
//   paid: { bg: "#E8F5E1", fg: "#3F7A2E" },
//   pending: { bg: "#FFF3DE", fg: "#B3801F" },
//   failed: { bg: "#FBEAE6", fg: "#B3401F" },
// };

// const emptyForm = { donorName: "", donorEmail: "", amount: "", date: "", method: "bank transfer", notes: "" };

// export default function AdminDonations() {
//   const [statusFilter, setStatusFilter] = useState("all");
//   const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
//   const { data: donations, loading, error, retry } = useFetch(() => api.get(`/donations${query}`), [statusFilter]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [banner, setBanner] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBanner("");
//     if (!form.donorName.trim() || !form.amount || !form.date || !form.method) {
//       setBanner("Donor, amount, date, and method are required.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await api.post("/donations/manual", {
//         donor: { name: form.donorName, email: form.donorEmail || undefined },
//         amount: Number(form.amount),
//         date: form.date,
//         method: form.method,
//         notes: form.notes || undefined,
//       });
//       setModalOpen(false);
//       setForm(emptyForm);
//       retry();
//     } catch (err) {
//       setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <AdminPageHeader
//         title="Donations"
//         action={<PrimaryButton onClick={() => setModalOpen(true)}>Log Manual Donation</PrimaryButton>}
//       />

//       <div className="flex flex-wrap gap-2 mb-6">
//         {["all", "paid", "pending", "failed"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setStatusFilter(s)}
//             className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize"
//             style={{ background: statusFilter === s ? COLORS.primary : COLORS.surface, color: statusFilter === s ? COLORS.surface : COLORS.primary, border: `1px solid ${COLORS.primary}` }}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {loading && <SkeletonLines count={5} />}
//       {!loading && error && <ErrorState onRetry={retry} />}
//       {!loading && !error && (!donations || donations.length === 0) && <EmptyState message="No donations recorded yet." />}

//       {!loading && !error && donations && donations.length > 0 && (
//         <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr style={{ background: COLORS.background }}>
//                 {["Donor", "Amount", "Date", "Method", "Status"].map((h) => (
//                   <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {donations.map((d) => {
//                 const style = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
//                 return (
//                   <tr key={d.id || d._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
//                     <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{d.donorName || d.donor?.name || "—"}</td>
//                     <td className="p-4 font-semibold" style={{ color: COLORS.textPrimary }}>₹{Number(d.amount || 0).toLocaleString("en-IN")}</td>
//                     <td className="p-4" style={{ color: COLORS.textSecondary }}>{d.date ? new Date(d.date).toLocaleDateString() : "—"}</td>
//                     <td className="p-4 capitalize" style={{ color: COLORS.textSecondary }}>{d.method}</td>
//                     <td className="p-4">
//                       <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: style.bg, color: style.fg }}>{d.status}</span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={modalOpen} title="Log Manual Donation" onClose={() => setModalOpen(false)}>
//         {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
//         <form onSubmit={handleSubmit}>
//           <FormField label="Donor Name" required>
//             <input type="text" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Donor Email (optional — leave blank if not a registered user)">
//             <input type="email" value={form.donorEmail} onChange={(e) => setForm({ ...form, donorEmail: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <div className="grid grid-cols-2 gap-3">
//             <FormField label="Amount (₹)" required>
//               <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} style={inputStyle} />
//             </FormField>
//             <FormField label="Date" required>
//               <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} style={inputStyle} />
//             </FormField>
//           </div>
//           <FormField label="Method" required>
//             <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputClass} style={inputStyle}>
//               <option value="bank transfer">Bank Transfer</option>
//               <option value="UPI">UPI</option>
//               <option value="cash">Cash</option>
//               <option value="other">Other</option>
//             </select>
//           </FormField>
//           <FormField label="Notes">
//             <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass + " h-16"} style={inputStyle} />
//           </FormField>
//           <PrimaryButton type="submit" disabled={submitting} className="w-full">
//             {submitting ? "Saving…" : "Log Donation"}
//           </PrimaryButton>
//         </form>
//       </Modal>
//     </div>
//   );
// }


import { useState } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import { AdminPageHeader, PrimaryButton, Modal, FormField, inputClass, inputStyle, COLORS } from "../../components/admin/AdminUI";

const STATUS_STYLES = {
  paid: { bg: "#E8F5E1", fg: "#3F7A2E" },
  pending: { bg: "#FFF3DE", fg: "#B3801F" },
  failed: { bg: "#FBEAE6", fg: "#B3401F" },
};

// Method enum changed to: 'online', 'bank_transfer', 'upi'
const METHOD_OPTIONS = [
  { label: "Online (Gateway)", value: "online" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "UPI", value: "upi" },
];

const emptyForm = { donorName: "", donorEmail: "", amount: "", date: "", method: "bank_transfer", notes: "" };

export default function AdminDonations() {
  const [statusFilter, setStatusFilter] = useState("all");
  const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
  const { data: donationsData, loading, error, retry } = useFetch(() => api.get(`/donations${query}`), [statusFilter]);
  // Support { donations: [...] }, { items: [...] }, or a bare array response
  const donations = donationsData?.donations || donationsData?.items || (Array.isArray(donationsData) ? donationsData : []);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!form.donorName.trim() || !form.amount || !form.date || !form.method) {
      setBanner("Donor, amount, date, and method are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/donations/manual", {
        donor: { name: form.donorName, email: form.donorEmail || undefined },
        amount: Number(form.amount),
        date: form.date,
        method: form.method,
        notes: form.notes || undefined,
      });
      setModalOpen(false);
      setForm(emptyForm);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Donations"
        action={<PrimaryButton onClick={() => setModalOpen(true)}>Log Manual Donation</PrimaryButton>}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "paid", "pending", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize"
            style={{ background: statusFilter === s ? COLORS.primary : COLORS.surface, color: statusFilter === s ? COLORS.surface : COLORS.primary, border: `1px solid ${COLORS.primary}` }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <SkeletonLines count={5} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!donations || donations.length === 0) && <EmptyState message="No donations recorded yet." />}

      {!loading && !error && donations && donations.length > 0 && (
        <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: COLORS.background }}>
                {["Donor", "Amount", "Date", "Method", "Status"].map((h) => (
                  <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => {
                const style = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
                return (
                  <tr key={d.id || d._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                    <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{d.donorName || d.donor?.name || "—"}</td>
                    <td className="p-4 font-semibold" style={{ color: COLORS.textPrimary }}>₹{Number(d.amount || 0).toLocaleString("en-IN")}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>{d.date ? new Date(d.date).toLocaleDateString() : "—"}</td>
                    <td className="p-4 capitalize" style={{ color: COLORS.textSecondary }}>
                      {/* Pretty print new enum values */}
                      {METHOD_OPTIONS.find(opt => opt.value === d.method)?.label || d.method}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: style.bg, color: style.fg }}>{d.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title="Log Manual Donation" onClose={() => setModalOpen(false)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Donor Name" required>
            <input type="text" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Donor Email (optional — leave blank if not a registered user)">
            <input type="email" value={form.donorEmail} onChange={(e) => setForm({ ...form, donorEmail: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Amount (₹)" required>
              <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} style={inputStyle} />
            </FormField>
            <FormField label="Date" required>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} style={inputStyle} />
            </FormField>
          </div>
          <FormField label="Method" required>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputClass} style={inputStyle}>
              {METHOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Notes">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass + " h-16"} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving…" : "Log Donation"}
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}