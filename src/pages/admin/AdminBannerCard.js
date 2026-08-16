import { useState, useEffect } from "react";
import { api, ApiError, UPLOAD_URL } from "../../api/client";
import { SkeletonLines, EmptyState, ErrorState } from "../../components/common/DataStates";
import {
  AdminPageHeader, PrimaryButton, Modal,
  FormField, inputClass, inputStyle, COLORS,
} from "../../components/admin/AdminUI";

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 260;

const emptyForm = {
  title: "",
  description: "",
  image: null,
  backgroundImage: null,
  active: true,
};

function getFullImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return UPLOAD_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

export default function AdminBannerCard() {
  const [bannerCard, setBannerCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch singleton banner card from backend
  const fetchBannerCard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/banner-card");
      console.log(data);
      // Defensive: Make sure data is an object and not empty
      if (data && typeof data === "object" && (data.title !== undefined || data.description !== undefined)) {
        setBannerCard(data);
      } else {
        setBannerCard(null);
      }
    } catch (err) {
      setError(err);
      setBannerCard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerCard();
    // eslint-disable-next-line
  }, []);

  const retry = fetchBannerCard;

  // Initialize form with current card values (for edit)
  const openEdit = () => {
    setForm({
      title: bannerCard?.title || "",
      description: bannerCard?.description || "",
      image: null, // only set if uploading new one
      backgroundImage: null,
      active: bannerCard?.active !== undefined ? bannerCard?.active : true,
    });
    setBanner("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");

    // Validation
    if (!form.title.trim()) {
      setBanner("Title is required.");
      return;
    }
    if (!form.description.trim()) {
      setBanner("Description is required.");
      return;
    }
    if (form.title.length > TITLE_MAX_LENGTH) {
      setBanner(`Title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
      return;
    }
    if (form.description.length > DESCRIPTION_MAX_LENGTH) {
      setBanner(`Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      const hasImage = !!form.image;
      const hasBackgroundImage = !!form.backgroundImage;

      if (hasImage || hasBackgroundImage) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("active", form.active ? "true" : "false");
        if (hasImage) fd.append("image", form.image);
        if (hasBackgroundImage) fd.append("backgroundImage", form.backgroundImage);

        await api.putForm("/banner-card", fd);
      } else {
        const body = {
          title: form.title,
          description: form.description,
          active: form.active,
        };
        await api.put("/banner-card", body);
      }

      setModalOpen(false);
      retry();
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Banner Card"
        action={
          <PrimaryButton onClick={openEdit}>
            Edit Banner Card
          </PrimaryButton>
        }
      />

      {loading && <SkeletonLines count={4} />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && !bannerCard &&
        <EmptyState message="Banner card not found." />
      }
      {!loading && !error && bannerCard && (
        <div
          className="rounded-2xl shadow border overflow-hidden max-w-3xl mx-auto my-8 relative"
          style={{
            borderColor: COLORS.accent,
            background: bannerCard.backgroundImage
              ? `url('${getFullImageUrl(bannerCard.backgroundImage)}') center/cover no-repeat`
              : COLORS.surface,
          }}
        >
          {/* Blurred background overlay for better readability */}
          {bannerCard.backgroundImage && (
            <div
              className="absolute inset-0"
              style={{
                background: `url('${getFullImageUrl(bannerCard.backgroundImage)}') center/cover no-repeat`,
                filter: "blur(6px) brightness(0.9)",
                zIndex: 0,
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />
          )}
          {/* A darker translucent overlay for even better text readability */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none z-10" />
          <div className="relative flex flex-row items-stretch min-h-[200px] z-20">
            {/* Left: Foreground image */}
            <div className="flex items-center justify-center p-6 min-w-[170px] w-[170px]">
              {bannerCard.image && (
                <img
                  src={getFullImageUrl(bannerCard.image)}
                  alt="Banner Foreground"
                  className="w-32 h-32 object-cover rounded-lg border bg-white shadow"
                  style={{
                    borderColor: COLORS.primary,
                    boxShadow: "0 2px 10px #0002",
                    aspectRatio: "1",
                  }}
                />
              )}
            </div>
            {/* Right: Title and Description */}
            <div className="flex-1 flex flex-col justify-center gap-2 py-6 pr-6 min-w-0 z-20">
              <h2
                className="font-bold text-2xl mb-3"
                style={{
                  color: "#FFF",
                  wordBreak: "break-word",
                  textShadow: "0 4px 12px #000A, 0 1px 2px #000C",
                  letterSpacing: "0.5px",
                }}
              >
                {bannerCard.title}
              </h2>
              <p
                className="text-white mb-2 whitespace-pre-line break-words"
                style={{
                  color: "#FFF",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  textShadow: "0 4px 12px #000A, 0 1px 2px #000C",
                  wordBreak: "break-word",
                  letterSpacing: "0.1px",
                }}
              >
                {bannerCard.description}
              </p>
              <div className="mt-2">
                <span className="inline-block text-xs px-2 py-1 rounded font-bold" style={{
                  background: bannerCard.active ? "#D1FAE5" : "#FDE68A",
                  color: bannerCard.active ? "#065F46" : "#92400E",
                  border: "1px solid",
                  borderColor: bannerCard.active ? "#10B981" : "#F59E42",
                  marginRight: 6,
                }}>
                  {bannerCard.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title="Edit Banner Card"
        onClose={() => setModalOpen(false)}
        wide
      >
        {banner && (
          <div
            className="rounded-lg p-3 text-sm font-medium mb-4"
            style={{ background: "#FBEAE6", color: "#B3401F" }}
          >
            {banner}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <FormField label={`Title (max ${TITLE_MAX_LENGTH} chars)`} required>
            <input
              type="text"
              maxLength={TITLE_MAX_LENGTH}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              style={inputStyle}
              required
            />
          </FormField>
          <FormField label={`Description (max ${DESCRIPTION_MAX_LENGTH} chars)`} required>
            <textarea
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              required
            />
          </FormField>
          <FormField label="Active" required>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="true"
                  checked={form.active === true}
                  onChange={() => setForm({ ...form, active: true })}
                  className="accent-green-600"
                  required
                />
                <span className="ml-2 text-green-800 font-medium">Active</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="false"
                  checked={form.active === false}
                  onChange={() => setForm({ ...form, active: false })}
                  className="accent-yellow-700"
                  required
                />
                <span className="ml-2 text-yellow-800 font-medium">Inactive</span>
              </label>
            </div>
          </FormField>
          <FormField label="Foreground Image (optional)">
            {bannerCard?.image && !form.image && (
              <img
                src={getFullImageUrl(bannerCard.image)}
                alt="Existing Foreground"
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
          <FormField label="Background Image (optional)">
            {bannerCard?.backgroundImage && !form.backgroundImage && (
              <img
                src={getFullImageUrl(bannerCard.backgroundImage)}
                alt="Existing Background"
                className="w-24 h-16 object-cover rounded-md border mb-2"
                style={{ borderColor: COLORS.accent }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, backgroundImage: e.target.files?.[0] || null })}
              className={inputClass}
              style={inputStyle}
            />
          </FormField>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving…" : "Save"}
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}