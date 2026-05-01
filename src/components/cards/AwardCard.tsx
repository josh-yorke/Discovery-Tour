import {
  RiCalendar2Fill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";

interface ImageProps {
  id: string;
  url: string[];
  style: string;
  description: string;
  date: string;
  action: () => void;
}

const AwardCard = ({
  action,
  id,
  url,
  style,
  description,
  date,
}: ImageProps) => {
  return (
    <div className={`w-full relative overflow-hidden  ${style}`}>
      <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden">
        <ImageCard url={url} style="" />

        <div className="absolute inset-0 bg-linear-to-tr from-white to-white/10 flex flex-col justify-end p-6 gap-2">
          <div className="w-full flex flex-col items-start justify-center">
            <p className="text-md font-semibold uppercase text-[#1d2087]">
              {description}
            </p>
            <div className="w-full flex flex-row gap-2 items-center justify-start">
              <RiCalendar2Fill size={16} />
              <p className="text-sm font-normal">
                {new Date(date).toLocaleDateString("en-US").replace(/\//g, "-")}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-row gap-2">
            <IconButton
              action={() => {
                window.open(`/company/awards/edit/${id}`, "_blank");
              }}
              icon={<RiPencilFill size={16} />}
              title="Edit"
              style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white px-3 py-2 rounded-xl"
            />
            <IconButton
              action={action}
              icon={<RiDeleteBin4Fill size={16} />}
              title="Delete"
              style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white px-3 py-2 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardCard;
