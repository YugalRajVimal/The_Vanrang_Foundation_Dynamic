import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../api/client";

// For displaying uploaded image URLs correctly:
const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";
function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath; // already absolute url
  return `${API_UPLOAD_URL.replace(/\/$/, "")}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

const images = [
  "/assets/Img1.jpeg",
  "/assets/Img2.jpeg",
  "/assets/Img3.jpeg",
  "/assets/Img4.jpeg",
  "/assets/Img5.jpeg",
  "/assets/Img6.jpeg",
];

export default function AboutUs() {
  const handleLinkClick = (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [index, setIndex] = useState(0);

  // fetch counters (wrapped in { counters: Array })
  const {
    data: countersResponse,
    loading: countersLoading,
    error: countersError,
  } = useFetch(() => api.get("/counters", { auth: false }), []);

  // Extract the actual counters array. May be null or { counters: Array }, or direct array.
  let countersArr = [];
  if (Array.isArray(countersResponse)) {
    countersArr = countersResponse;
  } else if (
    countersResponse &&
    typeof countersResponse === "object" &&
    Array.isArray(countersResponse.counters)
  ) {
    countersArr = countersResponse.counters;
  }

  useEffect(() => {
    console.log("Fetched counters data:", countersResponse);
  }, [countersResponse]);

  useEffect(() => {
    const timeout1 = setTimeout(() => {}, 3500);
    const timeout2 = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [index]);

  // Sort and display correct counter fields
  const sortedCounters = Array.isArray(countersArr)
    ? [...countersArr].sort(
        (a, b) =>
          (a.order || a.Order || 0) - (b.order || b.Order || 0)
      )
    : [];

  // Simple debug UI at top for unexpected data
  const showDebug =
    countersResponse === null ||
    (typeof countersResponse === "object" && countersResponse.counters);

  return (
    <section className="bg-bg pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-2 xs:px-3 sm:px-4">
        {/* Debug panel for raw data (remove in production) */}
        {showDebug && (
          <div className="mb-4 px-4 py-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 break-all">
            <div>
              <b>DEBUG: Fetched counters data:</b>
            </div>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(countersResponse, null, 2)}
            </pre>
          </div>
        )}
        <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row items-center gap-8 xs:gap-10 lg:gap-14 xl:gap-20 mb-8 sm:mb-10">
          {/* Left content */}
          <div className="flex-1 w-full lg:w-1/2 text-left order-2 lg:order-1">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-2">
              The Vanrang Foundation
            </h2>
            <p className="font-serif text-accent font-semibold mt-2 text-lg xs:text-xl md:text-2xl mb-4 xs:mb-6">
              One World, One Family
            </p>
            <h3 className="font-serif text-xl xs:text-2xl md:text-3xl font-semibold text-text-primary mb-4 xs:mb-6">
              Empowering Communities, Inspiring Change
            </h3>
            <p className="text-text-secondary leading-relaxed max-w-xl mb-7 xs:mb-8 text-sm xs:text-base sm:text-lg">
              The Vanrang Foundation is a non-profit dedicated to building a brighter, more inclusive, and sustainable future. Our social impact initiatives span education, health, women & youth empowerment, rural upliftment, and environmental stewardship.<br /><br />
              We partner with youth, schools, and grassroots communities for impactful humanitarian projects that nurture hope and catalyze positive change. Join us in uplifting lives, spreading awareness, and shaping a more compassionate world—One World, One Family.
            </p>
            <div className="mb-0 flex flex-wrap gap-3">
              <a
                href="/about"
                className="inline-block px-5 xs:px-7 py-2.5 xs:py-3 rounded-lg font-semibold bg-primary text-white shadow-theme hover:bg-primary-dark focus:bg-primary-dark transition text-base xs:text-lg focus:outline-none"
                style={{ letterSpacing: "0.03em" }}
                onClick={handleLinkClick}
              >
                Know More
              </a>
              <a
                href="/donate"
                className="inline-block px-5 xs:px-7 py-2.5 xs:py-3 rounded-lg font-semibold bg-secondary text-white shadow-theme hover:bg-secondary-dark focus:bg-secondary-dark transition text-base xs:text-lg focus:outline-none"
                style={{ letterSpacing: "0.03em" }}
                onClick={handleLinkClick}
              >
                Donate Now
              </a>
            </div>
          </div>
          {/* Right image with fading slider */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center items-center min-h-[180px] xs:min-h-[200px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[280px] order-1 lg:order-2 mb-6 lg:mb-0">
            <div
              className="
                relative w-full 
                max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg 
                aspect-[5/4] xs:aspect-[16/10] sm:aspect-[16/9] 
                h-[170px] xs:h-[210px] sm:h-[260px] md:h-[300px] lg:h-[320px] 
                flex items-center justify-center
              "
              style={{ minHeight: 140 }}
            >
              {images.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt={`The Vanrang Foundation Work ${i + 1}`}
                  className={
                    `rounded-xl shadow-lg w-full h-full object-cover absolute top-0 left-0
                    transition-opacity duration-700 ease-in-out
                    ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`
                  }
                  style={{
                    minHeight: 140,
                    transition: "opacity 0.7s ease-in-out"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Stats Bar - alternates surface color (white) */}
      <div className="relative w-full bg-surface mt-12 xs:mt-16 shadow-sm">
        <div className="
          max-w-7xl mx-auto 
          grid grid-cols-2 sm:grid-cols-4 
          gap-4 xs:gap-6 md:gap-8 
          py-5 xs:py-6 md:py-7 
          px-2 xs:px-4
        ">
          {countersLoading && (
            <>
              <Stat loading />
              <Stat loading />
              <Stat loading />
              <Stat loading />
            </>
          )}

          {countersError && (
            <div className="col-span-4 text-center py-4 text-red-500">Failed to load stats.</div>
          )}

          {!countersLoading && !countersError && sortedCounters.map((c) => {
            const title = c.title ?? c.Title ?? "";
            const count =
              typeof c.count === "number"
                ? c.count
                : typeof c.Count === "number"
                  ? c.Count
                  : "";
            const suffix = c.suffix ?? c.Suffix ?? "";
            const image = c.image ?? c.Image ?? "";
            return (
              <Stat
                key={c._id || title}
                number={
                  <span className="text-primary">
                    {typeof count === "number" || typeof count === "string"
                      ? Number(count).toLocaleString()
                      : ""}
                    {suffix}
                  </span>
                }
                label={
                  <span className="text-accent-dark">
                    {title}
                  </span>
                }
                image={image ? getImageUrl(image) : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// No icons, just stat image or placeholder (empty fallback)
function Stat({ number, label, image, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center text-center gap-2 min-w-0 bg-white rounded-xl px-2 py-4 shadow-card animate-pulse">
        <div className="bg-gray-200 rounded-full h-10 w-10 mb-1" />
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-100 rounded mt-1"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-center gap-2 min-w-0 bg-white rounded-xl px-2 py-4 shadow-card">
      {image ? (
        <img
          src={image}
          alt={typeof label === "string" ? label : "Stat"}
          className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 mb-1 rounded-full object-cover shadow"
          loading="lazy"
        />
      ) : (
        <div className="text-2xl xs:text-3xl sm:text-4xl mb-1" />
      )}
      <h4 className="font-serif font-bold text-base xs:text-lg sm:text-xl text-primary">{number}</h4>
      <p className="text-text-secondary text-xs xs:text-sm sm:text-base font-semibold break-words">{label}</p>
    </div>
  );
}