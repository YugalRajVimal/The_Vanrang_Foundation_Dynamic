// import { api } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonGrid, ErrorState } from "../../components/common/DataStates";
// import { AdminPageHeader, COLORS } from "../../components/admin/AdminUI";

// export default function AdminHome() {
//   // userCount may be an object or a primitive; ensure we always use a primitive for rendering
//   const { data: userCount, loading: l1, error: e1, retry: r1 } = useFetch(
//     () => api.get("/admin/users/count"),
//     []
//   );
//   const { data: pendingRequests, loading: l2 } = useFetch(
//     () => api.get("/certificate-requests?status=pending"),
//     []
//   );
//   const { data: donations, loading: l3 } = useFetch(() => api.get("/donations"), []);

//   const loading = l1 || l2 || l3;
//   const donationList = Array.isArray(donations) ? donations : [];
//   const totalDonations = donationList
//     .filter((d) => d.status === "paid")
//     .reduce((sum, d) => sum + (d.amount || 0), 0);

//   // Defensive: get value for user count display (must NOT be an object)
//   const totalUserCount = 
//     typeof userCount === "number"
//       ? userCount
//       : (userCount && typeof userCount.count === "number"
//           ? userCount.count
//           : (typeof userCount?.total === "number" ? userCount.total : (userCount != null ? String(userCount) : "—"))
//         );

//   // Defensive: show count or fallback gracefully for pendingRequests
//   const pendingCount = Array.isArray(pendingRequests)
//     ? pendingRequests.length
//     : (typeof pendingRequests === "object" && typeof pendingRequests?.count === "number"
//         ? pendingRequests.count
//         : (typeof pendingRequests === "number"
//             ? pendingRequests
//             : "—"
//           )
//       );

//   return (
//     <div>
//       <AdminPageHeader title="Overview" />
//       {e1 && <ErrorState onRetry={r1} message="Couldn't load stats." />}
//       {loading && !e1 && <SkeletonGrid count={3} className="grid sm:grid-cols-3 gap-6" />}
//       {!loading && !e1 && (
//         <div className="grid sm:grid-cols-3 gap-6">
//           <StatCard label="Total Users" value={totalUserCount} />
//           <StatCard label="Pending Certificate Requests" value={pendingCount} />
//           <StatCard label="Total Donations (Paid)" value={`₹${totalDonations.toLocaleString("en-IN")}`} />
//         </div>
//       )}
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="rounded-2xl shadow p-6 text-center border" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
//       <div className="text-3xl font-bold font-serif" style={{ color: COLORS.primary }}>
//         {/* Defensive render: avoid rendering objects */}
//         {typeof value === "object" ? "—" : value}
//       </div>
//       <div className="text-sm mt-1 font-medium" style={{ color: COLORS.secondary }}>
//         {label}
//       </div>
//     </div>
//   );
// }

import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, ErrorState } from "../../components/common/DataStates";
import { AdminPageHeader, COLORS } from "../../components/admin/AdminUI";

export default function AdminHome() {
  // userCount may be an object or a primitive; ensure we always use a primitive for rendering
  const { data: userCount, loading: l1, error: e1, retry: r1 } = useFetch(
    () => api.get("/admin/users/count"),
    []
  );
  const { data: pendingRequestsData, loading: l2 } = useFetch(
    () => api.get("/certificate-requests?status=pending"),
    []
  );
  const { data: donationsData, loading: l3 } = useFetch(() => api.get("/donations"), []);

  const loading = l1 || l2 || l3;

  // Support { requests: [...] }, { items: [...] }, or a bare array response
  const pendingRequestsList = pendingRequestsData?.requests || pendingRequestsData?.items || (Array.isArray(pendingRequestsData) ? pendingRequestsData : null);
  // Support { donations: [...] }, { items: [...] }, or a bare array response
  const donationList = donationsData?.donations || donationsData?.items || (Array.isArray(donationsData) ? donationsData : []);

  const totalDonations = donationList
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  // Defensive: get value for user count display (must NOT be an object)
  const totalUserCount = 
    typeof userCount === "number"
      ? userCount
      : (userCount && typeof userCount.count === "number"
          ? userCount.count
          : (typeof userCount?.total === "number" ? userCount.total : (userCount != null ? String(userCount) : "—"))
        );

  // Defensive: show count or fallback gracefully for pendingRequests
  const pendingCount = Array.isArray(pendingRequestsList)
    ? pendingRequestsList.length
    : (typeof pendingRequestsData === "object" && typeof pendingRequestsData?.count === "number"
        ? pendingRequestsData.count
        : (typeof pendingRequestsData === "number"
            ? pendingRequestsData
            : "—"
          )
      );

  return (
    <div>
      <AdminPageHeader title="Overview" />
      {e1 && <ErrorState onRetry={r1} message="Couldn't load stats." />}
      {loading && !e1 && <SkeletonGrid count={3} className="grid sm:grid-cols-3 gap-6" />}
      {!loading && !e1 && (
        <div className="grid sm:grid-cols-3 gap-6">
          <StatCard label="Total Users" value={totalUserCount} />
          <StatCard label="Pending Certificate Requests" value={pendingCount} />
          <StatCard label="Total Donations (Paid)" value={`₹${totalDonations.toLocaleString("en-IN")}`} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl shadow p-6 text-center border" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
      <div className="text-3xl font-bold font-serif" style={{ color: COLORS.primary }}>
        {/* Defensive render: avoid rendering objects */}
        {typeof value === "object" ? "—" : value}
      </div>
      <div className="text-sm mt-1 font-medium" style={{ color: COLORS.secondary }}>
        {label}
      </div>
    </div>
  );
}