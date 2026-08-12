import { useState } from "react";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";

const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
};

const PAGE_SIZE = 12;

const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute
  // Remove double slash if accidentally joined
  return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export default function PlantationGallery() {
  // Track both the active category id and name for display
  const [activeCategoryId, setActiveCategoryId] = useState(null); // null means "ALL"
  const [activeCategoryName, setActiveCategoryName] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data: categoriesRaw } = useFetch(() => api.get("/gallery/categories", { auth: false }), []);

  // Guarantee categories is always an array of { _id, name, ... }
  let categories = [];
  if (Array.isArray(categoriesRaw)) {
    categories = categoriesRaw;
  } else if (categoriesRaw && Array.isArray(categoriesRaw.categories)) {
    categories = categoriesRaw.categories;
  } else if (categoriesRaw && Array.isArray(categoriesRaw.items)) {
    categories = categoriesRaw.items;
  } else {
    categories = [];
  }

  // Only show categories with name and _id (robust mapping)
  const safeCategories = categories.filter(
    c => c && typeof c === "object" && ("name" in c) && ("_id" in c)
  );

  const { data: galleryPage, loading, error, retry } = useFetch(
    () => {
      const url = `/gallery?${activeCategoryId ? `category=${encodeURIComponent(activeCategoryId)}&` : ""}page=${page}&limit=${PAGE_SIZE}`;
      // Commented debug logs in production
      // console.log("Fetching gallery with URL:", url, "and categoryId:", activeCategoryId, "page:", page);
      return api.get(url, { auth: false }).then(result => {
        // console.log("Gallery API result:", result);
        return result;
      });
    },
    [activeCategoryId, page]
  );

  // Adapting API response that is { images: [...], pagination: {...} }
  let images = [];
  let hasMore = false;
  if (galleryPage) {
    if (Array.isArray(galleryPage.images)) {
      images = galleryPage.images;
      // If pagination total > page*limit then more exist, else not
      if (
        galleryPage.pagination &&
        typeof galleryPage.pagination === "object" &&
        typeof galleryPage.pagination.total === "number" &&
        typeof galleryPage.pagination.page === "number" &&
        typeof galleryPage.pagination.limit === "number"
      ) {
        const { page: currentPage, limit, total } = galleryPage.pagination;
        hasMore = currentPage * limit < total;
      } else {
        hasMore = images.length === PAGE_SIZE;
      }
    } else if (Array.isArray(galleryPage.items)) {
      images = galleryPage.items;
      hasMore = galleryPage.hasMore ?? images.length === PAGE_SIZE;
    } else if (Array.isArray(galleryPage)) {
      images = galleryPage;
      hasMore = images.length === PAGE_SIZE;
    }
  }

  const handleCategoryClick = (catId, catName) => {
    setActiveCategoryId(catId);
    setActiveCategoryName(catName);
    setPage(1);
  };

  return (
    <section className="py-20 pt-32 px-6" style={{ backgroundColor: COLORS.background }}>
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2
          className="text-3xl md:text-6xl font-bold mb-2 font-serif"
          style={{ color: COLORS.primary, textShadow: "0 1px 16px rgba(231,111,81,0.04)" }}
        >
          The Vanrang Foundation Gallery
        </h2>
        <p className="mt-2 max-w-2xl font-serif" style={{ color: COLORS.secondary }}>
          Inspiring change through tree plantation, community action, youth leadership, and nature
          restoration. Explore our ongoing impact across India!
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto border-t border-b py-4 mb-14" style={{ borderColor: COLORS.accent }}>
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <CategoryButton label="ALL IMAGES" active={activeCategoryId === null} onClick={() => handleCategoryClick(null, "ALL")} />
          {safeCategories.map((cat) => (
            <CategoryButton
              key={cat._id}
              label={cat.name}
              active={activeCategoryId === cat._id}
              onClick={() => handleCategoryClick(cat._id, cat.name)}
            />
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        {loading && <SkeletonGrid count={8} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" />}
        {!loading && error && <ErrorState onRetry={retry} />}
        {!loading && !error && images.length === 0 && <EmptyState message="No images in this category yet." />}
        {!loading && !error && images.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {images.map((img) => {
                // Handle new API structure: category might be object or string
                const categoryName =
                  typeof img.category === "string"
                    ? img.category
                    : img.category && typeof img.category === "object"
                    ? img.category.name
                    : "";
                return (
                  <div
                    key={img.id || img._id}
                    className="relative group overflow-hidden rounded-3xl shadow"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}` }}
                  >
                    <img
                      src={getImageUrl(img.image || img.url)}
                      alt={img.title}
                      className="w-full h-72 object-cover transition duration-500 group-hover:scale-105"
                      style={{ backgroundColor: COLORS.accent }}
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 transition flex items-end p-6 opacity-0 group-hover:opacity-100"
                      style={{ background: `rgba(231,111,81,0.86)` }}
                    >
                      <div>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-serif font-semibold"
                          style={{ background: COLORS.accent, color: COLORS.textPrimary, letterSpacing: "0.03em" }}
                        >
                          {categoryName}
                        </span>
                        {img.title && (
                          <h3 className="text-lg font-semibold mt-2 font-serif" style={{ color: COLORS.surface }}>
                            {img.title}
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(page > 1 || hasMore) && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <PageButton disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </PageButton>
                <span className="font-serif" style={{ color: COLORS.secondary }}>
                  Page {page}
                </span>
                <PageButton disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
                  Next
                </PageButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function CategoryButton({ label, active, onClick }) {
  const COLORS_LOCAL = { primary: "#E76F51", secondary: "#F4A261" };
  return (
    <button
      onClick={onClick}
      className="transition pb-1 font-serif"
      style={{
        color: active ? COLORS_LOCAL.primary : COLORS_LOCAL.secondary,
        borderBottom: active ? `2px solid ${COLORS_LOCAL.primary}` : "2px solid transparent",
        fontWeight: active ? 700 : 500,
        background: "none",
      }}
    >
      {label}
    </button>
  );
}

function PageButton({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-5 py-2 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: "#E76F51", color: "#fff" }}
    >
      {children}
    </button>
  );
}
