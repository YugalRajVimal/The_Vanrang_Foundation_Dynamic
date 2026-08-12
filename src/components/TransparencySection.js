import { FaRegFileAlt } from "react-icons/fa";
import { GiTreeGrowth } from "react-icons/gi";
import { RiMedalLine } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { Link } from "react-router-dom";

// Use theme color variables defined globally in Tailwind config or CSS (see implementation requirements)
// Example Tailwind config theme extension for reference:
/*
  theme: {
    extend: {
      colors: {
        primary: "#E76F51",
        "primary-dark": "#c85033",
        secondary: "#F4A261",
        "secondary-dark": "#d38736",
        accent: "#E9C46A",
        background: "#FDF6EC",
        surface: "#FFFFFF",
        "text-primary": "#2D2D2D",
        "text-secondary": "#6B6B6B"
      }
    }
  }
*/

// Updated Heading component with new theme
function TransparencyHeroHeading() {
  return (
    <div className="text-center mb-10 xs:mb-14 sm:mb-16 md:mb-20 px-2">
      <h2 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-primary drop-shadow-md tracking-tight leading-tight">
        Radical Transparency in Action
      </h2>
      <div className="flex justify-center">
        <span className="bg-accent/20 shadow-md border border-accent/40 rounded-full px-4 py-2 sm:px-8 sm:py-3 mt-4 sm:mt-5 inline-block text-secondary font-bold text-base xs:text-lg sm:text-2xl tracking-wide font-serif">
          See Every Impact, Every Life
        </span>
      </div>
      <p className="mt-5 sm:mt-8 text-base xs:text-lg sm:text-xl max-w-sm xs:max-w-lg sm:max-w-2xl mx-auto text-secondary font-medium px-2">
        Witness evidence-backed stories, transparent programs, and trusted outcomes—because community, youth, and every cause deserve open trust.
      </p>
    </div>
  );
}

export default function TransparencySection() {
  // Use updated palette and icon representation for humanitarian/NGO themes
  const items = [
    {
      icon: (
        <span className="bg-gradient-to-tr from-primary/90 to-secondary/90 flex items-center justify-center rounded-full shadow-xl w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mb-2 border-4 border-background">
          {/* Sizes for responsive UX */}
          <GiTreeGrowth size={32} className="text-primary  drop-shadow-lg xs:hidden" />
          <GiTreeGrowth size={42} className="text-primary  drop-shadow-lg hidden xs:inline-block sm:hidden" />
          <GiTreeGrowth size={50} className="text-primary  drop-shadow-lg hidden sm:inline-block" />
        </span>
      ),
      title: "Transparent Tree Plantation",
      desc: "Every sapling is geo-tagged, photographed, and accounted for—just one way we build open trust in our community and environmental work.",
    },
    {
      icon: (
        <span className="bg-gradient-to-tr from-accent/90 to-secondary/80 flex items-center justify-center rounded-full shadow-xl w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mb-2 border-4 border-background">
          <RiMedalLine size={32} className="text-primary drop-shadow-lg xs:hidden" />
          <RiMedalLine size={42} className="text-primary drop-shadow-lg hidden xs:inline-block sm:hidden" />
          <RiMedalLine size={50} className="text-primary drop-shadow-lg hidden sm:inline-block" />
        </span>
      ),
      title: "Verified Initiatives, Real Stories",
      desc: "All campaigns are validated by event photos, stories and authentic testimonials—fostering donor confidence and real engagement for all causes.",
    },
    {
      icon: (
        <span className="bg-gradient-to-tr from-secondary/80 to-primary/60 flex items-center justify-center rounded-full shadow-xl w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mb-2 border-4 border-background">
          <BsPeopleFill size={32} className="text-primary drop-shadow-lg xs:hidden" />
          <BsPeopleFill size={42} className="text-primary drop-shadow-lg hidden xs:inline-block sm:hidden" />
          <BsPeopleFill size={50} className="text-primary drop-shadow-lg hidden sm:inline-block" />
        </span>
      ),
      title: "Open Community Impact Reports",
      desc: "We publish easy-to-understand, accessible updates for every project: from youth empowerment to rural health and education outreach.",
    },
  ];

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Section alternates between beige and white as part of overall site rhythm
  return (
    <section className="bg-[#fdf6ec] py-12 xs:py-16 sm:py-20 md:py-24 px-2 xs:px-4 sm:px-6 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <TransparencyHeroHeading />
        {/* Responsive Modern Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 text-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center gap-3 xs:gap-4 px-4 xs:px-5 sm:px-6 py-7 xs:py-10 rounded-2xl sm:rounded-3xl bg-surface shadow-lg transition hover:shadow-2xl hover:-translate-y-2 ring-1 ring-accent/40"
            >
              {item.icon}
              <h3 className="font-serif text-lg xs:text-xl sm:text-2xl font-semibold text-primary mb-1 sm:mb-2 group-hover:text-primary-dark transition">
                {item.title}
              </h3>
              <p className="text-text-secondary max-w-[19rem] xs:max-w-xs leading-relaxed font-medium text-sm xs:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        {/* Modern Primary Button */}
        <div className="mt-10 xs:mt-14 sm:mt-16 md:mt-20 flex justify-center">
          <Link
            to="/plantation-drives"
            className="inline-block px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-lg sm:rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-xl transition text-lg xs:text-xl tracking-wide focus:outline-none ring-2 ring-primary/20 font-serif"
            onClick={handleLinkClick}
          >
            View Plantation Drives
          </Link>
        </div>
      </div>
    </section>
  );
}