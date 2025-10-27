import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
const api = import.meta.env.VITE_API_URL;

interface ImageProps {
  url: string[];
  style: string;
}

const ImageCard = ({ url, style }: ImageProps) => {
  const [currImage, setCurrImage] = useState(0);

  return (
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
              backgroundImage: `url(${api}/images/${encodeURIComponent(img)})`,
            }}
          />
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
                setCurrImage((prev) => (prev === 0 ? url.length - 1 : prev - 1))
              }
            />
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
            <RiArrowRightSLine
              size={28}
              className="cursor-pointer text-white drop-shadow-lg"
              onClick={() =>
                setCurrImage((prev) => (prev === url.length - 1 ? 0 : prev + 1))
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
  );
};

export default ImageCard;
