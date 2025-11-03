import {
  RiFacebookFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterFill,
  RiYoutubeFill,
} from "react-icons/ri";
import type { companyBranches } from "../../types/company/companyDataTypes";
import type { JSX } from "react";

interface SocialProps {
  socials: companyBranches["branches"][number]["socials"];
}

const iconMap: Record<string, JSX.Element> = {
  facebook: <RiFacebookFill size={16} color="white" />,
  instagram: <RiInstagramFill size={16} color="white" />,
  twitter: <RiTwitterFill size={16} color="white" />,
  linkedin: <RiLinkedinFill size={16} color="white" />,
  youtube: <RiYoutubeFill size={16} color="white" />,
};

const SocialButton = ({ socials }: SocialProps) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2">
      {Object.entries(socials).map(([social, value]) => {
        const icon = iconMap[social];
        if (!icon) return null;
        return (
          <div
            className="p-2 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
            onClick={() => window.open(value)}
            key={social}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};

export default SocialButton;
