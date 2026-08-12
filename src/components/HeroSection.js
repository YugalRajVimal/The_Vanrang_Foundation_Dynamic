import { useEffect, useRef, useState } from "react";
import { FaTree } from "react-icons/fa";

// Theme Colors
const COLORS = {
  primary: "#E76F51",
  secondary: "#F4A261",
  accent: "#E9C46A",
  background: "#FDF6EC",
  surface: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#6B6B6B",
};

// Hero images (same as before)
const heroImages = [
  "/assets/Img1.jpeg",
  "/assets/Img2.jpeg",
  "/assets/Img3.jpeg",
  "/assets/Img4.jpeg",
  "/assets/Img5.jpeg",
  "/assets/Img6.jpeg",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const timeoutRef = useRef();

  // Smooth scroll to top on action
  const handleLinkClick = (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setFade(false), 3900);
    const changeImage = setTimeout(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
      setFade(true);
    }, 4500);
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(changeImage);
    };
  }, [index]);

  return (
    <section
      className="relative w-full pt-20 min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex flex-col justify-center md:justify-end overflow-hidden"
      style={{
        // Use background color from palette
        background: COLORS.background,
        color: COLORS.textPrimary,
      }}
    >
      {/* Fading Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('${heroImages[index]}')`,
        }}
        aria-hidden="true"
      />

      {/* Stronger Gradient Overlay for Text Visibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            // gradient transitions from deep warm-red to accent yellow, with some transparency
            `linear-gradient(to top, ${COLORS.primary}cc 10%, ${COLORS.secondary}cc 20%, ${COLORS.accent}99 30%)`,
          opacity: 0.47,
        }}
      ></div>

      {/* Slight blur overlay for more clarity */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 w-full z-10 h-full">
        {/* Top Branding Responsive */}
        <div className="relative pt-10 sm:pt-14 md:pt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-8">
          <div className="flex items-center gap-4 md:gap-8">
            <div>
              <p
                className="text-3xl md:text-5xl font-bold uppercase tracking-[.22em] sm:tracking-[.27em] drop-shadow-lg mb-1 sm:mb-2 md:mb-4 leading-tight font-serif"
                style={{
                  color: COLORS.surface,
                  textShadow: `0 3px 18px ${COLORS.primary}55, 0 1.5px 4px ${COLORS.accent}44`,
                }}
              >
                The Vanrang Foundation
              </p>
              <h2
                className="text-lg xs:text-xl sm:text-2xl md:text-4xl font-extrabold drop-shadow-2xl leading-tight font-serif"
                style={{
                  letterSpacing: ".06em",
                  color: COLORS.surface,
                  textShadow: `0 2px 14px ${COLORS.secondary}40, 0 1.5px 3px ${COLORS.primary}29`,
                }}
              >
                One World,{" "}
                <span style={{ color: COLORS.accent }}>
                  One Family
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Info Card Responsive Placement */}
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-end pb-2 mt-6 md:mt-0 xs:pb-4 sm:pb-8 md:pb-0 w-full">
          {/* Invisible placeholder on left for md+ screens */}
          <div className="hidden md:block md:w-2/5"></div>
          {/* Info card on right */}
          <div className="flex justify-center md:justify-end w-full md:w-auto pb-7 xs:pb-10 md:pb-24">
            <div
              className="backdrop-blur-md rounded-2xl xs:rounded-3xl p-5 xs:p-7 md:p-8 max-w-md sm:max-w-lg w-full shadow-2xl border md:border-2"
              style={{
                background: COLORS.surface + "F2", // translucent surface
                borderColor: COLORS.accent,
              }}
            >
              <h3
                className="text-2xl xs:text-3xl font-bold mb-3 xs:mb-5 font-serif"
                style={{
                  color: COLORS.primary,
                  textShadow: `0 1px 1px ${COLORS.secondary}4d`,
                }}
              >
                Together, Let’s Grow a Greener Future
              </h3>
              <p
                className="leading-relaxed text-sm xs:text-base md:text-lg font-medium"
                style={{
                  color: COLORS.textSecondary,
                }}
              >
                <span
                  className="px-1 py-0.5 rounded-md"
                  style={{
                    background: COLORS.accent + "33", // very light yellow
                  }}
                >
                  The Vanrang Foundation is committed to restoring our environment through tree plantation, urban and rural greening, and spreading ecological awareness.
                </span>
                <br />
                <br />
                We empower communities and youth, organize{" "}
                <span
                  className="font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  school drives
                </span>
                , and develop grassroots programs for collective responsibility for our planet.
                <br />
                <br />
                <span
                  className="font-bold"
                  style={{ color: COLORS.secondary }}
                >
                  Be part of One World, One Family—
                </span>
                <span style={{ color: COLORS.textPrimary }}>
                  {" "}
                  join us to plant hope, nurture change, and transform lives with every tree.
                </span>
              </p>
              <div className="mt-6 xs:mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-block px-5 xs:px-6 py-3 rounded-lg font-semibold shadow-lg transition text-center"
                  style={{
                    background: COLORS.primary,
                    color: COLORS.surface,
                    letterSpacing: "0.03em",
                    boxShadow: `0 2px 16px ${COLORS.primary}33, 0 1.5px 5px ${COLORS.accent}22`,
                  }}
                  onClick={handleLinkClick}
                >
                  Get Involved
                </a>
                <a
                  href="/about"
                  className="inline-block px-5 xs:px-6 py-3 rounded-lg font-semibold transition text-center border"
                  style={{
                    background: COLORS.accent + "22",
                    color: COLORS.primary,
                    borderColor: COLORS.secondary,
                    letterSpacing: "0.03em",
                  }}
                  onClick={handleLinkClick}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
