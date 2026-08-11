import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

export function BackButton({ label = "Back", className = "", ...props }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      className={`group relative overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 shadow-md shadow-slate-900/5 rounded-xl pl-10 pr-5 py-2.5 text-xs font-extrabold uppercase tracking-wider ${className}`}
      {...props}
    >
      <span className="inline-block transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-3">
        {label}
      </span>
      <i className="absolute left-0 top-0 bottom-0 z-10 flex w-9 items-center justify-center bg-teal-600/15 text-teal-800 transition-all duration-500 group-hover:w-full not-italic">
        <ArrowLeft
          className="opacity-90 text-teal-800 transition-transform duration-300 group-hover:-translate-x-1"
          size={16}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </i>
    </Button>
  );
}

export function BackButtonDemo() {
  return <BackButton />;
}
