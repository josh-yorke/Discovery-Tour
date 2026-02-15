import type { ReactNode } from "react";

interface TagProps {
  text: string;
  icon: ReactNode;
  style: string | null;
}

const GlassTag = ({ style, icon, text }: TagProps) => {
  return (
    <div
      className={`${style} px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white`}
    >
      {icon ?? icon}
      <p className="text-xs font-normal">{text}</p>
    </div>
  );
};

export default GlassTag;
