import { RiFacebookFill } from "react-icons/ri";
import type { companyData } from "../../types/company/companyDataTypes";

interface SocialProps {
  socials: companyData["branches"][number]["socials"];
}

const SocialButton = ({ socials }: SocialProps) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2">
      {Object.entries(socials).map(([social, value]) => (
        <div
          className="p-2 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
          onClick={() => window.open(value)}
          key={social}
        >
          <RiFacebookFill size={16} color="white" />
        </div>
      ))}
    </div>
  );
};

export default SocialButton;
