import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import React from "react";
import { api } from "../api/client";
import { useFetch } from "../hooks/useFetch";

// Falls back to these if GET /settings/contact hasn't loaded yet or fails,
// so the footer never renders blank contact info.
const FALLBACK_EMAILS = ["foundervanrang.org@gmail.com", "info@thevanrangfoundation.org"];
const FALLBACK_PHONES = ["+919783068493", "+919785720688", "+919256741759"];

/**
 * Footer for The Vanrang Foundation
 * Uses global Tailwind color variables for warm, modern NGO theme.
 * - Primary:   var(--clr-primary)   | Tailwind: bg-primary / text-primary
 * - Secondary: var(--clr-secondary) | Tailwind: bg-secondary / text-secondary
 * - Accent:    var(--clr-accent)    | Tailwind: bg-accent / text-accent
 * - Background:var(--clr-background)| Tailwind: bg-background / text-background
 * - Surface:   var(--clr-surface)   | Tailwind: bg-surface / text-surface
 */

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function FooterLink({ to, children, ...props }) {
  return (
    <Link
      to={to}
      {...props}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        // Allow route change, then scroll to top:
        setTimeout(() => scrollToTop(), 0);
      }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const { data: settings } = useFetch(() => api.get("/settings/contact", { auth: false }), []);
  const emails = settings?.emails?.length ? settings.emails : FALLBACK_EMAILS;
  const phones = settings?.phones?.length ? settings.phones : FALLBACK_PHONES;

  // All icons use the primary color on white/neutral background for accessibility and theme
  const iconColor = "var(--clr-primary)";
  const iconBgColor = "bg-accent/80"; // warm yellow with some opacity
  const hoverAccent =
    "hover:bg-primary-dark/95 hover:text-white hover:shadow-lg";
  const focusAccent =
    "focus:outline-none focus:ring focus:ring-primary/30 focus:ring-offset-2";
  const iconCommon =
    "p-3 rounded-full text-primary shadow transition-colors duration-200 " +
    iconBgColor +
    " " +
    hoverAccent +
    " " +
    focusAccent +
    " flex items-center justify-center";

  return (
    <footer className="bg-background text-text-primary pt-16 pb-24 md:pb-8 transition-colors">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Top Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo, tagline, contact */}
          <div>
            <img
              src="/logo.png"
              alt="The Vanrang Foundation logo"
              className="h-24 mb-2"
            />
            <p className="mb-3 font-black text-2xl font-serif text-primary">
              The Vanrang Foundation
              <div className="text-accent text-base font-bold">
                <span>One World One Family</span>
              </div>
            </p>
            <div className="mb-2 mt-2 text-text-secondary text-base">
              <span className="font-semibold text-secondary">E-mail:</span>
              <br />
              <span className="break-all">
                {emails.map((email, i) => (
                  <React.Fragment key={email}>
                    <a href={`mailto:${email}`} className="underline hover:text-primary-dark transition-colors">
                      {email}
                    </a>
                    {i < emails.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="mb-0 mt-2 text-text-secondary text-base">
              <span className="font-semibold text-secondary">Phone:</span>
              <br />
              <span className="break-all">
                {phones.map((phone, i) => (
                  <React.Fragment key={phone}>
                    <a href={`tel:${phone}`} className="underline hover:text-primary-dark transition-colors">
                      {phone.startsWith("+91") ? `+91 ${phone.slice(3)}` : phone}
                    </a>
                    {i < phones.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>

          {/* Get Involved section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-secondary font-serif tracking-wide">
              Get Involved
            </h3>
            <ul className="space-y-3 text-base text-text-secondary">
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">Volunteer Opportunities</FooterLink>
              </li>
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">School Programs</FooterLink>
              </li>
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">Community Drives</FooterLink>
              </li>
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">Youth Green Leaders</FooterLink>
              </li>
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">Tree Plantation Events</FooterLink>
              </li>
              <li className="hover:text-primary-dark cursor-pointer transition-colors">
                <FooterLink to="/contact">Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-secondary font-serif tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-base text-text-secondary">
              <li>
                <FooterLink
                  to="/"
                  className="hover:text-primary-dark transition-colors"
                >
                  Home
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/about"
                  className="hover:text-primary-dark transition-colors"
                >
                  About
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/plantation-drives"
                  className="hover:text-primary-dark transition-colors"
                >
                  Plantation Drives
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/gallery"
                  className="hover:text-primary-dark transition-colors"
                >
                  Gallery
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/contact"
                  className="hover:text-primary-dark transition-colors"
                >
                  Contact / Volunteer
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/team"
                  className="hover:text-primary-dark transition-colors"
                >
                  Our Team
                </FooterLink>
              </li>
              {/* Added: Terms & Conditions, Privacy Policy, Donate */}
              <li>
                <FooterLink
                  to="/terms-and-conditions"
                  className="hover:text-primary-dark transition-colors"
                >
                  Terms &amp; Conditions
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/privacy-policy"
                  className="hover:text-primary-dark transition-colors"
                >
                  Privacy Policy
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  to="/donate"
                  className="hover:text-primary-dark transition-colors"
                >
                  Donate
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-secondary font-serif tracking-wide">
              Office
            </h3>
            <div className="mt-8">
              <div className="mb-4 text-text-secondary text-base">
                <span className="font-semibold text-primary">
                  Registered Office:
                </span>
                <br />
                <a
                  href="https://www.google.com/maps/place/THE+VANRANG+FOUNDATION/@27.572082,76.623481,14z/data=!4m6!3m5!1s0x39729954614bb1cd:0xa27c9c1ee1eab08b!8m2!3d27.5720816!4d76.6234807!16s%2Fg%2F11ylzs1klg?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                  className="hover:underline text-accent font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open address in Google Maps"
                  style={{ display: "inline-block", cursor: "pointer" }}
                >
                  189, Adarsh Colony, Daudpur
                  <br />
                  Alwar, Rajasthan, India – 301001
                </a>
                <br />
                <br />
                <span className="font-semibold text-primary">
                  Sub Office:
                </span>
                <br />
                <a
                  href="https://www.google.com/maps/place/THE+VANRANG+FOUNDATION/@27.569098,76.60414,14z/data=!4m6!3m5!1s0x397299484a3e6e77:0x7d08413408bff84e!8m2!3d27.5690984!4d76.6041404!16s%2Fg%2F11ywh_bpzd?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                  className="hover:underline text-accent font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open address in Google Maps"
                  style={{ display: "inline-block", cursor: "pointer" }}
                >
                  245, Malan Ki Gali, Hindu Pada
                  <br />
                  Vikas Path, Alwar, Rajasthan, India – 301001
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-5 flex-wrap justify-center mt-10">
          <a
            href="https://www.facebook.com/share/1AixPGcMh9/"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="Facebook"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} color={iconColor} />
          </a>
          <a
            href="https://www.instagram.com/thevanrangfoundation?igsh=ZG1sa20yN2kzcHdp"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="Instagram"
            aria-label="Instagram"
          >
            <FaInstagram size={18} color={iconColor} />
          </a>
          {/* Threads logo as img */}
          <a
            href="https://www.threads.com/@thevanrangfoundation"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="Threads"
            aria-label="Threads"
            style={{ display: "inline-flex" }}
          >
            <img
              src="/threads.png"
              alt="Threads"
              className="w-5 h-5"
              style={{
                filter:
                  "invert(39%) sepia(80%) saturate(591%) hue-rotate(340deg) brightness(100%) contrast(95%)",
              }}
            />
          </a>
          <a
            href="https://x.com/vanrangofficial"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="X (Twitter)"
            aria-label="X (Twitter)"
          >
            <FaXTwitter size={18} color={iconColor} />
          </a>
          <a
            href="https://linkedin.com/company/the-vanrang-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} color={iconColor} />
          </a>
          <a
            href="https://youtube.com/@vanrangfoundation?si=MEivV0bBvFrxjFTP"
            target="_blank"
            rel="noopener noreferrer"
            className={iconCommon}
            title="YouTube"
            aria-label="YouTube"
          >
            <FaYoutube size={18} color={iconColor} />
          </a>
        </div>

        {/* Divider/Bottom Bar */}
        <div className="border-t border-accent/30 mt-12 pt-6 text-center text-text-secondary text-base">
          <span>
            ©️ 2026 <span className="text-secondary font-bold">The Vanrang Foundation</span>. All Rights Reserved.
          </span>
          <br />
          <span className="block">
            <span className="text-secondary font-bold">The Vanrang Foundation</span> is an independent non-profit organization registered under Section 8 of the Companies Act, 2013.
          </span>
          <span className="block">
            This website is for informational and charitable purposes only.
          </span>
          <span className="text-sm text-secondary">
            Tech Partner:{" "}
            <a
              href="https://gowappily.in"
              className="underline hover:text-primary-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              GoWappily Infotech
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}