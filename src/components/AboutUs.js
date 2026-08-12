
import { useState, useEffect } from "react";
import { FaTree, FaLeaf, FaHandsHelping, FaUserFriends } from "react-icons/fa";

// images taken from GalleryCarousel.js
const images = [
  "/assets/Img1.jpeg",
  "/assets/Img2.jpeg",
  "/assets/Img3.jpeg",
  "/assets/Img4.jpeg",
  "/assets/Img5.jpeg",
  "/assets/Img6.jpeg",
];

// --- THEME: Define CSS vars in global styles or Tailwind config. ---
// Example (for global CSS, not needed here if Tailwind config is used):
// :root {
//   --clr-primary: #E76F51;
//   --clr-primary-dark: #c85033;
//   --clr-secondary: #F4A261;
//   --clr-secondary-dark: #d38736;
//   --clr-accent: #E9C46A;
//   --clr-background: #FDF6EC;
//   --clr-surface: #ffffff;
//   --clr-text-primary: #2D2D2D;
//   --clr-text-secondary: #6B6B6B;
// }

export default function AboutUs() {
  // Handler to scroll to top on link click
  const handleLinkClick = (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Carousel state for About image
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      // fade handled in CSS transition classes
    }, 3500); // Image visible for ~3.5s

    const timeout2 = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Fade and change every 4s

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [index]);

  return (
    <section
      className="bg-bg pt-16 sm:pt-20"
      // bg-[var(--clr-background)] if using vanilla CSS vars
    >
      <div className="mx-auto max-w-7xl px-2 xs:px-3 sm:px-4">
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
            <div className="mb-0">
              <a
                href="/about"
                className="inline-block px-5 xs:px-7 py-2.5 xs:py-3 rounded-lg font-semibold bg-primary text-white shadow-theme hover:bg-primary-dark focus:bg-primary-dark transition text-base xs:text-lg focus:outline-none"
                style={{ letterSpacing: "0.03em" }}
                onClick={handleLinkClick}
              >
                Know More
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
          <Stat
            icon={<FaTree className="text-accent-dark" />}
            number={<span className="text-primary">200K+</span>}
            label={<span className="text-accent-dark">{`Trees Planted`}</span>}
          />
          <Stat
            icon={<FaUserFriends className="text-secondary" />}
            number={<span className="text-primary">10K+</span>}
            label={
              <span className="text-secondary">{`Youth & Volunteers`}</span>
            }
          />
          <Stat
            icon={<FaHandsHelping className="text-primary" />}
            number={<span className="text-primary">350+</span>}
            label={<span className="text-primary">{`Community Programs`}</span>}
          />
          <Stat
            icon={<FaLeaf className="text-secondary" />}
            number={<span className="text-primary">100+</span>}
            label={<span className="text-secondary">{`Schools Reached`}</span>}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, number, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 min-w-0 bg-white rounded-xl px-2 py-4 shadow-card">
      <div className="text-2xl xs:text-3xl sm:text-4xl mb-1">{icon}</div>
      <h4 className="font-serif font-bold text-base xs:text-lg sm:text-xl text-primary">{number}</h4>
      <p className="text-text-secondary text-xs xs:text-sm sm:text-base font-semibold break-words">{label}</p>
    </div>
  );
}

/*
To support this theming:
- The Tailwind config should map: 
  bg-primary, bg-primary-dark, bg-secondary, bg-secondary-dark, 
  bg-accent, bg-accent-dark, bg-bg (background), bg-surface, 
  text-primary, text-secondary, text-accent, text-accent-dark, 
  text-bg, text-surface, text-text-primary, text-text-secondary, etc.

- Example of shadows in Tailwind config:
  "shadow-theme": "0 2px 10px 0 #E76F511A", 
  "shadow-card": "0 2px 8px 0 rgba(231,111,81,0.09)",
  etc.

- Use :focus and :hover classes for accessibly strong states.

- Remove all green and replace with hues and classes as above.

- Use "bg-bg" for light beige sections, "bg-surface" for white card/alternate backgrounds.

- If not using Tailwind for variables, use global :root { --var } as comments above.
*/
