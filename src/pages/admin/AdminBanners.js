import { useState, useEffect } from "react";
import { api, ApiError, UPLOAD_URL } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";

// Used for new/edit form
const emptyForm = { image: null, title: "", link: "", order: "" };

// Get the upload URL prefix from env


function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  // avoid double slashes between prefix and url
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

export default function AdminBanners() {
  // The backend returns { banners: [...] }
  const { data, loading, error, retry } = useFetch(() => api.get("/banners", { auth: false }), []);
  // Defensive, support both array or envelope-form
  const banners = Array.isArray(data)
    ? data
    : Array.isArray(data?.banners)
      ? data.banners
      : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // banner being edited/replaced, or null for new
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(""); // banner message
  const [submitting, setSubmitting] = useState(false);
  const confirm = useConfirm();

  // Console log the fetched/normalized banner data for debugging


  // Open modal for create
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setBanner("");
    setModalOpen(true);
  };

  // Open modal for editing-existing
  const openEdit = (b) => {
    setEditing(b);
    setForm({ image: null, title: b.title || "", link: b.link || "", order: b.order ?? "" });
    setBanner("");
    setModalOpen(true);
  };

  // Form submit logic for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!editing && !form.image) {
      setBanner("Please choose an image.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (form.image) fd.append("image", form.image);
      if (form.title) fd.append("title", form.title);
      if (form.link) fd.append("link", form.link);
      if (form.order !== "") fd.append("order", form.order);

      if (editing) {
        await api.putForm(`/banners/${editing.id || editing._id}`, fd);
      } else {
        await api.postForm("/banners", fd);
      }
      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm dialog for delete
  const handleDelete = (b) => {
    confirm.ask(`Delete banner "${b.title || "Untitled"}"?`, async () => {
      try {
        await api.del(`/banners/${b.id || b._id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader title="Banners" action={<PrimaryButton onClick={openCreate}>Upload New</PrimaryButton>} />

      {loading && <SkeletonGrid count={4} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!banners || banners.length === 0) && <EmptyState message="No banners yet." />}
      {!loading && !error && banners && banners.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {banners.map((b) => (
            <div key={b.id || b._id} className="rounded-xl shadow border overflow-hidden" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
              <img src={getFullImageUrl(b.image)} alt={b.title || "Banner"} className="w-full h-36 object-cover" />
              <div className="p-3">
                <p className="font-semibold text-sm truncate" style={{ color: COLORS.textPrimary }}>{b.title || "Untitled"}</p>
                <p className="text-xs mb-2" style={{ color: COLORS.textSecondary }}>Order: {b.order ?? "—"}</p>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(b)} className="text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>Replace</button>
                  <button onClick={() => handleDelete(b)} className="text-xs font-semibold hover:underline text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Replace Banner" : "Upload New Banner"} onClose={() => setModalOpen(false)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Image" required={!editing}>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Title">
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Link">
            <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Order">
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving…" : "Save"}
          </PrimaryButton>
        </form>
      </Modal>

      <ConfirmDialog {...confirm} />
    </div>
  );
}
