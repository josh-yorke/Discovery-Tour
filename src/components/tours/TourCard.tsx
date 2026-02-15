import { useNavigate } from "react-router";
import {
  RiAddLine,
  RiArrowRightDownLine,
  RiHashtag,
  RiLandscapeAiFill,
  RiDeleteBin4Fill,
  RiPencilFill,
  RiFlag2Fill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import { useMemo, useState, useEffect } from "react";

interface CardProps {
  id: string;
  title: string;
  country: string;
  category: string;
  mainLocationName: string;
  mainDescription: string;
  tags: string[];
  images: string[];
  type: {
    tourType: string;
  };
  onDelete: () => void;
}

const TourCard = ({
  onDelete,
  id,
  country,
  images,
  mainLocationName,
  tags = [],
  title,
}: CardProps) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  const displayTags = useMemo(() => {
    if (!tags.length) return { visibleTags: [], overflowCount: 0 };

    let maxVisibleTags = 2;

    if (windowWidth >= 1024) {
      maxVisibleTags = 3;
    } else if (windowWidth >= 640) {
      maxVisibleTags = 2;
    }

    const visibleTags = tags.slice(0, maxVisibleTags);
    const overflowCount = Math.max(0, tags.length - maxVisibleTags);

    return { visibleTags, overflowCount };
  }, [tags, windowWidth]);

  const truncateTag = (tag: string) => {
    return tag.length <= 10 ? tag : tag.substring(0, 10) + "...";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden">
        {/* Edit/Delete buttons - positioned like the first card's tour type badge */}
        <div className="absolute top-4 left-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/tours/edit/${id}`)}
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-2 hover:scale-110 backdrop-blur-sm"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-2 hover:scale-110 backdrop-blur-sm"
          />
        </div>

        <ImageCard style="w-full h-full object-cover" url={images} />

        {tags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="w-full flex flex-row gap-2 flex-wrap">
              {displayTags.visibleTags.map((tag: string, index: number) => (
                <div
                  key={`${tag}-${index}`}
                  className="flex flex-row gap-1 items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/20"
                >
                  <RiHashtag size={12} color="white" className="shrink-0" />
                  <p className="text-xs font-medium text-white">
                    {truncateTag(tag)}
                  </p>
                </div>
              ))}

              {displayTags.overflowCount > 0 && (
                <div className="flex flex-row items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/20">
                  <RiAddLine size={12} color="white" />
                  <p className="text-xs font-medium text-white ml-1">
                    {displayTags.overflowCount.toString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-2 items-start justify-center">
          <LinkText
            title={title}
            url={`/tours/view/${id}`}
            style="font-bold text-[#1d2087] hover:text-[#1d2087] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="max-w-1/2 flex items-center gap-1">
              <RiLandscapeAiFill
                className="text-[#1d2087] shrink-0"
                size={16}
              />
              <p className="text-xs font-normal truncate">{mainLocationName}</p>
            </div>
            <div className="border h-full border-l border-black/60"></div>
            <div className="max-w-1/2 flex items-center gap-1">
              <RiFlag2Fill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">{country} tour</p>
            </div>
          </div>
        </div>
        <div
          className="p-3 rounded-full bg-linear-to-br from-[#1d2087] to-[#393ca3] group cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate(`/tours/view/${id}`)}
        >
          <RiArrowRightDownLine
            className="text-white rotate-0 group-hover:rotate-360 duration-300 ease-in-out"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default TourCard;
