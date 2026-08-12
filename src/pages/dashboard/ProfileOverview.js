import { useEffect } from "react";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, ErrorState } from "../../components/common/DataStates";
import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";

// Handle different possible server response shapes for array endpoints
function getArrayFromApiResponse(data) {
  if (Array.isArray(data)) return data;
  if (data?.donations && Array.isArray(data.donations)) return data.donations;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

// For /auth/me: support { user: ... } wrapper as per context
function getUserFromApiResponse(data) {
  if (!data) return null;
  if (data.user) return data.user;
  return data;
}

export default function ProfileOverview() {
  const { data: meRaw, loading: loadingMe, error: errorMe, retry: retryMe } = useFetch(
    () => api.get("/auth/me"),
    []
  );
  const { data: donationsRaw, loading: loadingDonations } = useFetch(() => api.get("/donations/me"), []);
  const { data: certRequestsRaw, loading: loadingRequests } = useFetch(
    () => api.get("/certificate-requests/me"),
    []
  );

  // Derive user from /auth/me (handles both flat and { user: ... } shape)
  const me = getUserFromApiResponse(meRaw);

  // Log fetched data for debugging
  useEffect(() => {
    if (meRaw) {
      console.log("Fetched profile data (/auth/me):", meRaw);
    }
  }, [meRaw]);

  useEffect(() => {
    if (donationsRaw) {
      console.log("Fetched donations data (/donations/me):", donationsRaw);
    }
  }, [donationsRaw]);

  useEffect(() => {
    if (certRequestsRaw) {
      console.log("Fetched certificate requests data (/certificate-requests/me):", certRequestsRaw);
    }
  }, [certRequestsRaw]);

  if (errorMe) return <ErrorState onRetry={retryMe} message="Couldn't load your profile." />;

  const donations = getArrayFromApiResponse(donationsRaw);
  const certRequests = getArrayFromApiResponse(certRequestsRaw);

  const totalDonated = donations
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-10">
      <div
        className="rounded-2xl shadow-lg p-8 border-t-8"
        style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.primary }}
      >
        <h2 className="text-xl font-bold mb-5 font-serif" style={{ color: COLORS.primary }}>
          Profile
        </h2>
        {loadingMe ? (
          <SkeletonLines count={4} />
        ) : (
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <ProfileField label="Name" value={me?.name} />
            <ProfileField label="Email" value={me?.email} />
            <ProfileField label="Phone" value={me?.phone} />
            {me?.memberSince && (
              <ProfileField
                label="Member Since"
                value={new Date(me.memberSince).toLocaleDateString()}
              />
            )}
          </dl>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <SummaryCard
          label="Total Donated"
          value={loadingDonations ? "…" : `₹${totalDonated.toLocaleString("en-IN")}`}
        />
        <SummaryCard
          label="Certificate Requests"
          value={loadingRequests ? "…" : certRequests.length}
        />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-semibold" style={{ color: COLORS.secondary }}>
        {label}
      </dt>
      <dd style={{ color: COLORS.textPrimary }}>{value || "—"}</dd>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      className="rounded-2xl shadow p-6 text-center border"
      style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}
    >
      <div className="text-3xl font-bold font-serif" style={{ color: COLORS.primary }}>
        {value}
      </div>
      <div className="text-sm mt-1 font-medium" style={{ color: COLORS.secondary }}>
        {label}
      </div>
    </div>
  );
}
