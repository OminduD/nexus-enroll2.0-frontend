import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface ButtonWithIconProps extends React.ComponentProps<typeof Button> {
  label?: string;
  icon?: React.ReactNode;
}

export const ButtonWithIcon = ({
  label = "Get Started",
  icon = <ArrowRight size={16} />,
  className = "",
  ...props
}: ButtonWithIconProps) => {
  return (
    <Button
      className={`relative text-xs sm:text-sm font-extrabold rounded-full h-11 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer bg-[#004d4d] hover:bg-[#003838] text-white border-0 shadow-lg shadow-teal-950/20 ${className}`}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500 tracking-wider uppercase">
        {label}
      </span>
      <div className="absolute right-1 w-9 h-9 bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-40px)] group-hover:-rotate-45">
        {icon}
      </div>
    </Button>
  );
};

export const ButtonWithIconDemo = () => {
  return <ButtonWithIcon label="Get Started" icon={<ArrowRight size={16} />} />;
};

export default ButtonWithIcon;
