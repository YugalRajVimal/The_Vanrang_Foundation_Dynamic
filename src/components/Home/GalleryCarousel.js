// import { motion } from "framer-motion";
// import { api } from "../api/client";
// import { useFetch } from "../hooks/useFetch";

// // Theme colors are now managed via Tailwind CSS config or global CSS variables for ALL components:
// //   --clr-primary: #E76F51;     // Warm NGO Red
// //   --clr-primary-dark: #c85033;
// //   --clr-secondary: #F4A261;   // Soft Orange
// //   --clr-secondary-dark: #d38736;
// //   --clr-accent: #E9C46A;      // Warm Yellow
// //   --clr-background: #FDF6EC;  // Light Beige
// //   --clr-surface: #FFFFFF;
// //   --clr-text-primary: #2D2D2D;
// //   --clr-text-secondary: #6B6B6B;

// // Fallback shown only while banners are loading or if none exist yet, so the
// // homepage never shows an empty strip.
// const fallbackImages = [
//   "/assets/Img1.jpeg",
//   "/assets/Img2.jpeg",
//   "/assets/Img3.jpeg",
//   "/assets/Img4.jpeg",
//   "/assets/Img5.jpeg",
//   "/assets/Img6.jpeg",
// ];

// // Modern warm badge replacing green, using theme colors and a new subtle yellow icon
// function GalleryBadge() {
//   return (
//     <div className="bg-[#fdf6ec] shadow-xl px-7 py-3 rounded-2xl flex items-center gap-3 border-2 border-accent">
//       {/* Icon to bring warm/Humanitarian tone, e.g. modern document/people/heart */}
//       <div className="hidden xs:block text-accent text-[1.7rem] font-bold drop-shadow-sm" aria-label="Gallery badge icon">
//         {/* Yellow heart or document for 'impact' – can swap for theme-appropriate icon */}
//         <span aria-hidden="true">❤️</span>
//       </div>
//       <div>
//         <span className="block font-extrabold text-primary text-xl md:text-[2rem] leading-none font-serif tracking-tight drop-shadow-sm">
//           The Vanrang Foundation
//         </span>
//         <span className="block font-semibold text-secondary text-center text-xs md:text-base tracking-wide mt-1 font-serif">
//           One World One Family
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function GalleryCarousel() {
//   const { data: banners } = useFetch(() => 
//     api.get("/banners", { auth: false }).then(res => {
//       console.log("Fetched banners: ", res);
//       return res;
//     }), 
//     []
//   );
//   const images =
//     banners && banners.length > 0 ? banners.map((b) => b.image || b.url) : fallbackImages;

//   // Handler to scroll to top on link click
//   const handleGalleryButtonClick = (e) => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     // Section alternates: warm light beige. Use Tailwind's `bg-background` (see Tailwind config).
//     <section className="bg-[#fdf6ec] pb-16 relative overflow-hidden">
//       {/* Center Badge: mobile and desktop */}
//       <div className="md:hidden z-20 w-fit mx-auto mb-6">
//         <GalleryBadge />
//       </div>
//       <div className="relative ribbon-mask">
//         {/* Center Badge: desktop (absolute centered) */}
//         <div className="hidden md:block absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
//           <GalleryBadge />
//         </div>
//         {/* Moving Images (double for seamless loop) */}
//         <motion.div
//           className="flex"
//           animate={{ x: ["0%", "-50%"] }}
//           transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
//         >
//           {[...images, ...images].map((img, i) => (
//             <div
//               key={i}
//               className="min-w-[280px] md:min-w-[360px] lg:min-w-[440px] p-2"
//             >
//               <img
//                 src={img}
//                 alt="Impactful event or program by The Vanrang Foundation"
//                 className="w-full h-[170px] md:h-[400px] object-cover rounded-2xl border-2 border-accent shadow-md"
//                 loading="lazy"
//                 style={{ backgroundColor: "var(--clr-surface, #fff)" }}
//               />
//             </div>
//           ))}
//         </motion.div>
//         {/* Gallery Button: primary button, warm red, modern NGO */}
//         <div className="flex justify-center mt-10 absolute left-0 right-0 bottom-6 md:bottom-10 z-30">
//           <a
//             href="/gallery"
//             className="inline-block px-8 py-3 rounded-lg sm:rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-xl transition text-lg tracking-wide focus:outline-none ring-2 ring-primary/20 font-serif"
//             style={{ letterSpacing: "0.03em" }}
//             onClick={handleGalleryButtonClick}
//           >
//             See Full Gallery
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }


import { motion } from "framer-motion";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";

// Theme colors are now managed via Tailwind CSS config or global CSS variables for ALL components:
//   --clr-primary: #E76F51;     // Warm NGO Red
//   --clr-primary-dark: #c85033;
//   --clr-secondary: #F4A261;   // Soft Orange
//   --clr-secondary-dark: #d38736;
//   --clr-accent: #E9C46A;      // Warm Yellow
//   --clr-background: #FDF6EC;  // Light Beige
//   --clr-surface: #FFFFFF;
//   --clr-text-primary: #2D2D2D;
//   --clr-text-secondary: #6B6B6B;

const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";

function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute
  // Remove double slash if accidentally joined
  return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

// Fallback shown only while gallery images are loading or if none exist yet,
// so the homepage strip is never empty.
const fallbackImages = [
  "/assets/Img1.jpeg",
  "/assets/Img2.jpeg",
  "/assets/Img3.jpeg",
  "/assets/Img4.jpeg",
  "/assets/Img5.jpeg",
  "/assets/Img6.jpeg",
];

// Modern warm badge replacing green, using theme colors and a new subtle yellow icon
function GalleryBadge() {
  return (
    <div className="bg-[#fdf6ec] shadow-xl px-7 py-3 rounded-2xl flex items-center gap-3 border-2 border-accent">
      {/* Icon to bring warm/Humanitarian tone, e.g. modern document/people/heart */}
      <div className="hidden xs:block text-accent text-[1.7rem] font-bold drop-shadow-sm" aria-label="Gallery badge icon">
        <span aria-hidden="true">❤️</span>
      </div>
      <div>
        <span className="block font-extrabold text-primary text-xl md:text-[2rem] leading-none font-serif tracking-tight drop-shadow-sm">
          The Vanrang Foundation
        </span>
        <span className="block font-semibold text-secondary text-center text-xs md:text-base tracking-wide mt-1 font-serif">
          One World One Family
        </span>
      </div>
    </div>
  );
}

export default function GalleryCarousel() {
  // Pull a large batch of images across ALL categories (no `category` param = all),
  // same /gallery endpoint used by the full PlantationGallery page.
  const { data: galleryPage } = useFetch(
    () => api.get("/gallery?page=1&limit=24", { auth: false }),
    []
  );

  // Adapt the same possible API response shapes as PlantationGallery does:
  // { images: [...], pagination: {...} } | { items: [...] } | raw array
  let items = [];
  if (galleryPage) {
    if (Array.isArray(galleryPage.images)) {
      items = galleryPage.images;
    } else if (Array.isArray(galleryPage.items)) {
      items = galleryPage.items;
    } else if (Array.isArray(galleryPage)) {
      items = galleryPage;
    }
  }

  const images =
    items.length > 0
      ? items.map((img) => getImageUrl(img.image || img.url)).filter(Boolean)
      : fallbackImages;

  // Handler to scroll to top on link click
  const handleGalleryButtonClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Section alternates: warm light beige. Use Tailwind's `bg-background` (see Tailwind config).
    <section className="bg-[#fdf6ec] pb-16 relative overflow-hidden">
      {/* Center Badge: mobile and desktop */}
      <div className="md:hidden z-20 w-fit mx-auto mb-6">
        <GalleryBadge />
      </div>
      <div className="relative ribbon-mask">
        {/* Center Badge: desktop (absolute centered) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <GalleryBadge />
        </div>
        {/* Moving Images (double for seamless loop) */}
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
          {[...images, ...images].map((img, i) => (
            <div
              key={i}
              className="min-w-[280px] md:min-w-[360px] lg:min-w-[440px] p-2"
            >
              <img
                src={img}
                alt="Impactful event or program by The Vanrang Foundation"
                className="w-full h-[170px] md:h-[400px] object-cover rounded-2xl border-2 border-accent shadow-md"
                loading="lazy"
                style={{ backgroundColor: "var(--clr-surface, #fff)" }}
              />
            </div>
          ))}
        </motion.div>
        {/* Gallery Button: primary button, warm red, modern NGO */}
        <div className="flex justify-center mt-10 absolute left-0 right-0 bottom-6 md:bottom-10 z-30">
          
           <a href="/gallery"
            className="inline-block px-8 py-3 rounded-lg sm:rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-xl transition text-lg tracking-wide focus:outline-none ring-2 ring-primary/20 font-serif"
            style={{ letterSpacing: "0.03em" }}
            onClick={handleGalleryButtonClick}
          >
            See Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}