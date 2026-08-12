import { useState, useEffect } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";

const UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  // avoid double slashes between prefix and url
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

export default function AdminGallery() {
  // Fetch categories as array of objects with _id and name
  const { data: catData, loading: catLoading, retry: retryCats } = useFetch(
    () => api.get("/gallery/categories", { auth: false }),
    []
  );
  const categories = catData?.categories || [];

  // Default to use _id as key and category object for state
  const [activeCat, setActiveCat] = useState(null);

  // Resolve the currently selected category object
  const cat = activeCat || (categories && categories.length > 0 ? categories[0] : null);

  // Fetch images by category _id
  const { data: imageData, loading, error, retry } = useFetch(
    () => (cat ? api.get(`/gallery?category=${encodeURIComponent(cat._id)}`, { auth: false }) : Promise.resolve(null)),
    [cat?._id]
  );
  const images = imageData?.images || [];

  // Console log fetched categories and images
  useEffect(() => {
    if (!catLoading) {
      console.log("Fetched categories:", categories);
    }
  }, [categories, catLoading]);

  useEffect(() => {
    if (!loading && cat) {
      console.log(`Fetched images for category "${cat.name}":`, images);
    }
  }, [images, loading, cat]);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ image: null, title: "" });
  const [uploadBanner, setUploadBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catBanner, setCatBanner] = useState("");

  const confirm = useConfirm();

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadBanner("");
    if (!uploadForm.image) {
      setUploadBanner("Please choose an image.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", uploadForm.image);
      // cat is the category object, send cat._id
      fd.append("category", cat._id);
      if (uploadForm.title) fd.append("title", uploadForm.title);
      await api.postForm("/gallery", fd);
      setUploadOpen(false);
      setUploadForm({ image: null, title: "" });
      retry();
    } catch (err) {
      setUploadBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewCategory = async (e) => {
    e.preventDefault();
    setCatBanner("");
    if (!newCatName.trim()) return;
    try {
      await api.post("/gallery/categories", { name: newCatName.trim() });
      setNewCatName("");
      setCatModalOpen(false);
      retryCats();
    } catch (err) {
      setCatBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  };

  const handleDeleteImage = (img) => {
    confirm.ask("Delete this image?", async () => {
      try {
        await api.del(`/gallery/${img.id || img._id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  const handleDeleteCategory = (catObj) => {
    // catObj is the category object
    confirm.ask(`Delete category "${catObj.name}"? This may remove its images too.`, async () => {
      try {
        await api.del(`/gallery/categories/${encodeURIComponent(catObj._id)}`);
        setActiveCat(null);
        retryCats();
      } catch {
        retryCats();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        action={
          <div className="flex gap-3">
            <button onClick={() => setCatModalOpen(true)} className="px-4 py-2 rounded-lg font-semibold border text-sm" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
              + New Category
            </button>
            <PrimaryButton onClick={() => setUploadOpen(true)} disabled={!cat}>Upload Image</PrimaryButton>
          </div>
        }
      />

      {/* Category tabs */}
      {!catLoading && categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4" style={{ borderColor: COLORS.accent + "55" }}>
          {categories.map((c) => (
            <div key={c._id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveCat(c)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  background: cat && cat._id === c._id ? COLORS.primary : COLORS.surface,
                  color: cat && cat._id === c._id ? COLORS.surface : COLORS.primary,
                  border: `1px solid ${COLORS.primary}`,
                }}
              >
                {c.name}
              </button>
              <button onClick={() => handleDeleteCategory(c)} className="text-xs text-red-600" title="Delete category">✕</button>
            </div>
          ))}
        </div>
      )}
      {!catLoading && (!categories || categories.length === 0) && (
        <EmptyState message="No categories yet — create one to start uploading images." />
      )}

      {cat && (
        <>
          {loading && <SkeletonGrid count={6} />}
          {!loading && error && <ErrorState onRetry={retry} />}
          {!loading && !error && (!images || images.length === 0) && <EmptyState message="No images in this category yet." />}
          {!loading && !error && images && images.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.id || img._id} className="relative group rounded-xl overflow-hidden shadow border" style={{ borderColor: COLORS.accent }}>
                  <img src={getFullImageUrl(img.image || img.url)} alt={img.title} className="w-full h-40 object-cover" />
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-red-600 font-bold shadow opacity-0 group-hover:opacity-100 transition"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={uploadOpen} title={`Upload Image — ${cat ? cat.name : ""}`} onClose={() => setUploadOpen(false)}>
        {uploadBanner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{uploadBanner}</div>}
        <form onSubmit={handleUpload}>
          <FormField label="Image" required>
            <input type="file" accept="image/*" onChange={(e) => setUploadForm({ ...uploadForm, image: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Title">
            <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Uploading…" : "Upload"}
          </PrimaryButton>
        </form>
      </Modal>

      <Modal open={catModalOpen} title="New Category" onClose={() => setCatModalOpen(false)}>
        {catBanner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{catBanner}</div>}
        <form onSubmit={handleNewCategory}>
          <FormField label="Category Name" required>
            <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className={inputClass} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" className="w-full">Create</PrimaryButton>
        </form>
      </Modal>

      <ConfirmDialog {...confirm} />
    </div>
  );
}