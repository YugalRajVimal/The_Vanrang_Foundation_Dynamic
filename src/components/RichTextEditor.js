import { useRef, useEffect, useCallback } from "react";
import { COLORS } from "./admin/AdminUI";


/**
 * Lightweight rich text editor with no external dependencies.
 * Stores/returns HTML in `value` / `onChange`. Uses document.execCommand,
 * which is deprecated but still broadly supported in Chrome/Firefox/Safari/Edge
 * for this kind of basic formatting toolbar. If you outgrow this (tables,
 * embeds, collaborative editing, etc.) swap in Tiptap or Quill — this
 * component's props (value/onChange) are designed to make that swap easy.
 */
const TOOLBAR_BUTTONS = [
  { cmd: "bold", label: "B", style: { fontWeight: 700 } },
  { cmd: "italic", label: "I", style: { fontStyle: "italic" } },
  { cmd: "underline", label: "U", style: { textDecoration: "underline" } },
  { type: "divider" },
  { cmd: "formatBlock", value: "H2", label: "H2" },
  { cmd: "formatBlock", value: "H3", label: "H3" },
  { cmd: "formatBlock", value: "P", label: "¶" },
  { type: "divider" },
  { cmd: "insertUnorderedList", label: "• List" },
  { cmd: "insertOrderedList", label: "1. List" },
  { cmd: "formatBlock", value: "BLOCKQUOTE", label: "❝" },
  { type: "divider" },
  { cmd: "createLink", label: "Link", needsPrompt: "Enter URL:" },
  { cmd: "removeFormat", label: "Clear" },
];

export default function RichTextEditor({ value, onChange, placeholder = "Write your content…" }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  // Keep the DOM in sync when `value` changes from outside (e.g. openEdit)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const runCommand = (btn) => {
    editorRef.current?.focus();
    if (btn.needsPrompt) {
      const url = window.prompt(btn.needsPrompt);
      if (!url) return;
      document.execCommand(btn.cmd, false, url);
    } else if (btn.value) {
      document.execCommand(btn.cmd, false, btn.value);
    } else {
      document.execCommand(btn.cmd, false, null);
    }
    emitChange();
  };

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: COLORS.accent }}>
      <div
        className="flex flex-wrap gap-1 p-2 border-b"
        style={{ background: COLORS.background, borderColor: COLORS.accent + "55" }}
      >
        {TOOLBAR_BUTTONS.map((btn, i) =>
          btn.type === "divider" ? (
            <div key={i} className="w-px mx-1 my-1" style={{ background: COLORS.accent + "55" }} />
          ) : (
            <button
              key={btn.label}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // keep focus/selection in editor
              onClick={() => runCommand(btn)}
              className="px-2 py-1 rounded text-xs font-semibold hover:opacity-80"
              style={{ ...btn.style, background: COLORS.surface, color: COLORS.primary, border: `1px solid ${COLORS.accent}` }}
              title={btn.label}
            >
              {btn.label}
            </button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        data-placeholder={placeholder}
        className="rich-text-editable px-3 py-2 min-h-[10rem] max-h-[24rem] overflow-y-auto text-sm focus:outline-none"
        style={{ color: COLORS.textPrimary }}
      />
      <style>{`
        .rich-text-editable:empty:before {
          content: attr(data-placeholder);
          color: ${COLORS.textSecondary};
          pointer-events: none;
        }
        .rich-text-editable h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
        .rich-text-editable h3 { font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0; }
        .rich-text-editable p { margin: 0.4rem 0; }
        .rich-text-editable ul { list-style: disc; padding-left: 1.5rem; margin: 0.4rem 0; }
        .rich-text-editable ol { list-style: decimal; padding-left: 1.5rem; margin: 0.4rem 0; }
        .rich-text-editable blockquote {
          border-left: 3px solid ${COLORS.primary};
          padding-left: 0.75rem;
          margin: 0.5rem 0;
          color: ${COLORS.textSecondary};
          font-style: italic;
        }
        .rich-text-editable a { color: ${COLORS.primary}; text-decoration: underline; }
      `}</style>
    </div>
  );
}