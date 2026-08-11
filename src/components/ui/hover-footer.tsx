import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconGlobe,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export const TextHoverEffect = ({
  text = "NEXUS",
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="nexusTextGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="25%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#FF7F50" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="nexusRevealMask"
          gradientUnits="userSpaceOnUse"
          r="25%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="nexusTextMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#nexusRevealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-teal-600/30 font-[helvetica] text-7xl font-extrabold tracking-tighter"
        style={{ opacity: hovered ? 0.7 : 0.15 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-[#0d9488] font-[helvetica] text-7xl font-extrabold tracking-tighter"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#nexusTextGradient)"
        strokeWidth="0.4"
        mask="url(#nexusTextMask)"
        className="fill-transparent font-[helvetica] text-7xl font-extrabold tracking-tighter"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #0d948812 100%)",
      }}
    />
  );
};

export function HoverFooter() {
  // Nexus Enroll Academic links
  const footerLinks = [
    {
      title: "Academic Platform",
      links: [
        { label: "Course Registration", href: "#catalog-preview" },
        { label: "Degree Progress Audit", href: "/student/progress" },
        { label: "Faculty Grade Submissions", href: "/faculty/grades" },
        { label: "Admin Analytics", href: "/admin/reports" },
      ],
    },
    {
      title: "Role Portals",
      links: [
        { label: "Student Portal", href: "/student/dashboard" },
        { label: "Faculty Workflows", href: "/faculty/dashboard" },
        { label: "Administrator Suite", href: "/admin/dashboard" },
        {
          label: "Live System Health",
          href: "/server-down",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-teal-600 shrink-0" />,
      text: "support@nexusenroll.edu",
      href: "mailto:support@nexusenroll.edu",
    },
    {
      icon: <Phone size={18} className="text-teal-600 shrink-0" />,
      text: "+1 (800) 555-NEXUS",
      href: "tel:+18005556398",
    },
    {
      icon: <MapPin size={18} className="text-teal-600 shrink-0" />,
      text: "University Academic Center, Hall A",
    },
  ];

  // Social links
  const socialLinks = [
    { icon: <IconBrandFacebook size={18} />, label: "Facebook", href: "#" },
    { icon: <IconBrandInstagram size={18} />, label: "Instagram", href: "#" },
    { icon: <IconBrandTwitter size={18} />, label: "Twitter", href: "#" },
    { icon: <IconBrandLinkedin size={18} />, label: "LinkedIn", href: "#" },
    { icon: <IconGlobe size={18} />, label: "Globe", href: "#" },
  ];

  return (
    <footer className="bg-white relative h-fit rounded-3xl overflow-hidden m-4 sm:m-8 border border-slate-200/90 shadow-xl shadow-slate-900/5 text-slate-700">
      <div className="max-w-7xl mx-auto p-8 sm:p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 pb-8">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/nexuslogo.webp" alt="Nexus Logo" className="w-10 h-10 object-contain flex-shrink-0" />
              <span className="text-slate-900 text-2xl font-black tracking-tight">
                NEXUS<span className="text-teal-700 font-mono">.ENROLL</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nexus Enroll 2.0 is an enterprise academic course registration, schedule planning, and degree audit platform for modern universities.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-teal-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Footer Link Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-slate-900 text-base font-black mb-5 tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-3 text-xs">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h4 className="text-slate-900 text-base font-black mb-5 tracking-tight">
              Contact & Support
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-600">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-teal-700 transition-colors font-medium"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-teal-700 transition-colors font-medium">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Large Dynamic SVG Text Hover Effect - Directly Under the 4 Columns */}
        <div className="flex w-full h-[14rem] sm:h-[20rem] md:h-[24rem] lg:h-[26rem] my-2 relative z-10 items-center justify-center overflow-hidden">
          <TextHoverEffect text="NEXUS" />
        </div>

        <hr className="border-t border-slate-200/90 my-6" />

        {/* Footer Bottom - Placed Under NEXUS Text */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-slate-500 relative z-20">
          {/* Social Icons */}
          <div className="flex space-x-5 text-slate-500">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-teal-700 text-slate-600 transition-colors p-2.5 bg-slate-50 hover:bg-teal-50/60 rounded-xl border border-slate-200 hover:border-teal-500/40 shadow-sm"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Nexus Enroll 2.0 Academic Systems. All rights reserved.
          </p>
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
