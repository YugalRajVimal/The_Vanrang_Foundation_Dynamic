import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonGrid, EmptyState, ErrorState } from "../../components/common/DataStates";

// NOTE — See above comment about groups ("UDYAM", etc.)

const COLORS = { primary: "#E76F51", secondary: "#F4A261", background: "#FDF6EC", surface: "#FFFFFF" };

// Get upload URL from env
const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

// Helper to build image URLs correctly
function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute
  return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

// Certificates normalizer - support {certifications: [...]}, {items: [...]}, array, etc
function normalizeCertificates(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.certifications)) return raw.certifications;
  if (raw && Array.isArray(raw.certificates)) return raw.certificates;
  if (raw && Array.isArray(raw.items)) return raw.items;
  return [];
}

class ImgErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || "Unknown error" };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center font-bold p-4">
          Failed to load certificate image. <br />
          <span className="text-xs">{this.state.errorMsg}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CertificationPage() {
  const { data: certificatesRaw, loading, error, retry } = useFetch(
    () => {
      return api.get("/certifications", { auth: false }).then(res => {
        console.log("Certificates API result:", res);
        return res;
      });
    },
    []
  );
  const certificates = normalizeCertificates(certificatesRaw);
  const [selected, setSelected] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // If selected index goes out of array due to data change, reset to 0
  useEffect(() => {
    setImgLoaded(false);
    if (certificates && certificates.length > 0 && selected >= certificates.length) {
      setSelected(0);
    }
  }, [selected, certificates]);

  useEffect(() => {
    // Preload images for certificates
    if (Array.isArray(certificates)) {
      certificates.forEach((cert) => {
        const img = new window.Image();
        img.src = getImageUrl(cert.image);
      });
    }
  }, [certificates]);

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center bg-[#FDF6EC] py-12 px-2">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-[#E76F51]">Our Certifications</h1>

      {loading && <SkeletonGrid count={5} className="mb-8 flex flex-wrap gap-4 justify-center w-full max-w-7xl" />}
      {!loading && error && <ErrorState onRetry={retry} />}
      {!loading && !error && (!certificates || certificates.length === 0) && (
        <EmptyState message="Certifications will appear here soon." />
      )}

      {!loading && !error && certificates && certificates.length > 0 && (
        <>
          <div className="mb-8 flex flex-wrap gap-4 justify-center w-full max-w-7xl">
            {certificates.map((cert, idx) => (
              <button
                key={cert.id || cert._id || cert.title || idx}
                onClick={() => setSelected(idx)}
                aria-current={idx === selected ? "page" : undefined}
                className={`flex-1 min-w-[180px] max-w-xs px-4 py-2 rounded-lg font-semibold border transition ${
                  idx === selected
                    ? "bg-[#E76F51] text-white border-[#E76F51]"
                    : "bg-white text-[#E76F51] border-[#E76F51] hover:bg-[#F4A261] hover:text-white"
                }`}
                aria-label={cert.title}
                style={{ flexBasis: "calc(20% - 1rem)" }}
              >
                {cert.group ? `${cert.group} — ${cert.title}` : cert.title}
              </button>
            ))}
          </div>

          <div
            className="bg-white rounded shadow-lg p-4 flex justify-center items-center"
            style={{ maxWidth: "800px", minHeight: "400px", width: "100%" }}
          >
            <ImgErrorBoundary>
              {!imgLoaded && <span className="text-[#E76F51]">Loading certificate...</span>}
              <img
                src={getImageUrl(certificates[selected]?.image)}
                alt={certificates[selected]?.title}
                style={{
                  display: imgLoaded ? "block" : "none",
                  borderRadius: "12px",
                  boxShadow: "0px 2px 16px rgba(0,0,0,0.05)",
                  objectFit: "contain",
                  maxHeight: "630px",
                  width: "100%",
                }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            </ImgErrorBoundary>
          </div>
        </>
      )}
    </div>
  );
}
