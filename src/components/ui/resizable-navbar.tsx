"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import React, { useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      className={cn("relative z-50 w-full pt-2 pb-1 px-2 sm:px-4", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(8px)",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.08), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 102, 102, 0.15), 0 12px 40px rgba(0, 102, 102, 0.08)"
          : "none",
        width: visible ? "88%" : "100%",
        y: visible ? 6 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 40,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-white/85 px-5 py-2 lg:flex dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs",
        visible && "bg-white/95 dark:bg-slate-900/95 border-teal-500/40 shadow-lg",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-700 font-bold transition-colors"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(8px)",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.08), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 102, 102, 0.15), 0 12px 40px rgba(0, 102, 102, 0.08)"
          : "none",
        width: visible ? "94%" : "100%",
        paddingRight: visible ? "14px" : "12px",
        paddingLeft: visible ? "14px" : "12px",
        borderRadius: visible ? "18px" : "0rem",
        y: visible ? 6 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 40,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col items-center justify-between bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 lg:hidden",
        visible && "rounded-2xl border border-teal-500/40 shadow-lg",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl bg-white/95 backdrop-blur-xl px-4 py-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle navigation menu"
    >
      {isOpen ? (
        <IconX className="text-slate-800 dark:text-white h-5 w-5" />
      ) : (
        <IconMenu2 className="text-slate-800 dark:text-white h-5 w-5" />
      )}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2.5 px-1 py-1 text-sm font-bold text-slate-900 dark:text-white"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
        N
      </div>
      <span className="font-extrabold text-sm tracking-tight text-[#333333] dark:text-white leading-tight">
        Nexus<span className="text-teal-700 dark:text-teal-400">Enroll</span>
      </span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-xl text-xs font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-teal-700 hover:bg-teal-800 text-white shadow-sm border border-teal-600",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
    dark: "bg-slate-900 text-white shadow-md hover:bg-slate-950",
    gradient:
      "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-md hover:from-teal-800 hover:to-teal-700",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
