import { useState } from "react";
import { api, ApiError, UPLOAD_URL } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";

// Counter fields: title, count, order, image, suffix (see counter.controller.js)
const emptyForm = {
  title: "", count: "", order: "", image: null, suffix: "",
};

function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

export default function AdminCounters() {
  // Fetch counters: backend returns { counters: [...] }
  const { data, loading, error, retry } = useFetch(() => api.get("/counters"), []);
  const counters = Array.isArray(data)
    ? data
    : Array.isArray(data?.counters)
      ? data.counters
      : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // counter being edited, or null for create
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const confirm = useConfirm();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setBanner("");
    setModalOpen(true);
  };
  const openEdit = (counter) => {
    setEditing(counter);
    setForm({
      title: counter.title || "",
      count: counter.count ?? "",
      order: counter.order ?? "",
      image: null,
      suffix: counter.suffix ?? "",
    });
    setBanner("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!form.title.trim() || (editing == null && !form.image)) {
      setBanner("Title and image are required.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      // Allow decimal for count (do not round/parseInt etc, just String the value)
      if (form.count !== "") fd.append("count", String(form.count));
      if (form.order !== "") fd.append("order", String(Number(form.order)));
      if (form.image) fd.append("image", form.image);
      if (form.suffix !== "") fd.append("suffix", form.suffix);

      if (editing) {
        // PUT /counters/:id
        await api.putForm(`/counters/${editing._id || editing.id}`, fd);
      } else {
        // POST /counters
        await api.postForm("/counters", fd);
      }
      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (counter) => {
    confirm.ask(`Delete counter "${counter.title}"?`, async () => {
      try {
        await api.del(`/counters/${counter._id || counter.id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Counters"
        action={<PrimaryButton onClick={openCreate}>New Counter</PrimaryButton>}
      />

      {loading && <SkeletonLines count={5} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && counters.length === 0 && <EmptyState message="No counters found." />}

      {!loading && !error && counters.length > 0 && (
        <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: COLORS.background }}>
                {["Image", "Title", "Count", "Order", "Suffix", "Actions"].map((h) => (
                  <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {counters.map((c) => (
                <tr key={c._id || c.id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                  <td className="p-4">
                    {c.image ? (
                      <img
                        src={getFullImageUrl(c.image)}
                        alt={c.title}
                        className="w-16 h-12 object-cover rounded-md border"
                        style={{ borderColor: COLORS.accent }}
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-md border flex items-center justify-center text-xs" style={{ borderColor: COLORS.accent, color: COLORS.textSecondary }}>
                        —
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{c.title}</td>
                  <td className="p-4" style={{ color: COLORS.textSecondary }}>{c.count ?? "—"}</td>
                  <td className="p-4" style={{ color: COLORS.textSecondary }}>{c.order ?? "—"}</td>
                  <td className="p-4" style={{ color: COLORS.textSecondary }}>{c.suffix ?? "—"}</td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => openEdit(c)} className="font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
                    <button onClick={() => handleDelete(c)} className="font-semibold hover:underline text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Counter" : "New Counter"} onClose={() => setModalOpen(false)} wide>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </FormField>
          <FormField label="Count">
            <input
              type="number"
              min={0}
              step="any" // allow decimals
              value={form.count}
              onChange={(e) => setForm({ ...form, count: e.target.value })}
              className={inputClass}
              style={inputStyle}
              inputMode="decimal"
              pattern="^\d*\.?\d*$"
            />
          </FormField>
          <FormField label="Order">
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className={inputClass}
              style={inputStyle}
              inputMode="numeric"
              pattern="\d*"
            />
          </FormField>
          <FormField label="Suffix">
            <input
              type="text"
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </FormField>
          <FormField label={editing ? "Image (leave blank to keep current)" : "Image"} required={!editing}>
            {editing && editing.image && (
              <img
                src={getFullImageUrl(editing.image)}
                alt={editing.title}
                className="w-24 h-16 object-cover rounded-md border mb-2"
                style={{ borderColor: COLORS.accent }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
              className={inputClass}
              style={inputStyle}
            />
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