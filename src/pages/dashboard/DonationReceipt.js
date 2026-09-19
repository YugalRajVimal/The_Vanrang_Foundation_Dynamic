// // import { useParams } from "react-router-dom";
// // import { useFetch } from "../../hooks/useFetch";
// // import { SkeletonLines, ErrorState } from "../../components/common/DataStates";
// // import VanrangReceipt from "../../components/receipts/VanrangReceipt";
// // import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";



// // export default function DonationReceipt() {
// //   const { id } = useParams();
// //   const { data, loading, error, retry } = useFetch(() => import("../../api/client").then(({ api }) => api.get(`/donations/me/${id}/receipt`)), [id]);

// //   if (loading) {
// //     return (
// //       <div className="rounded-2xl p-8 border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
// //         <SkeletonLines count={5} />
// //       </div>
// //     );
// //   }
// //     if (error) return <ErrorState onRetry={retry} message="Couldn't load this receipt." />;
  
// //     return (
// //       <div className="flex flex-col items-center gap-5 pt-32 pb-10">
// //         <style>{`
// //           @media print {
// //             /* Hide everything on the page by default when printing */
// //             body * {
// //               visibility: hidden;
// //             }
// //             /* Reveal only the receipt and everything inside it */
// //             #receipt-print-area, #receipt-print-area * {
// //               visibility: visible;
// //             }
// //             #receipt-print-area {
// //               position: absolute;
// //               top: 0;
// //               left: 0;
// //               height: 100%;
// //             }
// //             @page {
// //               size: A4;
// //               margin: 'auto';
// //             }
// //           }
// //         `}</style>
  
// //         <div className="flex gap-3 print:hidden">
// //           <button
// //             onClick={() => window.print()}
// //             className="px-5 py-2.5 rounded-lg font-semibold shadow"
// //             style={{ background: COLORS.primary, color: "#fff" }}
// //           >
// //             Download PDF / Print
// //           </button>
// //         </div>
  
// //         <div
// //           id="receipt-print-area"
// //           className="w-[min(820px,100%)] shadow-[0_6px_30px_rgba(12,34,71,0.18)] print:mx-auto print:w-[200mm] print:shadow-none bg-white"
// //         >
// //           <VanrangReceipt {...data} />
// //         </div>
// //       </div>
// //     );
// //   }

// import { useParams } from "react-router-dom";
// import { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useFetch } from "../../hooks/useFetch";
// import { SkeletonLines, ErrorState } from "../../components/common/DataStates";
// import VanrangReceipt from "../../components/receipts/VanrangReceipt";
// import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";

// export default function DonationReceipt() {
//   const { id } = useParams();
//   const { data, loading, error, retry } = useFetch(
//     () => import("../../api/client").then(({ api }) => api.get(`/donations/me/${id}/receipt`)),
//     [id]
//   );
//   const receiptRef = useRef(null);
//   const [generating, setGenerating] = useState(false);

//   const handleDownload = async () => {
//     if (!receiptRef.current) return;
//     setGenerating(true);
//     try {
//       const canvas = await html2canvas(receiptRef.current, {
//         scale: 2, // sharper output
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });
//       const imgData = canvas.toDataURL("image/png");

//       // A4 in points: 595.28 x 841.89 — scale image to fit width, keep aspect ratio
//       const pdf = new jsPDF({ unit: "pt", format: "a4" });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = (canvas.height * pageWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
//       pdf.save(`Receipt-${data.receiptNo || id}.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="rounded-2xl p-8 border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
//         <SkeletonLines count={5} />
//       </div>
//     );
//   }
//   if (error) return <ErrorState onRetry={retry} message="Couldn't load this receipt." />;

//   return (
//     <div className="flex flex-col items-center gap-5 pt-32 pb-10">
//       <div className="flex gap-3">
//         <button
//           onClick={handleDownload}
//           disabled={generating}
//           className="px-5 py-2.5 rounded-lg font-semibold shadow disabled:opacity-60"
//           style={{ background: COLORS.primary, color: "#fff" }}
//         >
//           {generating ? "Generating…" : "Download PDF"}
//         </button>
//       </div>

//       <div
//         ref={receiptRef}
//         className="w-[min(820px,100%)] shadow-[0_6px_30px_rgba(12,34,71,0.18)] bg-white"
//       >
//         <VanrangReceipt {...data} />
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLines, ErrorState } from "../../components/common/DataStates";
import VanrangReceipt from "../../components/receipts/VanrangReceipt";
import { DASHBOARD_COLORS as COLORS } from "./DashboardLayout";

function waitForImages(container) {
  const images = container.querySelectorAll("image, img");
  return Promise.all(
    Array.from(images).map((img) => {
      // SVG <image> doesn't have .complete; treat it as "wait for load/error"
      // unless it's a plain <img> that's already finished loading.
      if (img.tagName.toLowerCase() === "img" && img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
        // Safety net in case neither event fires for some reason
        setTimeout(resolve, 5000);
      });
    })
  );
}

export default function DonationReceipt() {
  const { id } = useParams();
  const { data, loading, error, retry } = useFetch(
    () => import("../../api/client").then(({ api }) => api.get(`/donations/me/${id}/receipt`)),
    [id]
  );
  const receiptRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setGenerating(true);
    try {
      await waitForImages(receiptRef.current);

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`Receipt-${data.receiptNo || id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-8 border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.accent }}>
        <SkeletonLines count={5} />
      </div>
    );
  }
  if (error) return <ErrorState onRetry={retry} message="Couldn't load this receipt." />;

  return (
    <div className="flex flex-col items-center gap-5 pt-32 pb-10">
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={generating}
          className="px-5 py-2.5 rounded-lg font-semibold shadow disabled:opacity-60"
          style={{ background: COLORS.primary, color: "#fff" }}
        >
          {generating ? "Generating…" : "Download PDF"}
        </button>
      </div>

      <div
        ref={receiptRef}
        className="w-[min(820px,100%)] shadow-[0_6px_30px_rgba(12,34,71,0.18)] bg-white"
      >
        <VanrangReceipt {...data} />
      </div>
    </div>
  );
}