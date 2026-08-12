// import { useState } from "react";
// import { api, ApiError } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
// import {
//   AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
//   FormField, inputClass, inputStyle, COLORS,
// } from "../../components/admin/AdminUI";

// const emptyForm = { title: "", issuer: "", issueDate: "", image: null, description: "", group: "" };

// export default function AdminCertifications() {
//   const { data: certs, loading, error, retry } = useFetch(() => api.get("/certifications", { auth: false }), []);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(emptyForm);
//   const [banner, setBanner] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const confirm = useConfirm();

//   const openCreate = () => {
//     setEditing(null);
//     setForm(emptyForm);
//     setBanner("");
//     setModalOpen(true);
//   };
//   const openEdit = (c) => {
//     setEditing(c);
//     setForm({ title: c.title || "", issuer: c.issuer || "", issueDate: c.issueDate?.slice(0, 10) || "", image: null, description: c.description || "", group: c.group || "" });
//     setBanner("");
//     setModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBanner("");
//     if (!form.title.trim() || !form.issuer.trim() || !form.issueDate || (!editing && !form.image)) {
//       setBanner("Title, issuer, issue date, and image are required.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const payload = { title: form.title, issuer: form.issuer, issueDate: form.issueDate, description: form.description || undefined, group: form.group || undefined };
//       if (editing) {
//         await api.put(`/certifications/${editing.id || editing._id}`, payload);
//       } else if (form.image) {
//         // Contract lists `image` as a plain field on POST /certifications (not
//         // flagged multipart like banners/gallery/team) — sending as JSON with
//         // the raw File isn't possible, so this needs a hosted URL from backend
//         // or the endpoint needs to be confirmed as multipart. Held off.
//         setBanner("Image field format (URL vs. multipart upload) needs confirming with backend for this endpoint — not yet submitted.");
//         setSubmitting(false);
//         return;
//       }
//       setModalOpen(false);
//       retry();
//     } catch (err) {
//       setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = (c) => {
//     confirm.ask(`Delete "${c.title}"?`, async () => {
//       try {
//         await api.del(`/certifications/${c.id || c._id}`);
//         retry();
//       } catch {
//         retry();
//       }
//     });
//   };

//   return (
//     <div>
//       <AdminPageHeader title="Certifications" action={<PrimaryButton onClick={openCreate}>Add Certification</PrimaryButton>} />

//       {loading && <SkeletonGrid count={4} />}
//       {!loading && error && <ErrorState onRetry={retry} />}
//       {!loading && !error && (!certs || certs.length === 0) && <EmptyState message="No certifications yet." />}

//       {!loading && !error && certs && certs.length > 0 && (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {certs.map((c) => (
//             <div key={c.id || c._id} className="rounded-xl shadow border p-4" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
//               <img src={c.image} alt={c.title} className="w-full h-32 object-contain mb-3 bg-white" />
//               <p className="font-semibold text-sm" style={{ color: COLORS.primary }}>{c.title}</p>
//               <p className="text-xs" style={{ color: COLORS.secondary }}>{c.issuer}</p>
//               <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
//                 {c.issueDate ? new Date(c.issueDate).toLocaleDateString() : ""}
//               </p>
//               <div className="flex gap-3">
//                 <button onClick={() => openEdit(c)} className="text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
//                 <button onClick={() => handleDelete(c)} className="text-xs font-semibold hover:underline text-red-600">Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <Modal open={modalOpen} title={editing ? "Edit Certification" : "Add Certification"} onClose={() => setModalOpen(false)}>
//         {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
//         <form onSubmit={handleSubmit}>
//           <FormField label="Title" required>
//             <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Issuer" required>
//             <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Issue Date" required>
//             <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           {!editing && (
//             <FormField label="Image" required>
//               <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
//             </FormField>
//           )}
//           <FormField label="Group (optional — e.g. UDYAM)">
//             <input type="text" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Description">
//             <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " h-20"} style={inputStyle} />
//           </FormField>
//           <PrimaryButton type="submit" disabled={submitting} className="w-full">
//             {submitting ? "Saving…" : "Save"}
//           </PrimaryButton>
//         </form>
//       </Modal>

//       <ConfirmDialog {...confirm} />
//     </div>
//   );
// }

import { useState } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";
import { getFullImageUrl } from "../../utils/ImageURI";

const emptyForm = { title: "", issuer: "", issueDate: "", image: null, description: "", group: "" };

export default function AdminCertifications() {
  const { data: certsData, loading, error, retry } = useFetch(() => api.get("/certifications", { auth: false }), []);
  // Support { certifications: [...] }, { items: [...] }, or a bare array response
  const certs = certsData?.certifications || certsData?.items || (Array.isArray(certsData) ? certsData : []);

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
  const openEdit = (c) => {
    setEditing(c);
    setForm({ title: c.title || "", issuer: c.issuer || "", issueDate: c.issueDate?.slice(0, 10) || "", image: null, description: c.description || "", group: c.group || "" });
    setBanner("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!form.title.trim() || !form.issuer.trim() || !form.issueDate || (!editing && !form.image)) {
      setBanner("Title, issuer, issue date, and image are required.");
      return;
    }
    setSubmitting(true);
    try {
      // Image is a file upload, so send as multipart FormData for both create
      // and edit (same pattern as Team/Gallery/Blogs). On edit, image is
      // optional — only append if a new file was chosen, so the backend
      // keeps the existing image otherwise.
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("issuer", form.issuer);
      fd.append("issueDate", form.issueDate);
      if (form.description) fd.append("description", form.description);
      if (form.group) fd.append("group", form.group);
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await api.putForm(`/certifications/${editing.id || editing._id}`, fd);
      } else {
        await api.postForm("/certifications", fd);
      }
      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (c) => {
    confirm.ask(`Delete "${c.title}"?`, async () => {
      try {
        await api.del(`/certifications/${c.id || c._id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader title="Certifications" action={<PrimaryButton onClick={openCreate}>Add Certification</PrimaryButton>} />

      {loading && <SkeletonGrid count={4} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!certs || certs.length === 0) && <EmptyState message="No certifications yet." />}

      {!loading && !error && certs && certs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c) => (
            <div key={c.id || c._id} className="rounded-xl shadow border p-4" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
              <img src={getFullImageUrl(c.image)} alt={c.title} className="w-full h-32 object-contain mb-3 bg-white" />
              <p className="font-semibold text-sm" style={{ color: COLORS.primary }}>{c.title}</p>
              <p className="text-xs" style={{ color: COLORS.secondary }}>{c.issuer}</p>
              <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
                {c.issueDate ? new Date(c.issueDate).toLocaleDateString() : ""}
              </p>
              <div className="flex gap-3">
                <button onClick={() => openEdit(c)} className="text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
                <button onClick={() => handleDelete(c)} className="text-xs font-semibold hover:underline text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Certification" : "Add Certification"} onClose={() => setModalOpen(false)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Title" required>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Issuer" required>
            <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Issue Date" required>
            <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label={editing ? "Image (leave blank to keep current)" : "Image"} required={!editing}>
            {editing && editing.image && (
              <img
                src={getFullImageUrl(editing.image)}
                alt={editing.title}
                className="w-24 h-16 object-contain rounded-md border mb-2 bg-white"
                style={{ borderColor: COLORS.accent }}
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Group (optional — e.g. UDYAM)">
            <input type="text" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " h-20"} style={inputStyle} />
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