// import { useState } from "react";
// import { api, ApiError } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
// import { AdminPageHeader, Modal, PrimaryButton, FormField, inputClass, inputStyle, COLORS } from "../../components/admin/AdminUI";

// const TABS = ["All", "Pending", "Approved", "Rejected"];
// const STATUS_STYLES = {
//   pending: { bg: "#FFF3DE", fg: "#B3801F" },
//   approved: { bg: "#E8F5E1", fg: "#3F7A2E" },
//   rejected: { bg: "#FBEAE6", fg: "#B3401F" },
// };

// export default function AdminCertificateRequests() {
//   const [tab, setTab] = useState("All");
//   const query = tab === "All" ? "" : `?status=${tab.toLowerCase()}`;
//   const { data: requests, loading, error, retry } = useFetch(() => api.get(`/certificate-requests${query}`), [tab]);

//   const [approveTarget, setApproveTarget] = useState(null);
//   const [certUrl, setCertUrl] = useState("");
//   const [rejectTarget, setRejectTarget] = useState(null);
//   const [rejectReason, setRejectReason] = useState("");
//   const [banner, setBanner] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleApprove = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setBanner("");
//     try {
//       await api.put(`/certificate-requests/${approveTarget.id || approveTarget._id}/approve`, certUrl ? { certificateUrl: certUrl } : {});
//       setApproveTarget(null);
//       setCertUrl("");
//       retry();
//     } catch (err) {
//       setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleReject = async (e) => {
//     e.preventDefault();
//     if (!rejectReason.trim()) return;
//     setSubmitting(true);
//     setBanner("");
//     try {
//       await api.put(`/certificate-requests/${rejectTarget.id || rejectTarget._id}/reject`, { reason: rejectReason });
//       setRejectTarget(null);
//       setRejectReason("");
//       retry();
//     } catch (err) {
//       setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <AdminPageHeader title="Certificate Requests" />

//       <div className="flex flex-wrap gap-2 mb-6">
//         {TABS.map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className="px-4 py-1.5 rounded-lg text-sm font-medium"
//             style={{ background: tab === t ? COLORS.primary : COLORS.surface, color: tab === t ? COLORS.surface : COLORS.primary, border: `1px solid ${COLORS.primary}` }}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {loading && <SkeletonLines count={5} />}
//       {!loading && error && <ErrorState onRetry={retry} />}
//       {!loading && !error && (!requests || requests.length === 0) && <EmptyState message="No requests here." />}

//       {!loading && !error && requests && requests.length > 0 && (
//         <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr style={{ background: COLORS.background }}>
//                 {["Requester", "Submitted", "Details", "Status", "Actions"].map((h) => (
//                   <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((r) => {
//                 const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
//                 return (
//                   <tr key={r.id || r._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
//                     <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{r.userName || r.user?.name || "—"}</td>
//                     <td className="p-4" style={{ color: COLORS.textSecondary }}>
//                       {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "—"}
//                     </td>
//                     <td className="p-4" style={{ color: COLORS.textSecondary }}>{(r.details || "").slice(0, 60)}</td>
//                     <td className="p-4">
//                       <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: style.bg, color: style.fg }}>
//                         {r.status}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       {r.status === "pending" ? (
//                         <div className="flex gap-3">
//                           <button onClick={() => setApproveTarget(r)} className="font-semibold hover:underline" style={{ color: "#3F7A2E" }}>Approve</button>
//                           <button onClick={() => setRejectTarget(r)} className="font-semibold hover:underline text-red-600">Reject</button>
//                         </div>
//                       ) : (
//                         <span style={{ color: COLORS.textSecondary }}>
//                           {r.status === "rejected" ? r.reason : "Approved"}
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={!!approveTarget} title="Approve Request" onClose={() => setApproveTarget(null)}>
//         {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
//         <form onSubmit={handleApprove}>
//           <FormField label="Certificate URL (optional — paste a link, or leave blank if attaching later)">
//             <input type="text" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} className={inputClass} style={inputStyle} />
//           </FormField>
//           <PrimaryButton type="submit" disabled={submitting} className="w-full">
//             {submitting ? "Approving…" : "Approve"}
//           </PrimaryButton>
//         </form>
//       </Modal>

//       <Modal open={!!rejectTarget} title="Reject Request" onClose={() => setRejectTarget(null)}>
//         {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
//         <form onSubmit={handleReject}>
//           <FormField label="Reason" required>
//             <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className={inputClass + " h-20"} style={inputStyle} />
//           </FormField>
//           <PrimaryButton type="submit" disabled={submitting} className="w-full">
//             {submitting ? "Rejecting…" : "Reject"}
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
import { AdminPageHeader, Modal, PrimaryButton, FormField, inputClass, inputStyle, COLORS } from "../../components/admin/AdminUI";

const TABS = ["All", "Pending", "Approved", "Rejected"];
const STATUS_STYLES = {
  pending: { bg: "#FFF3DE", fg: "#B3801F" },
  approved: { bg: "#E8F5E1", fg: "#3F7A2E" },
  rejected: { bg: "#FBEAE6", fg: "#B3401F" },
};

export default function AdminCertificateRequests() {
  const [tab, setTab] = useState("All");
  const query = tab === "All" ? "" : `?status=${tab.toLowerCase()}`;
  const { data: requestsData, loading, error, retry } = useFetch(() => api.get(`/certificate-requests${query}`), [tab]);
  // Support { requests: [...] }, { items: [...] }, or a bare array response
  const requests = requestsData?.requests || requestsData?.items || (Array.isArray(requestsData) ? requestsData : []);

  const [approveTarget, setApproveTarget] = useState(null);
  const [certUrl, setCertUrl] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBanner("");
    try {
      await api.put(`/certificate-requests/${approveTarget.id || approveTarget._id}/approve`, certUrl ? { certificateUrl: certUrl } : {});
      setApproveTarget(null);
      setCertUrl("");
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    setSubmitting(true);
    setBanner("");
    try {
      await api.put(`/certificate-requests/${rejectTarget.id || rejectTarget._id}/reject`, { reason: rejectReason });
      setRejectTarget(null);
      setRejectReason("");
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Certificate Requests" />

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: tab === t ? COLORS.primary : COLORS.surface, color: tab === t ? COLORS.surface : COLORS.primary, border: `1px solid ${COLORS.primary}` }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <SkeletonLines count={5} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!requests || requests.length === 0) && <EmptyState message="No requests here." />}

      {!loading && !error && requests && requests.length > 0 && (
        <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: COLORS.background }}>
                {["Requester", "Submitted", "Details", "Status", "Actions"].map((h) => (
                  <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
                return (
                  <tr key={r.id || r._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                    <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{r.userName || r.user?.name || "—"}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>{(r.details || "").slice(0, 60)}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: style.bg, color: style.fg }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {r.status === "pending" ? (
                        <div className="flex gap-3">
                          <button onClick={() => setApproveTarget(r)} className="font-semibold hover:underline" style={{ color: "#3F7A2E" }}>Approve</button>
                          <button onClick={() => setRejectTarget(r)} className="font-semibold hover:underline text-red-600">Reject</button>
                        </div>
                      ) : (
                        <span style={{ color: COLORS.textSecondary }}>
                          {r.status === "rejected" ? r.reason : "Approved"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!approveTarget} title="Approve Request" onClose={() => setApproveTarget(null)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleApprove}>
          <FormField label="Certificate URL (optional — paste a link, or leave blank if attaching later)">
            <input type="text" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} className={inputClass} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Approving…" : "Approve"}
          </PrimaryButton>
        </form>
      </Modal>

      <Modal open={!!rejectTarget} title="Reject Request" onClose={() => setRejectTarget(null)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleReject}>
          <FormField label="Reason" required>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className={inputClass + " h-20"} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Rejecting…" : "Reject"}
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}