import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiChevronRight, FiCamera, FiUsers, FiBookOpen, FiArrowRight, FiStar } from "react-icons/fi";
import { MdForest, MdSchool, MdPeople, MdFavorite, MdVolunteerActivism, MdVerified } from "react-icons/md";
import { BsShieldCheck, BsFileText } from "react-icons/bs";

const ORANGE = "#fb8500";
const ORANGE_DARK = "#ff6600";
const ORANGE_LIGHT = "#fff1e6";
const ORANGE_MED = "#ffd6a5";
const ORANGE_EXTRA = "#ffe5c3";
const WHITE = "#fff";

const SwiperStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    .swiper { width: 100%; height: 100%; border-radius: 20px; }
    .swiper-slide img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }
    .swiper-button-next, .swiper-button-prev { color: white !important; background: rgba(251,133,0,0.50); width: 38px !important; height: 38px !important; border-radius: 50%; }
    .swiper-button-next::after, .swiper-button-prev::after { font-size: 14px !important; font-weight: 700; }
    .swiper-pagination-bullet-active { background: ${ORANGE} !important; }
    .cause-card:hover .cause-arrow { transform: translateX(4px); }
    .gradient-text { background: linear-gradient(135deg, #fb8500, #ffb703); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-bg { background: linear-gradient(135deg, #fff 0%, #ffe5c3 50%, #ffd6a5 100%); }
    .cause-card-bg { background: linear-gradient(145deg, #fff, ${ORANGE_LIGHT}); }
  `}</style>
);

const navCauses = {
  "Tree Plantation": ["Urban Tree Plantation Drives", "Community Fruit Orchards", "Native Species Restoration", "Urban Forests Creation", "School Campus Plantation", "Sapling Distribution", "Corporate Plantation Partnerships"],
  "Education and Awareness": ["Eco-Awareness School Programs", "Green Curriculum Workshops", "Student Green Leader Training", "Climate Change Sessions", "Biodiversity Awareness Events"],
  "Community Programs": ["Rural Greening Initiatives", "Village Clean-ups", "Soil & Water Conservation Drives", "Adopt-a-Park Projects", "Kitchen Gardens for Families"],
  "Women & Youth Empowerment": ["Skill-Building for Green Jobs", "Women's Eco-Entrepreneurship", "Youth Climate Action Fellowships", "Volunteer Opportunities"],
};

const causeCategories = [
  { id: "plantation", icon: MdForest, label: "Tree Plantation", count: 7, color: ORANGE, light: ORANGE_LIGHT, desc: "Restoring green cover and native biodiversity" },
  { id: "education", icon: MdSchool, label: "Education and Awareness", count: 5, color: "#fb9f34", light: "#fff6ed", desc: "Spreading ecological literacy and leadership" },
  { id: "community", icon: MdPeople, label: "Community Programs", count: 5, color: "#e76f51", light: "#fff2ea", desc: "Uplifting rural and urban areas together" },
  { id: "womenyouth", icon: MdVolunteerActivism, label: "Women & Youth Empowerment", count: 4, color: "#f99b45", light: "#fff7ec", desc: "Green skill-building and leadership" },
];

const featuredCause = {
  title: "Urban Tree Plantation Drive",
  desc: "Launching large-scale plantation of native and fruit trees in city spaces to create lasting green corridors and improve urban well-being.",
  impact: ["Geo-tagged & photographed trees", "Community volunteers & school students participate", "Partnerships with local governments", "Long-term care and monitoring"],
  slogan: "Every tree planted transforms lives and climate resilience in your city.",
  images: ["/assets/Img1.jpeg", "/assets/Img2.jpeg", "/assets/Img3.jpeg", "/assets/Img4.jpeg"],
};

const galleryImages = ["/assets/Img1.jpeg", "/assets/Img2.jpeg", "/assets/Img3.jpeg", "/assets/Img4.jpeg"];

const impactStats = [
  { label: "Trees Planted", value: "200K+", icon: MdForest },
  { label: "Youth & Volunteers", value: "10K+", icon: FiUsers },
  { label: "Community Programs", value: "350+", icon: FiBookOpen },
  { label: "Schools Reached", value: "100+", icon: FiStar },
];

const trustBadges = [
  { icon: BsShieldCheck, title: "Verified Initiatives", sub: "Geo-tagged, photographed & open reports" },
  { icon: FiCamera, title: "Transparent Gallery", sub: "Photo proof for every drive" },
  { icon: BsFileText, title: "Open Updates", sub: "Impact reports for all projects" },
];

const HeroBanner = () => (
  <section className="hero-bg pt-28 pb-16 px-4 overflow-hidden relative">
    <div className="absolute top-12 right-12 w-64 h-64 rounded-full" style={{ background: "#ffd6a5cc", filter: "blur(68px)" }} />
    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: "#fff1e6b8", filter: "blur(48px)" }} />
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <motion.div className="flex-1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4" style={{ background: ORANGE_LIGHT, color: ORANGE }}>
            <MdVerified size={15} /> The Vanrang Foundation · One World, One Family
          </div>
          <h1 className="font-black text-4xl sm:text-5xl text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Uplift Earth. <span className="gradient-text">Plant Hope,</span> <br /> Transform Communities.
          </h1>
          <p className="text-gray-700 text-base leading-relaxed mb-6 max-w-lg">
            The Vanrang Foundation is committed to restoring our environment through tree plantation, community
            greening, and social impact. Join our youth, volunteers, and partners to nurture change across India.
          </p>
          <div className="flex gap-3 flex-wrap">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} href="#get-involved" className="px-6 py-3"
              style={{ background: ORANGE, color: WHITE, borderRadius: "1rem", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 4px 16px #ffd6a57b" }}>
              <span className="flex items-center gap-2"><MdFavorite /> Get Involved</span>
            </motion.a>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="#more"
              className="px-6 py-3 border-2 rounded-2xl font-semibold text-sm transition-colors flex items-center gap-2"
              style={{ borderColor: ORANGE_LIGHT, color: ORANGE, background: WHITE }}>
              Learn More <FiArrowRight />
            </motion.a>
          </div>
        </motion.div>
        <motion.div className="flex-1 grid grid-cols-2 gap-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {impactStats.map((s, i) => (
            <motion.div key={s.label} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: ORANGE_LIGHT }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.09 }}>
              <s.icon className="mb-2" style={{ color: ORANGE }} size={24} />
              <div className="font-black text-2xl text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const CauseCategories = ({ active, setActive }) => (
  <section className="py-12 px-4 bg-white">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
        <div className="inline-block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: ORANGE }}>Browse by Category</div>
        <h2 className="text-3xl font-black text-gray-900">Our Major Causes</h2>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {causeCategories.map((c, i) => (
          <motion.div key={c.id} onClick={() => setActive(c.id)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.09 }} whileHover={{ y: -8 }}
            className={`cause-card cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 border-2 ${active === c.id ? "shadow-lg" : ""}`}
            style={{ borderColor: active === c.id ? c.color : "transparent", boxShadow: active === c.id ? "0 8px 36px #ffb70355" : undefined, background: active === c.id ? c.light : ORANGE_EXTRA }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: c.light }}>
              <c.icon size={28} style={{ color: c.color }} />
            </div>
            <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{c.label}</div>
            <div className="text-gray-400 text-xs">{c.count} programs</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold cause-arrow transition-transform duration-300" style={{ color: c.color }}>
              View <FiChevronRight size={13} />
            </div>
            <div className="text-xs text-gray-500 mt-2">{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CausesList = ({ activeCategory }) => {
  const catMap = { plantation: "Tree Plantation", education: "Education and Awareness", community: "Community Programs", womenyouth: "Women & Youth Empowerment" };
  const selectedCat = causeCategories.find((c) => c.id === activeCategory) || causeCategories[0];
  const programs = navCauses[catMap[activeCategory]] || [];
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedCat.light }}>
            <selectedCat.icon size={22} style={{ color: selectedCat.color }} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">{programs.length} programs</div>
            <h3 className="font-black text-xl text-gray-900">{selectedCat.label}</h3>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {programs.map((name, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }}
              className="cause-card-bg rounded-2xl p-6 border cursor-pointer group hover:shadow-md transition-all" style={{ borderColor: ORANGE_LIGHT, background: ORANGE_LIGHT }}>
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: selectedCat.light }}>
                <selectedCat.icon size={20} style={{ color: selectedCat.color }} />
              </div>
              <div className="font-bold text-gray-900 text-sm mb-1">{name}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-black text-xs" style={{ color: ORANGE }}>Learn More</span>
                <button className="w-7 h-7 rounded-full" style={{ background: ORANGE_EXTRA, color: ORANGE }}><FiArrowRight size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedCauseDetail = () => (
  <section className="py-16 px-4" style={{ background: `linear-gradient(135deg, ${ORANGE_LIGHT} 0%, ${ORANGE_EXTRA} 90%)` }}>
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 rounded-full" style={{ background: ORANGE }} />
        <div>
          <div className="text-xs font-bold tracking-widest uppercase" style={{ color: ORANGE }}>FEATURED CAUSE</div>
          <h2 className="text-2xl font-black text-gray-900">{featuredCause.title}</h2>
        </div>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 6px 36px #fb850029" }}>
          <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 3700, disableOnInteraction: false }} loop
            className="w-full h-full" style={{ height: "380px" }}>
            {featuredCause.images.map((img, i) => (
              <SwiperSlide key={i}><img src={img} alt={`featured-${i}`} className="w-full h-full object-cover" /></SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-7 border" style={{ borderColor: ORANGE_LIGHT, boxShadow: "0 6px 32px #fb850030" }}>
          <h3 className="text-2xl font-black text-gray-900 mb-2">{featuredCause.title}</h3>
          <div className="font-semibold mb-3" style={{ color: ORANGE }}>{featuredCause.slogan}</div>
          <div className="mb-5 text-gray-700 text-sm">{featuredCause.desc}</div>
          <ul className="mb-5 list-disc pl-5 text-gray-600 text-sm space-y-1">
            {featuredCause.impact.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
          <div className="flex flex-wrap gap-3 mb-4">
            {trustBadges.map((b) => (
              <div key={b.title} className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: ORANGE_EXTRA }}>
                <b.icon className="flex-shrink-0" style={{ color: ORANGE }} size={18} />
                <div>
                  <div className="font-semibold text-gray-800 text-xs">{b.title}</div>
                  <div className="text-gray-400 text-[10px]">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href="#get-involved"
            className="w-full flex py-3 font-black rounded-xl text-base shadow-lg transition-colors mb-2 items-center justify-center gap-2"
            style={{ background: ORANGE, color: WHITE, boxShadow: "0 6px 32px #fb850038" }}>
            <MdVolunteerActivism /> Join Plantation Drives
          </motion.a>
        </motion.div>
      </div>
    </div>
  </section>
);

const MissionSection = () => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: ORANGE }}>OUR MISSION</div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
            The Vanrang Foundation: One World, One Family
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Vanrang Foundation is a non-profit dedicated to building a brighter, more inclusive, and sustainable
            future. Our impact ranges from tree plantation and environmental education to empowering women, youth,
            and uplifting rural communities across India.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            We inspire collective responsibility, nurture hope, and catalyze lasting change through community
            projects, school programs, and youth leadership. Join us—together, let's grow a greener world.
          </p>
          <div className="flex flex-wrap gap-3">
            {impactStats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl px-5 py-3 text-center" style={{ background: ORANGE_EXTRA }}>
                <div className="font-black" style={{ color: ORANGE, fontSize: "1.18rem" }}>{value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900 relative" style={{ boxShadow: "0 8px 38px #ffb70344" }}>
            <img src="/assets/Img5.jpeg" alt="vanrang-mission" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                style={{ boxShadow: "0 4px 16px #fb850035", border: `2px solid ${ORANGE}` }}>
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px]" style={{ borderLeftColor: ORANGE, marginLeft: "4px" }} />
              </motion.div>
            </div>
          </div>
          <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-4 -left-4 rounded-2xl px-4 py-3 shadow-xl"
            style={{ background: ORANGE, color: WHITE, boxShadow: "0 8px 38px #ffb70325" }}>
            <div className="font-black text-lg leading-none">One Family</div>
            <div className="text-xs" style={{ color: "#fff6ed" }}>Greening Communities</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section className="py-16 px-4" style={{ background: `linear-gradient(135deg, ${ORANGE_LIGHT} 0%, ${ORANGE_EXTRA} 100%)` }}>
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: ORANGE }}>GALLERY</div>
          <h2 className="text-3xl font-black text-gray-900">Our Impact in Photos</h2>
        </div>
        <a href="/gallery" className="flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all" style={{ color: ORANGE_DARK }}>
          See Full Gallery <FiArrowRight />
        </a>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.03 }}
            className="relative group rounded-2xl overflow-hidden aspect-square shadow-md cursor-pointer" style={{ boxShadow: "0 4px 18px #fb850022" }}>
            <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <FiCamera className="text-white" size={28} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTABanner = () => (
  <section className="py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl p-10 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)` }}>
        <MdVolunteerActivism className="text-white/40 mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-black text-white mb-3">Become a Volunteer</h2>
        <p className="text-base mb-7 max-w-lg mx-auto" style={{ color: ORANGE_LIGHT }}>
          Join The Vanrang Foundation's volunteer movement! Be the force behind tree plantation, school
          eco-programs, and community empowerment.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <motion.a href="/contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="px-8 py-3.5 font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: WHITE, color: ORANGE, fontWeight: 900 }}>
            Become a Volunteer
          </motion.a>
          <motion.a href="/contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="px-8 py-3.5 font-bold rounded-2xl border transition-all"
            style={{ background: `${ORANGE}26`, color: WHITE, borderColor: WHITE + "4c", borderWidth: 1 }}>
            Contact Us
          </motion.a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function CausesPage() {
  const [activeCategory, setActiveCategory] = useState("plantation");
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SwiperStyles />
      <HeroBanner />
      <CauseCategories active={activeCategory} setActive={setActiveCategory} />
      <CausesList activeCategory={activeCategory} />
      <FeaturedCauseDetail />
      <MissionSection />
      <GallerySection />
      <CTABanner />
    </div>
  );
}
