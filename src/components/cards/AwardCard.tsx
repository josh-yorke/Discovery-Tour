import { useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendar2Fill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";

const api = import.meta.env.VITE_API_URL;

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
  const [currImage, setCurrImage] = useState(0);

  return (
    <>
      <div className={`w-full relative overflow-hidden ${style}`}>
        {/* Image slider */}
        <div
          className="w-full h-full flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currImage * 100}%)`,
          }}
        >
          {url.map((img, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${api}/images/${encodeURIComponent(
                  img
                )})`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-tr from-white to-white/10 flex flex-col justify-end p-6 gap-2">
                <div className="w-full flex flex-col items-start justify-center">
                  <p className="text-md font-semibold uppercase text-[#1d2087]">
                    {description}
                  </p>
                  <div className="w-full flex flex-row gap-2 items-center justify-start">
                    <RiCalendar2Fill size={16} />
                    <p className="text-sm font-normal">
                      {new Date(date)
                        .toLocaleDateString("en-US")
                        .replace(/\//g, "-")}
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
                    style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white px-3 py-2 rounded-lg"
                  />
                  <IconButton
                    action={action}
                    icon={<RiDeleteBin4Fill size={16} />}
                    title="Delete"
                    style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white px-3 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {url.length > 1 && (
          <>
            <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
              <RiArrowLeftSLine
                size={28}
                className="cursor-pointer text-white drop-shadow-lg"
                onClick={() =>
                  setCurrImage((prev) =>
                    prev === 0 ? url.length - 1 : prev - 1
                  )
                }
              />
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
              <RiArrowRightSLine
                size={28}
                className="cursor-pointer text-white drop-shadow-lg"
                onClick={() =>
                  setCurrImage((prev) =>
                    prev === url.length - 1 ? 0 : prev + 1
                  )
                }
              />
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {url.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrImage(index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200 ${
                    currImage === index
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AwardCard;
