import { useState, useEffect } from "react";
import { api, ApiError, BASE_URL, getToken } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";

// Defensive utility to always get a flat array of donations
function getArrayFromApiResponse(data) {
  if (Array.isArray(data)) return data;
  if (data?.donations && Array.isArray(data.donations)) return data.donations;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

const STATUS_STYLES = {
  paid: { bg: "#E8F5E1", fg: "#3F7A2E" },
  pending: { bg: "#FFF3DE", fg: "#B3801F" },
  failed: { bg: "#FBEAE6", fg: "#B3401F" },
};

export default function DonationHistory() {
  const { data: donationsRaw, loading, error, retry } = useFetch(() => api.get("/donations/me"), []);
  const donations = getArrayFromApiResponse(donationsRaw);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const navigate = useNavigate();
  const [checkingId, setCheckingId] = useState(null);


  const handleCheckStatus = async (id) => {
    setCheckingId(id);
    try {
      await api.get(`/donations/me/${id}/status`);
      retry(); // re-fetch the list so the row reflects the latest status
    } catch (err) {
      setDownloadError("Couldn't check payment status. Please try again.");
    } finally {
      setCheckingId(null);
    }
  };


  // Log fetched donation data for debugging
  useEffect(() => {
    if (donationsRaw) {
      console.log("Fetched donations data (/donations/me):", donationsRaw);
    }
  }, [donationsRaw]);

  const handleReceipt = async (id) => {
    setDownloadError("");
    setDownloadingId(id);
    try {
      // GET /donations/me/:id/receipt returns a PDF, not JSON — bypass the
      // envelope-parsing client wrapper and fetch it directly with auth header.
      const res = await fetch(`${BASE_URL}/donations/me/${id}/receipt`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new ApiError("Couldn't generate the receipt. Please try again.", { status: res.status });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setDownloadError(err instanceof ApiError ? err.message : "Couldn't download the receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-8 border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
        <SkeletonLines count={5} />
      </div>
    );
  }
  if (error) return <ErrorState onRetry={retry} message="Couldn't load your donation history." />;

  if (!donations || donations.length === 0) {
    return (
      <EmptyState
        message="No donations yet — support our mission"
        action={
          <a
            href="/donate"
            className="inline-block px-6 py-3 rounded-lg font-semibold shadow"
            style={{ background: COLORS.primary, color: COLORS.surface }}
          >
            Donate Now
          </a>
        }
      />
    );
  }

  return (
    <div className="rounded-2xl shadow border overflow-x-auto" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
      {downloadError && (
        <div className="m-4 rounded-lg p-3 text-sm font-medium" style={{ background: "#FBEAE6", color: "#B3401F" }}>
          {downloadError}
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ background: COLORS.background }}>
            {["Date", "Amount", "Method", "Status", "Receipt"].map((h) => (
              <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => {
            const style = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
            return (
              <tr key={d.id || d._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                <td className="p-4" style={{ color: COLORS.textPrimary }}>
                  {d.date ? new Date(d.date).toLocaleDateString() : "—"}
                </td>
                <td className="p-4 font-semibold" style={{ color: COLORS.textPrimary }}>
                  ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-4 capitalize" style={{ color: COLORS.textSecondary }}>
                  {d.method}
                </td>
                <td className="p-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{ background: style.bg, color: style.fg }}
                  >
                    {d.status}
                  </span>
                </td>

<td className="p-4">
  {d.status === "paid" && (
    <button onClick={() => navigate(`/donations/${d.id || d._id}/receipt`)}
      className="text-sm font-semibold hover:underline" style={{ color: COLORS.primary }}>
      View / Download
    </button>
  )}
  {d.status === "pending" && (
    <button onClick={() => handleCheckStatus(d.id || d._id)} disabled={checkingId === (d.id || d._id)}
      className="text-sm font-semibold hover:underline disabled:opacity-50" style={{ color: COLORS.textSecondary }}>
      {checkingId === (d.id || d._id) ? "Checking…" : "Check status"}
    </button>
  )}
  {d.status === "failed" && <span style={{ color: COLORS.textSecondary }}>—</span>}
</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
