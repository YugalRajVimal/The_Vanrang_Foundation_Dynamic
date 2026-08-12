// import { useState } from "react";
// import { api, ApiError } from "../../api/client";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
// import {
//   AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
//   FormField, inputClass, inputStyle, COLORS,
// } from "../../components/admin/AdminUI";

// const emptyForm = { photo: null, name: "", designation: "", description: "", order: "" };

// export default function AdminTeam() {
//   const { data: members, loading, error, retry } = useFetch(() => api.get("/team", { auth: false }), []);
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
//   const openEdit = (m) => {
//     setEditing(m);
//     setForm({ photo: null, name: m.name || "", designation: m.designation || "", description: m.description || "", order: m.order ?? "" });
//     setBanner("");
//     setModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBanner("");
//     if (!form.name.trim() || !form.designation.trim() || !form.description.trim() || (!editing && !form.photo)) {
//       setBanner("Photo, name, designation, and description are required.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const fd = new FormData();
//       if (form.photo) fd.append("photo", form.photo);
//       fd.append("name", form.name);
//       fd.append("designation", form.designation);
//       fd.append("description", form.description);
//       if (form.order !== "") fd.append("order", form.order);

//       if (editing) await api.putForm(`/team/${editing.id || editing._id}`, fd);
//       else await api.postForm("/team", fd);

//       setModalOpen(false);
//       retry();
//     } catch (err) {
//       setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = (m) => {
//     confirm.ask(`Remove "${m.name}" from the team?`, async () => {
//       try {
//         await api.del(`/team/${m.id || m._id}`);
//         retry();
//       } catch {
//         retry();
//       }
//     });
//   };

//   return (
//     <div>
//       <AdminPageHeader title="Team" action={<PrimaryButton onClick={openCreate}>Add Member</PrimaryButton>} />

//       {loading && <SkeletonGrid count={4} />}
//       {!loading && error && <ErrorState onRetry={retry} />}
//       {!loading && !error && (!members || members.length === 0) && <EmptyState message="No team members yet." />}

//       {!loading && !error && members && members.length > 0 && (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {members.map((m) => (
//             <div key={m.id || m._id} className="rounded-xl shadow border p-4 text-center" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
//               <img src={m.photo || m.image} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
//               <p className="font-semibold" style={{ color: COLORS.primary }}>{m.name}</p>
//               <p className="text-xs mb-3" style={{ color: COLORS.secondary }}>{m.designation}</p>
//               <div className="flex justify-center gap-3">
//                 <button onClick={() => openEdit(m)} className="text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
//                 <button onClick={() => handleDelete(m)} className="text-xs font-semibold hover:underline text-red-600">Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <Modal open={modalOpen} title={editing ? "Edit Team Member" : "Add Team Member"} onClose={() => setModalOpen(false)}>
//         {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
//         <form onSubmit={handleSubmit}>
//           <FormField label="Photo" required={!editing}>
//             <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Name" required>
//             <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Designation" required>
//             <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} style={inputStyle} />
//           </FormField>
//           <FormField label="Description" required>
//             <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " h-24"} style={inputStyle} />
//           </FormField>
//           <FormField label="Order">
//             <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} style={inputStyle} />
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

import { useState, useEffect } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal, ConfirmDialog, useConfirm,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";
import { getFullImageUrl } from "../../utils/ImageURI";

const emptyForm = { photo: null, name: "", designation: "", description: "", order: "" };

export default function AdminTeam() {
  const { data: membersData, loading, error, retry } = useFetch(() => api.get("/team", { auth: false }), []);
  // Support { members: [...] }, { team: [...] }, { items: [...] }, or a bare array response
  const members = membersData?.members
    || membersData?.team
    || membersData?.items
    || (Array.isArray(membersData) ? membersData : []);

  useEffect(() => {
    if (!loading) {
      console.log("Fetched team members data:", membersData);
      console.log("Resolved team members list:", members);
    }
  }, [loading, membersData, members]);

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
  const openEdit = (m) => {
    setEditing(m);
    setForm({
      photo: null,
      name: m.name || "",
      designation: m.designation || "",
      description: m.description || "",
      order: m.order ?? "",
    });
    setBanner("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    if (!form.name.trim() || !form.designation.trim() || !form.description.trim() || (!editing && !form.photo)) {
      setBanner("Photo, name, designation, and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (form.photo) fd.append("photo", form.photo);
      fd.append("name", form.name);
      fd.append("designation", form.designation);
      fd.append("description", form.description);
      if (form.order !== "") fd.append("order", form.order);

      if (editing) await api.putForm(`/team/${editing.id || editing._id}`, fd);
      else await api.postForm("/team", fd);

      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (m) => {
    confirm.ask(`Remove "${m.name}" from the team?`, async () => {
      try {
        await api.del(`/team/${m.id || m._id}`);
        retry();
      } catch {
        retry();
      }
    });
  };

  return (
    <div>
      <AdminPageHeader title="Team" action={<PrimaryButton onClick={openCreate}>Add Member</PrimaryButton>} />

      {loading && <SkeletonGrid count={4} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!members || members.length === 0) && <EmptyState message="No team members yet." />}

      {!loading && !error && members && members.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div key={m.id || m._id} className="rounded-xl shadow border p-4 text-center" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
              <img src={getFullImageUrl(m.photo || m.image)} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
              <p className="font-semibold" style={{ color: COLORS.primary }}>{m.name}</p>
              <p className="text-xs mb-3" style={{ color: COLORS.secondary }}>{m.designation}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => openEdit(m)} className="text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>Edit</button>
                <button onClick={() => handleDelete(m)} className="text-xs font-semibold hover:underline text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Team Member" : "Add Team Member"} onClose={() => setModalOpen(false)}>
        {banner && <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ background: "#FBEAE6", color: "#B3401F" }}>{banner}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label={editing ? "Photo (leave blank to keep current)" : "Photo"} required={!editing}>
            {editing && (editing.photo || editing.image) && (
              <img
                src={getFullImageUrl(editing.photo || editing.image)}
                alt={editing.name}
                className="w-16 h-16 rounded-full object-cover border mb-2"
                style={{ borderColor: COLORS.accent }}
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Name" required>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Designation" required>
            <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} style={inputStyle} />
          </FormField>
          <FormField label="Description" required>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " h-24"} style={inputStyle} />
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