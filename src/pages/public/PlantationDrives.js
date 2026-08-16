// import { FaMapMarkerAlt, FaTree, FaUsers } from "react-icons/fa";
// import { api } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
// import { useEffect } from "react";

// const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

// // Helper to prefix image URLs (if not already absolute)
// function getImageUrl(imagePath) {
//   if (!imagePath) return "";
//   if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute
//   return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
// }

// // Theme color palette
// const COLORS = {
//   primary: "#E76F51",
//   secondary: "#F4A261",
//   accent: "#E9C46A",
//   background: "#FDF6EC",
//   surface: "#FFFFFF",
//   textPrimary: "#2D2D2D",
//   textSecondary: "#6B6B6B",
// };

// export default function PlantationDrives() {
//   const { data: blogsPage, loading, error, retry } = useFetch(
//     () => api.get("/blogs?page=1&limit=9", { auth: false }),
//     []
//   );
//   // The backend returns { blogs, pagination }
//   const drives = blogsPage?.blogs || [];

//   // Log the fetched data when it changes
//   useEffect(() => {
//     console.log("Fetched blogsPage:", blogsPage);
//   }, [blogsPage]);

//   return (
//     <section className="pt-20" style={{ backgroundColor: COLORS.background }}>
//       {/* HERO */}
//       <div
//         className="relative text-white py-20 text-center px-6"
//         style={{
//           backgroundColor: COLORS.primary,
//           backgroundImage: `linear-gradient(rgba(231,111,81,0.54),rgba(244,162,97,0.44)), url('${getImageUrl("/assets/Img1.jpeg")}')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{ background: `linear-gradient(rgba(231, 111, 81, 0.28), rgba(233, 196, 106,0.44))`, zIndex: 0 }}
//         ></div>
//         <div className="relative z-10">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: COLORS.surface }}>
//             Plantation Drives by The Vanrang Foundation
//           </h1>
//           <h2 className="text-xl md:text-2xl font-medium mb-2 font-serif" style={{ color: COLORS.accent }}>
//             One World One Family
//           </h2>
//           <p className="max-w-2xl mx-auto opacity-90 md:text-lg mt-4" style={{ color: COLORS.surface }}>
//             United for a greener India: organizing plantation drives to restore nature, empower
//             youth, and create eco-aware communities. Every tree by The Vanrang Foundation is a step
//             towards a sustainable tomorrow.
//           </p>
//         </div>
//       </div>

//       {/* DRIVE TYPES (static — not backed by an endpoint, kept as-is) */}
//       <div className="max-w-7xl mx-auto py-20 px-6">
//         <h2 className="text-3xl font-bold text-center mb-14 font-serif" style={{ color: COLORS.primary }}>
//           Our Focus Areas
//         </h2>
//         <div className="grid md:grid-cols-3 gap-10 text-center">
//           {[
//             { title: "School Plantation Programs", desc: "Inspiring young minds to nurture the planet—hands-on tree plantation and environmental education in schools." },
//             { title: "Rural Greening Initiatives", desc: "Reviving biodiversity in rural communities and supporting sustainable livelihoods through afforestation." },
//             { title: "Community Urban Drives", desc: "Community volunteers transform parks and public lands, promoting green urban environments and awareness." },
//           ].map((f) => (
//             <div key={f.title} className="p-8 rounded-xl shadow border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
//               <h3 className="text-xl font-semibold mb-3 font-serif" style={{ color: COLORS.primary }}>{f.title}</h3>
//               <p style={{ color: COLORS.secondary }}>{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* DRIVES LIST — live from GET /blogs */}
//       <div className="max-w-7xl mx-auto pb-20 px-6">
//         <h2 className="text-3xl font-bold text-center mb-14 font-serif" style={{ color: COLORS.primary }}>
//           Recent Plantation Drives
//         </h2>

//         {loading && <SkeletonGrid count={6} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" />}
//         {!loading && error && <ErrorState onRetry={retry} />}
//         {!loading && !error && drives.length === 0 && <EmptyState message="No plantation drive stories published yet." />}

//         {!loading && !error && drives.length > 0 && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {drives.map((drive) => (
//               <div
//                 key={drive.id || drive._id || drive.slug}
//                 className="rounded-xl shadow overflow-hidden border block"
//                 style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}
//               >
//                 {drive.coverImage && (
//                   <img
//                     src={getImageUrl(drive.coverImage)}
//                     alt={drive.title}
//                     className="h-56 w-full object-cover"
//                     style={{ backgroundColor: COLORS.accent }}
//                     loading="lazy"
//                   />
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-4 font-serif" style={{ color: COLORS.primary }}>
//                     {drive.title}
//                   </h3>
//                   <div className="space-y-2 text-sm mb-5">
//                     {drive.location && (
//                       <div className="flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
//                         <FaMapMarkerAlt size={16} style={{ color: COLORS.secondary }} />
//                         <span>{drive.location}</span>
//                       </div>
//                     )}
//                     {drive.treesPlanted != null && (
//                       <div className="flex items-center gap-2" style={{ color: COLORS.secondary }}>
//                         <FaTree size={16} style={{ color: COLORS.primary }} />
//                         <span>{drive.treesPlanted} Trees Planted</span>
//                       </div>
//                     )}
//                     {drive.volunteers != null && (
//                       <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
//                         <FaUsers size={16} style={{ color: COLORS.accent }} />
//                         <span>{drive.volunteers} Volunteers</span>
//                       </div>
//                     )}
//                   </div>
//                   {/* RICH TEXT BLOG CONTENT */}
//                   {drive.content && (
//                     <div
//                       className="prose prose-lg max-w-none font-serif"
//                       style={{
//                         color: COLORS.textPrimary,
//                         backgroundColor: "transparent",
//                         wordBreak: "break-word",
//                       }}
//                       dangerouslySetInnerHTML={{ __html: drive.content }}
//                     />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* CTA (static) */}
//       <div className="py-20 text-center" style={{ backgroundColor: COLORS.primary, color: COLORS.surface }}>
//         <h2 className="text-3xl font-bold mb-4 font-serif" style={{ color: COLORS.accent }}>
//           Become a Part of Our Green Movement!
//         </h2>
//         <p className="mb-8 opacity-90 text-lg" style={{ color: COLORS.surface }}>
//           Volunteer or collaborate with The Vanrang Foundation—together, let's create greener
//           villages, schools, and cities for all.
//         </p>
//         <a
//           href="/contact"
//           className="px-8 py-3 rounded-lg font-semibold transition inline-block shadow-lg"
//           style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
//         >
//           Join as a Volunteer
//         </a>
//       </div>
//     </section>
//   );
// }


import { FaMapMarkerAlt, FaTree, FaUsers } from "react-icons/fa";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
import { useEffect } from "react";

const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

// Helper to prefix image URLs (if not already absolute)
function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute
  return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

// Theme color palette
const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

export default function PlantationDrives() {
  const { data: blogsPage, loading, error, retry } = useFetch(
    () => api.get("/blogs?page=1&limit=9", { auth: false }),
    []
  );
  // The backend returns { blogs, pagination }
  const drives = blogsPage?.blogs || [];

  // Log the fetched data when it changes
  useEffect(() => {
    console.log("Fetched blogsPage:", blogsPage);
  }, [blogsPage]);

  return (
    <section className="pt-20" style={{ backgroundColor: COLORS.background }}>
      {/* HERO */}
      <div
        className="relative text-white py-20 text-center px-6"
        style={{
          backgroundColor: COLORS.primary,
          backgroundImage: `linear-gradient(rgba(231,111,81,0.54),rgba(244,162,97,0.44)), url('${getImageUrl("/assets/Img1.jpeg")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(rgba(231, 111, 81, 0.28), rgba(233, 196, 106,0.44))`, zIndex: 0 }}
        ></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: COLORS.surface }}>
            Plantation Drives by The Vanrang Foundation
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-2 font-serif" style={{ color: COLORS.accent }}>
            One World One Family
          </h2>
          <p className="max-w-2xl mx-auto opacity-90 md:text-lg mt-4" style={{ color: COLORS.surface }}>
            United for a greener India: organizing plantation drives to restore nature, empower
            youth, and create eco-aware communities. Every tree by The Vanrang Foundation is a step
            towards a sustainable tomorrow.
          </p>
        </div>
      </div>

      {/* DRIVE TYPES (static — not backed by an endpoint, kept as-is) */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-14 font-serif" style={{ color: COLORS.primary }}>
          Our Focus Areas
        </h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            { title: "School Plantation Programs", desc: "Inspiring young minds to nurture the planet—hands-on tree plantation and environmental education in schools." },
            { title: "Rural Greening Initiatives", desc: "Reviving biodiversity in rural communities and supporting sustainable livelihoods through afforestation." },
            { title: "Community Urban Drives", desc: "Community volunteers transform parks and public lands, promoting green urban environments and awareness." },
          ].map((f) => (
            <div key={f.title} className="p-8 rounded-xl shadow border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
              <h3 className="text-xl font-semibold mb-3 font-serif" style={{ color: COLORS.primary }}>{f.title}</h3>
              <p style={{ color: COLORS.secondary }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DRIVES LIST — live from GET /blogs */}
      <div className="max-w-7xl mx-auto pb-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-14 font-serif" style={{ color: COLORS.primary }}>
          Recent Plantation Drives
        </h2>

        {loading && <SkeletonGrid count={6} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" />}
        {!loading && error && <ErrorState onRetry={retry} />}
        {!loading && !error && drives.length === 0 && <EmptyState message="No plantation drive stories published yet." />}

        {!loading && !error && drives.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {drives.map((drive) => (
              <div
                key={drive.id || drive._id || drive.slug}
                className="rounded-xl shadow overflow-hidden border block"
                style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}
              >
                {drive.coverImage && (
                  <img
                    src={getImageUrl(drive.coverImage)}
                    alt={drive.title}
                    className="h-56 w-full object-cover"
                    style={{ backgroundColor: COLORS.accent }}
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 font-serif" style={{ color: COLORS.primary }}>
                    {drive.title}
                  </h3>
                  <div className="space-y-2 text-sm mb-5">
                    {drive.location && (
                      <div className="flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
                        <FaMapMarkerAlt size={16} style={{ color: COLORS.secondary }} />
                        <span>{drive.location}</span>
                      </div>
                    )}
                    {drive.treesPlanted != null && (
                      <div className="flex items-center gap-2" style={{ color: COLORS.secondary }}>
                        <FaTree size={16} style={{ color: COLORS.primary }} />
                        <span>{drive.treesPlanted} Trees Planted</span>
                      </div>
                    )}
                    {drive.volunteers != null && (
                      <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
                        <FaUsers size={16} style={{ color: COLORS.accent }} />
                        <span>{drive.volunteers} Volunteers</span>
                      </div>
                    )}
                  </div>
                  {/* RICH TEXT BLOG CONTENT */}
                  {drive.content && (
                    <div
                      className="prose prose-lg max-w-none font-serif"
                      style={{
                        color: COLORS.textPrimary,
                        backgroundColor: "transparent",
                        wordBreak: "break-word",
                      }}
                      dangerouslySetInnerHTML={{ __html: drive.content }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA (static) */}
      <div className="py-20 text-center" style={{ backgroundColor: COLORS.primary, color: COLORS.surface }}>
        <h2 className="text-3xl font-bold mb-4 font-serif" style={{ color: COLORS.accent }}>
          Become a Part of Our Green Movement!
        </h2>
        <p className="mb-8 opacity-90 text-lg" style={{ color: COLORS.surface }}>
          Volunteer or collaborate with The Vanrang Foundation—together, let's create greener
          villages, schools, and cities for all.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="px-8 py-3 rounded-lg font-semibold transition inline-block shadow-lg"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            Join as a Volunteer
          </a>
          <a
            href="/donate"
            className="px-8 py-3 rounded-lg font-semibold transition inline-block shadow-lg"
            style={{ backgroundColor: COLORS.surface, color: COLORS.primary }}
          >
            Donate Now
          </a>
        </div>
      </div>
    </section>
  );
}