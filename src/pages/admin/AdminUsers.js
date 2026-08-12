import { useState } from "react";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import { AdminPageHeader, COLORS } from "../../components/admin/AdminUI";

const PAGE_SIZE = 20;

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const { data: usersPage, loading, error, retry } = useFetch(
    () => api.get(`/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=${PAGE_SIZE}`),
    [search, page]
  );
  const users = usersPage?.items || usersPage || [];
  const hasMore = usersPage?.hasMore ?? users.length === PAGE_SIZE;

  const { data: detail, loading: detailLoading } = useFetch(
    () => (selectedId ? api.get(`/admin/users/${selectedId}`) : Promise.resolve(null)),
    [selectedId]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div>
      <AdminPageHeader title="Users" />

      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-3 max-w-md">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-lg p-2.5 flex-1 outline-none text-sm"
          style={{ border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary }}
        />
        <button type="submit" className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: COLORS.primary, color: COLORS.surface }}>
          Search
        </button>
      </form>

      {loading && <SkeletonLines count={6} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && users.length === 0 && <EmptyState message="No users found." />}

      {!loading && !error && users.length > 0 && (
        <>
          <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: COLORS.background }}>
                  {["Name", "Email", "Phone", "Joined", ""].map((h) => (
                    <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                    <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{u.name}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>{u.email}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>{u.phone}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>
                      {u.joinedAt || u.createdAt ? new Date(u.joinedAt || u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelectedId(u.id || u._id)} className="font-semibold hover:underline" style={{ color: COLORS.primary }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-lg font-semibold disabled:opacity-40" style={{ background: COLORS.primary, color: COLORS.surface }}>
              Previous
            </button>
            <span style={{ color: COLORS.secondary }}>Page {page}</span>
            <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-lg font-semibold disabled:opacity-40" style={{ background: COLORS.primary, color: COLORS.surface }}>
              Next
            </button>
          </div>
        </>
      )}

      {/* Detail drawer */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelectedId(null)}>
          <div className="w-full max-w-md h-full overflow-y-auto p-6" style={{ background: COLORS.surface }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedId(null)} className="mb-4 text-sm font-semibold" style={{ color: COLORS.primary }}>
              ← Close
            </button>
            {detailLoading && <SkeletonLines count={5} />}
            {!detailLoading && detail && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-serif" style={{ color: COLORS.primary }}>{detail.name}</h2>
                  <p style={{ color: COLORS.textSecondary }}>{detail.email}</p>
                  <p style={{ color: COLORS.textSecondary }}>{detail.phone}</p>
                </div>
                {detail.donationSummary && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: COLORS.secondary }}>Donation Summary</h3>
                    <p style={{ color: COLORS.textPrimary }}>
                      ₹{Number(detail.donationSummary.total || 0).toLocaleString("en-IN")} across {detail.donationSummary.count || 0} donations
                    </p>
                  </div>
                )}
                {detail.certificateRequests && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: COLORS.secondary }}>Certificate Requests</h3>
                    <ul className="space-y-1 text-sm">
                      {detail.certificateRequests.map((r) => (
                        <li key={r.id || r._id} style={{ color: COLORS.textPrimary }}>
                          {r.details?.slice(0, 60)} — <span className="capitalize">{r.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
