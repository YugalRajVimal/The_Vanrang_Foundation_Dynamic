import { useState } from "react";
import { api, ApiError, UPLOAD_URL } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";
import RichTextEditor from "../../components/RichTextEditor";

const emptyForm = {
  title: "", content: "", coverImage: null, location: "", treesPlanted: "", volunteers: "", status: "draft",
};

function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  // avoid double slashes between prefix and url
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

export default function AdminBlogs() {
  const { data: blogsPage, loading, error, retry } = useFetch(() => api.get("/blogs?page=1&limit=50"), []);
  // Support either { blogs: [...] }, { items: [...] }, or a bare array response
  const blogs = blogsPage?.blogs || blogsPage?.items || (Array.isArray(blogsPage) ? blogsPage : []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
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
  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title || "", content: blog.content || "", coverImage: null,
      location: blog.location || "", treesPlanted: blog.treesPlanted ?? "",
      volunteers: blog.volunteers ?? "", status: blog.status || "draft",
    });
    setBanner("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    const contentIsEmpty = !form.content || !form.content.replace(/<[^>]*>/g, "").trim();
    if (!form.title.trim() || contentIsEmpty || (!editing && !form.coverImage)) {
      setBanner("Title, content, and a cover image are required.");
      return;
    }
    setSubmitting(true);
    try {
      // Cover image is a file upload, so send as multipart FormData for both
      // create and edit. On edit, coverImage is optional — only append if a
      // new file was chosen, so the backend keeps the existing image otherwise.
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if (form.location) fd.append("location", form.location);
      if (form.treesPlanted !== "") fd.append("treesPlanted", String(Number(form.treesPlanted)));
      if (form.volunteers !== "") fd.append("volunteers", String(Number(form.volunteers)));
      fd.append("status", form.status);
      if (form.coverImage) fd.append("coverImage", form.coverImage);

      if (editing) {
        await api.putForm(`/blogs/${editing.id || editing._id}`, fd);
      } else {
        await api.postForm("/blogs", fd);
      }
      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (blog) => {
    confirm.ask(`Delete "${blog.title}"?`, async () => {
      try {
        await api.del(`/blogs/${blog.id || blog._id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader title="Plantation Drive Blogs" action={<PrimaryButton onClick={openCreate}>New Blog</PrimaryButton>} />

      {loading && <SkeletonLines count={5} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && blogs.length === 0 && <EmptyState message="No blog posts yet." />}

      {!loading && !error && blogs.length > 0 && (
        <div className="rounded-2xl shadow border overflow-x-auto" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: COLORS.background }}>
                {["Cover", "Title", "Status", "Last Updated", "Actions"].map((h) => (
                  <th key={h} className="p-4 font-semibold" style={{ color: COLORS.primary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id || b._id} className="border-t" style={{ borderColor: COLORS.accent + "33" }}>
                  <td className="p-4">
                    {(b.coverImage || b.image) ? (
                      <img
                        src={getFullImageUrl(b.coverImage || b.image)}
                        alt={b.title}
                        className="w-16 h-12 object-cover rounded-md border"
                        style={{ borderColor: COLORS.accent }}
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-md border flex items-center justify-center text-xs" style={{ borderColor: COLORS.accent, color: COLORS.textSecondary }}>
                        —
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium" style={{ color: COLORS.textPrimary }}>{b.title}</td>
                  <td className="p-4 capitalize" style={{ color: COLORS.textSecondary }}>{b.status}</td>
                  <td className="p-4" style={{ color: COLORS.textSecondary }}>
                    {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => openEdit(b)} className="font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
                    <button onClick={() => handleDelete(b)} className="font-semibold hover:underline text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Blog" : "New Blog"} onClose={() => setModalOpen(false)} wide>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Title" required>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Content" required>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              placeholder="Write the blog content…"
            />
          </FormField>
          <FormField label={editing ? "Cover Image (leave blank to keep current)" : "Cover Image"} required={!editing}>
            {editing && (b => b)(editing) && (editing.coverImage || editing.image) && (
              <img
                src={getFullImageUrl(editing.coverImage || editing.image)}
                alt={editing.title}
                className="w-24 h-16 object-cover rounded-md border mb-2"
                style={{ borderColor: COLORS.accent }}
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, coverImage: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Location">
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} style={inputStyle} />
            </FormField>
            <FormField label="Trees Planted">
              <input type="number" value={form.treesPlanted} onChange={(e) => setForm({ ...form, treesPlanted: e.target.value })} className={inputClass} style={inputStyle} />
            </FormField>
            <FormField label="Volunteers">
              <input type="number" value={form.volunteers} onChange={(e) => setForm({ ...form, volunteers: e.target.value })} className={inputClass} style={inputStyle} />
            </FormField>
          </div>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass} style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
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