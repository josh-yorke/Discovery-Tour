import { RiHashtag } from "react-icons/ri";

interface TagProps {
  title: string;
}

const Tags = ({ title }: TagProps) => {
  return (
    <p className="flex flex-row gap-2 text-xs font-normal px-3 py-2 bg-[#1d2087] text-white rounded-full uppercase">
      <RiHashtag size={16} />
      {title}
    </p>
  );
};

export default Tags;
