import { useState, useEffect } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";

// Handles all expected backend response shapes for array endpoints
function getArrayFromApiResponse(data) {
  if (Array.isArray(data)) return data;
  if (data?.requests && Array.isArray(data.requests)) return data.requests; // <-- updated for backend response
  if (data?.certificateRequests && Array.isArray(data.certificateRequests))
    return data.certificateRequests;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

const STATUS_STYLES = {
  pending: { bg: "#FFF3DE", fg: "#B3801F" },
  approved: { bg: "#E8F5E1", fg: "#3F7A2E" },
  rejected: { bg: "#FBEAE6", fg: "#B3401F" },
};

const initialForm = { program: "", hoursCompleted: "", details: "", supportingDocs: null };

export default function CertificateRequests() {
  const { data: requestsFromServer, loading, error, retry } = useFetch(
    () => api.get("/certificate-requests/me"),
    []
  );

  useEffect(() => {
    if (requestsFromServer) {
      console.log("Fetched certificate requests data (/certificate-requests/me):", requestsFromServer);
    }
  }, [requestsFromServer]);

  const [localRequests, setLocalRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Always produce an array, regardless of server return format or key
  const allRequests = [
    ...localRequests,
    ...getArrayFromApiResponse(requestsFromServer),
  ];

  const validate = () => {
    const errs = {};
    if (!form.details.trim()) errs.details = "Please describe your request";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      let created;
      if (form.supportingDocs) {
        const fd = new FormData();
        if (form.program) fd.append("program", form.program);
        if (form.hoursCompleted) fd.append("hoursCompleted", form.hoursCompleted);
        fd.append("details", form.details);
        fd.append("supportingDocs", form.supportingDocs);
        created = await api.postForm("/certificate-requests", fd);
      } else {
        created = await api.post("/certificate-requests", {
          program: form.program || undefined,
          hoursCompleted: form.hoursCompleted ? Number(form.hoursCompleted) : undefined,
          details: form.details,
        });
      }
      setLocalRequests((prev) => [
        // workaround for local optimistic updates (simulate API for local-only)
        created || { ...form, status: "pending", createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setForm(initialForm);
    } catch (err) {
      setBanner(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div
        className="rounded-2xl shadow p-8 border"
        style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}
      >
        <h2
          className="text-xl font-bold mb-5 font-serif"
          style={{ color: COLORS.primary }}
        >
          Request a Certificate
        </h2>

        {banner && (
          <div
            className="rounded-lg p-3 text-sm font-medium mb-5"
            style={{ background: "#FBEAE6", color: "#B3401F" }}
          >
            {banner}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              className="block font-semibold mb-1"
              style={{ color: COLORS.textPrimary }}
            >
              Program
            </label>
            <input
              type="text"
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
              placeholder="e.g. Volunteer Program, Internship"
              className="rounded-lg p-3 w-full outline-none"
              style={{
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.textPrimary,
              }}
            />
          </div>

          <div>
            <label
              className="block font-semibold mb-1"
              style={{ color: COLORS.textPrimary }}
            >
              Hours Completed
            </label>
            <input
              type="number"
              min="0"
              value={form.hoursCompleted}
              onChange={(e) =>
                setForm({ ...form, hoursCompleted: e.target.value })
              }
              className="rounded-lg p-3 w-full outline-none"
              style={{
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.textPrimary,
              }}
            />
          </div>

          <div>
            <label
              className="block font-semibold mb-1"
              style={{ color: COLORS.textPrimary }}
            >
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Describe what you'd like the certificate to cover"
              className="rounded-lg p-3 w-full outline-none h-24"
              style={{
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.textPrimary,
              }}
            />
            {fieldErrors.details && (
              <p className="text-sm mt-1 text-red-600">{fieldErrors.details}</p>
            )}
          </div>

          <div>
            <label
              className="block font-semibold mb-1"
              style={{ color: COLORS.textPrimary }}
            >
              Supporting Documents (optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setForm({
                  ...form,
                  supportingDocs: e.target.files?.[0] || null,
                })
              }
              className="rounded-lg p-2 w-full outline-none"
              style={{
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.textPrimary,
                background: COLORS.surface,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: COLORS.primary, color: COLORS.surface }}
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </form>
      </div>

      <div>
        <h2
          className="text-xl font-bold mb-5 font-serif"
          style={{ color: COLORS.primary }}
        >
          Your Requests
        </h2>

        {loading && <SkeletonLines count={4} />}
        {!loading && error && (
          <ErrorState onRetry={retry} message="Couldn't load your requests." />
        )}
        {!loading && !error && allRequests.length === 0 && (
          <EmptyState message="You haven't submitted any certificate requests yet." />
        )}

        {!loading && !error && allRequests.length > 0 && (
          <div className="space-y-4">
            {allRequests.map((r, i) => {
              const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
              // Date field: prefer createdAt; fallback to updatedAt; then local submittedAt
              const dateString =
                r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : r.updatedAt
                    ? new Date(r.updatedAt).toLocaleDateString()
                    : r.submittedAt
                      ? new Date(r.submittedAt).toLocaleDateString()
                      : "Just now";
              // Use proper supporting document display if present 
              return (
                <div
                  key={r.id || r._id || i}
                  className="rounded-xl shadow p-5 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.accent,
                  }}
                >
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {dateString}
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {(r.details || "").slice(0, 140)}
                      {(r.details || "").length > 140 ? "…" : ""}
                    </p>
                    {/* Show supporting docs, if any */}
                    {r.supportingDocs && (
                      <div className="mt-2">
                        <a
                          href={r.supportingDocs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold underline"
                          style={{ color: COLORS.secondary }}
                        >
                          View Uploaded Document
                        </a>
                      </div>
                    )}
                    {r.status === "rejected" && r.reason && (
                      <p className="text-sm mt-1" style={{ color: "#B3401F" }}>
                        Reason: {r.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{ background: style.bg, color: style.fg }}
                    >
                      {r.status}
                    </span>
                    {r.status === "approved" && r.certificateUrl && (
                      <a
                        href={r.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline"
                        style={{ color: COLORS.primary }}
                      >
                        Download Certificate
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
