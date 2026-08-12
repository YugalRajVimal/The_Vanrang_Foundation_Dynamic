import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";

// --- Color palette from HeroSection.js ---
const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

// NOTE — contract gap: /team returns a flat list (photo, name, designation, description,
// order) with no field distinguishing Founder / Mentor / Inspiration from the general
// core team, unlike the previous hardcoded page which had three special-cased people.
// Until the contract adds a `featured` or `category` field, we detect these three by
// matching on `designation` client-side. Ask backend to add a `featuredRole` enum
// (founder | mentor | inspiration | null) if this heuristic proves fragile.
function splitFeatured(members) {
  const isFounder = (m) => /founder|chairman/i.test(m.designation || "");
  const isMentor = (m) => /mentor/i.test(m.designation || "");
  const isInspiration = (m) => /inspiration/i.test(m.designation || "");

  const founder = members.find(isFounder);
  const mentor = members.find(isMentor);
  const inspiration = members.find(isInspiration);
  const core = members.filter((m) => m !== founder && m !== mentor && m !== inspiration);

  return { founder, mentor, inspiration, core };
}

export default function TeamPage() {
  const [selected, setSelected] = useState(null);
  const { data: members, loading, error, retry } = useFetch(() => api.get("/team", { auth: false }), []);

  return (
    <section className="min-h-screen py-20" style={{ background: COLORS.background }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: COLORS.primary }}>
            Meet Our Team
          </h1>
          <p className="mt-3 max-w-6xl mx-auto" style={{ color: COLORS.secondary }}>
            The passionate people behind The Vanrang Foundation working together to restore
            nature and empower communities.
          </p>
        </div>

        {loading && <SkeletonGrid count={4} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10" />}
        {!loading && error && <ErrorState onRetry={retry} />}
        {!loading && !error && (!members || members.length === 0) && (
          <EmptyState message="Team members will appear here soon." />
        )}

        {!loading && !error && members && members.length > 0 && (
          <TeamContent members={members} selected={selected} setSelected={setSelected} />
        )}
      </div>
    </section>
  );
}

function TeamContent({ members, selected, setSelected }) {
  const { founder, mentor, inspiration, core } = splitFeatured(members);

  return (
    <>
      {founder && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.accent }}>
            Founder
          </h2>
          <MemberCard member={founder} large onView={() => setSelected(founder)} />
        </div>
      )}

      {(inspiration || mentor) && (
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          {inspiration && (
            <div className="mb-16 h-full">
              <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.accent }}>
                Inspiration
              </h2>
              <MemberCard member={inspiration} large showBioInline />
            </div>
          )}
          {mentor && (
            <div className="mb-16 h-full">
              <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.accent }}>
                Mentor
              </h2>
              <MemberCard member={mentor} large showBioInline />
            </div>
          )}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: COLORS.accent }}>
        Core Team
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {core.map((member) => (
          <MemberCard key={member.id || member._id} member={member} onView={() => setSelected(member)} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="rounded-xl max-w-6xl p-8 relative shadow-lg border"
            style={{ background: COLORS.surface, borderColor: COLORS.primary + "55" }}
          >
            <button
              className="absolute top-4 right-4 transition text-2xl focus:outline-none"
              onClick={() => setSelected(null)}
              aria-label="Close bio modal"
              style={{ color: COLORS.primary }}
            >
              <FaTimes />
            </button>
            <img
              src={selected.photo || selected.image}
              alt={selected.name}
              className="w-32 aspect-[1/1] rounded-full mx-auto mb-4 object-cover"
              style={{ border: "4px solid " + COLORS.accent + "44" }}
            />
            <h2 className="text-2xl font-bold text-center mb-1" style={{ color: COLORS.primary }}>
              {selected.name}
            </h2>
            <p className="text-center mb-4" style={{ color: COLORS.secondary }}>
              {selected.designation}
            </p>
            <p className="mb-4 leading-normal" style={{ color: COLORS.textPrimary }}>
              {selected.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function MemberCard({ member, large, onView, showBioInline }) {
  const size = large ? "10rem" : undefined;
  return (
    <div
      className="rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center border max-w-2xl mx-auto"
      style={{ background: COLORS.surface, borderColor: COLORS.primary + "33" }}
    >
      <img
        src={member.photo || member.image}
        alt={member.name}
        className="w-32 aspect-[1/1] rounded-full mx-auto mb-4 object-cover border-4"
        style={{ borderColor: COLORS.accent + "66", ...(size ? { width: size, height: size } : {}) }}
      />
      <h3 className="text-xl font-semibold mb-1" style={{ color: COLORS.primary }}>
        {member.name}
      </h3>
      <p className="text-sm mb-3" style={{ color: COLORS.secondary }}>
        {member.designation}
      </p>
      {showBioInline ? (
        <p style={{ color: COLORS.textPrimary }}>{member.description}</p>
      ) : (
        <button onClick={onView} className="text-sm hover:underline font-medium" style={{ color: COLORS.accent }}>
          View Bio
        </button>
      )}
    </div>
  );
}
