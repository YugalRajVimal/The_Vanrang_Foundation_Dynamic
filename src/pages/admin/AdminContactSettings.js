import { useEffect, useState } from "react";
import { api, ApiError } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, ErrorState } from "../../components/common/DataStates";
import { AdminPageHeader, PrimaryButton, FormField, inputClass, inputStyle, COLORS } from "../../components/admin/AdminUI";

const SOCIAL_PLATFORMS = ["facebook", "instagram", "twitter", "linkedin", "youtube", "threads"];

export default function AdminContactSettings() {
  const { data, loading, error, retry } = useFetch(() => api.get("/settings/contact", { auth: false }), []);

  // Note: Data comes as { settings: {...} } — adjust all reads accordingly
  const settings = data?.settings ?? {};

  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [socials, setSocials] = useState({});
  const [banner, setBanner] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmails(Array.isArray(settings.emails) && settings.emails.length ? settings.emails : [""]);
      setPhones(Array.isArray(settings.phones) && settings.phones.length ? settings.phones : [""]);
      setAddresses(Array.isArray(settings.addresses) && settings.addresses.length ? settings.addresses : [{ label: "", address: "", mapLink: "" }]);
      setSocials(typeof settings.socials === "object" && settings.socials ? settings.socials : {});
    }
  }, [settings]);

  const updateList = (setter, list) => (i, value) => {
    const next = [...list];
    next[i] = value;
    setter(next);
  };
  const addToList = (setter, list, emptyValue) => () => setter([...list, emptyValue]);
  const removeFromList = (setter, list) => (i) => setter(list.filter((_, idx) => idx !== i));

  const updateAddress = (i, key, value) => {
    const next = [...addresses];
    next[i] = { ...next[i], [key]: value };
    setAddresses(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    setSuccess(false);
    setSubmitting(true);
    try {
      await api.put("/settings/contact", {
        emails: emails.filter((v) => v.trim()),
        phones: phones.filter((v) => v.trim()),
        addresses: addresses.filter((a) => a.address?.trim()),
        socials,
      });
      setSuccess(true);
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SkeletonLines count={8} />;
  if (error) return <ErrorState onRetry={retry} />;

  return (
    <div>
      <AdminPageHeader title="Contact Settings" />
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Changes here are reflected site-wide — in the footer, contact page, and contact section.
      </p>

      <div className="rounded-2xl shadow p-6 md:p-8 border max-w-2xl" style={{ background: COLORS.surface, borderColor: COLORS.accent }}>
        {success && (
          <div className="rounded-lg p-3 text-sm font-medium mb-5" style={{ background: "#E8F5E1", color: "#3F7A2E" }}>
            Saved — now reflected site-wide.
          </div>
        )}
        {banner && (
          <div className="rounded-lg p-3 text-sm font-medium mb-5" style={{ background: "#FBEAE6", color: "#B3401F" }}>
            {banner}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <RepeatableSection
            label="Emails"
            items={emails}
            onChange={updateList(setEmails, emails)}
            onAdd={addToList(setEmails, emails, "")}
            onRemove={removeFromList(setEmails, emails)}
            placeholder="email@example.org"
          />
          <RepeatableSection
            label="Phones"
            items={phones}
            onChange={updateList(setPhones, phones)}
            onAdd={addToList(setPhones, phones, "")}
            onRemove={removeFromList(setPhones, phones)}
            placeholder="+91 90000 00000"
          />

          <FormField label="Addresses">
            <div className="space-y-3">
              {addresses.map((a, i) => (
                <div key={i} className="rounded-lg p-3 border space-y-2" style={{ borderColor: COLORS.accent }}>
                  <input placeholder="Label (e.g. Registered Office)" value={a.label || ""} onChange={(e) => updateAddress(i, "label", e.target.value)} className={inputClass} style={inputStyle} />
                  <textarea placeholder="Address" value={a.address || ""} onChange={(e) => updateAddress(i, "address", e.target.value)} className={inputClass + " h-16"} style={inputStyle} />
                  <input placeholder="Google Maps link" value={a.mapLink || ""} onChange={(e) => updateAddress(i, "mapLink", e.target.value)} className={inputClass} style={inputStyle} />
                  <button type="button" onClick={() => removeFromList(setAddresses, addresses)(i)} className="text-xs text-red-600 font-semibold">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addToList(setAddresses, addresses, { label: "", address: "", mapLink: "" })} className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                + Add address
              </button>
            </div>
          </FormField>

          <FormField label="Social Links">
            <div className="space-y-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <div key={platform} className="flex items-center gap-3">
                  <span className="w-24 text-sm capitalize" style={{ color: COLORS.textPrimary }}>{platform}</span>
                  <input
                    placeholder={`https://...`}
                    value={socials[platform] || ""}
                    onChange={(e) => setSocials({ ...socials, [platform]: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </FormField>

          <PrimaryButton type="submit" disabled={submitting} className="w-full mt-2">
            {submitting ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

function RepeatableSection({ label, items, onChange, onAdd, onRemove, placeholder }) {
  return (
    <FormField label={label}>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input value={v} onChange={(e) => onChange(i, e.target.value)} placeholder={placeholder} className={inputClass} style={inputStyle} />
            <button type="button" onClick={() => onRemove(i)} className="text-red-600 font-bold px-2">✕</button>
          </div>
        ))}
        <button type="button" onClick={onAdd} className="text-sm font-semibold" style={{ color: COLORS.primary }}>
          + Add
        </button>
      </div>
    </FormField>
  );
}
