import React, { useState, useEffect } from "react";

// Reuse images from GalleryCarousel.js
const images = [
  "/assets/Img1.jpeg",
  "/assets/Img2.jpeg",
  "/assets/Img3.jpeg",
  "/assets/Img4.jpeg",
  "/assets/Img5.jpeg",
  "/assets/Img6.jpeg",
];

/*
  Assumes your Tailwind config or global CSS contains:
  :root {
    --clr-primary: #E76F51;
    --clr-primary-dark: #c85033;
    --clr-secondary: #F4A261;
    --clr-secondary-dark: #d38736;
    --clr-accent: #E9C46A;
    --clr-background: #FDF6EC;
    --clr-surface: #ffffff;
    --clr-text-primary: #2D2D2D;
    --clr-text-secondary: #6B6B6B;
  }
*/

export default function VolunteerSection() {
  // Handler to scroll to top on link click
  const handleVolunteerClick = (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Carousel state and fade states
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeOut = setTimeout(() => setFade(false), 3300);
    const nextImage = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 4000);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(nextImage);
    };
  }, [index]);

  return (
    <section className="bg-background py-10 xs:py-14 sm:py-16 px-2 xs:px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-surface rounded-lg xs:rounded-xl p-4 xs:p-6 sm:p-9 md:p-10 shadow-xl border border-accent/40">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 xs:gap-10 md:gap-12 items-center">
          {/* Left: Fading Circle Image Carousel */}
          <div className="flex justify-center items-center w-full mb-8 md:mb-0 min-h-[200px] xs:min-h-[250px] sm:min-h-[290px]">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              {images.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt={`Vanrang Foundation Gallery ${i + 1}`}
                  className={`
                    rounded-full border-4 border-accent shadow-lg object-cover absolute left-0 top-0
                    transition-opacity duration-700 ease-in-out
                    ${i === index ? (fade ? "opacity-100 z-10" : "opacity-0 z-10") : "opacity-0 z-0"}
                  `}
                  style={{
                    transition: "opacity 0.7s ease-in-out",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 xs:mb-4 text-primary">
              Join Our Volunteer Force
            </h2>
            <p className="text-secondary leading-relaxed mb-6 text-base xs:text-lg">
              At{" "}
              <span className="font-semibold text-primary">
                The Vanrang Foundation
              </span>
              , we believe in the power of collective action for a sustainable and just future.<br className="hidden xs:inline" />
              Become a part of a movement that plants trees, inspires social responsibility in schools, empowers youth, supports women, and uplifts rural communities.<br className="hidden xs:inline" />
              As a volunteer, you’ll participate in drives, educational outreach, skill-building, and hands-on community development. Your time, energy, and passion will foster change, nurture hope, and uplift lives.<br className="hidden xs:inline" />
              <br className="hidden xs:inline" />
              <span className="font-semibold text-accent">
                One World, One Family
              </span>
              —together, let’s turn compassion into action and hope into lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className={`
                  bg-primary hover:bg-primary-dark text-white px-6 xs:px-8 py-2.5 xs:py-3 rounded-lg
                  font-semibold transition-colors shadow-lg inline-block text-center text-base xs:text-lg w-full sm:w-auto
                  focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-70
                `}
                onClick={handleVolunteerClick}
                style={{
                  letterSpacing: "0.5px",
                }}
              >
                BECOME A VOLUNTEER
              </a>
              {/* Example of secondary button usage, add if needed in future:
              <a
                href="#secondary"
                className="bg-secondary hover:bg-secondary-dark text-text-primary px-6 xs:px-8 py-2.5 xs:py-3 rounded-lg font-semibold transition-colors shadow-md inline-block text-center text-base xs:text-lg w-full sm:w-auto"
              >
                LEARN MORE
              </a> 
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}