import { useState } from "react";

export const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

export function AdminPageHeader({ title, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold font-serif" style={{ color: COLORS.primary }}>
        {title}
      </h1>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      className="px-5 py-2.5 rounded-lg font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: COLORS.primary, color: COLORS.surface }}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconTextButton({ children, ...props }) {
  return (
    <button
      className="text-sm font-semibold hover:underline disabled:opacity-50"
      style={{ color: COLORS.primary }}
      {...props}
    >
      {children}
    </button>
  );
}

// Centered modal — used for every create/edit form across the admin panel.
export function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`rounded-2xl shadow-2xl p-6 md:p-8 w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto border-t-8`}
        style={{ background: COLORS.surface, borderTopColor: COLORS.primary }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold font-serif" style={{ color: COLORS.primary }}>
            {title}
          </h3>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: COLORS.textSecondary }} aria-label="Close">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Delete/destructive-action confirmation. Usage:
//   const confirm = useConfirm();
//   confirm.ask("Delete this banner?", () => doDelete());
//   <ConfirmDialog {...confirm} />
export function useConfirm() {
  const [state, setState] = useState({ open: false, message: "", onConfirm: null });
  const ask = (message, onConfirm) => setState({ open: true, message, onConfirm });
  const close = () => setState((s) => ({ ...s, open: false }));
  return { ...state, ask, close };
}

export function ConfirmDialog({ open, message, onConfirm, close }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="rounded-2xl shadow-2xl p-6 max-w-sm w-full" style={{ background: COLORS.surface }}>
        <p className="mb-6" style={{ color: COLORS.textPrimary }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={close} className="px-4 py-2 rounded-lg font-medium" style={{ color: COLORS.textSecondary }}>
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              close();
            }}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{ background: COLORS.primary, color: COLORS.surface }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, required, error, children }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-sm" style={{ color: COLORS.textPrimary }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
}

export const inputStyle = { border: `1.5px solid ${COLORS.accent}`, color: COLORS.textPrimary };
export const inputClass = "rounded-lg p-2.5 w-full outline-none text-sm";
