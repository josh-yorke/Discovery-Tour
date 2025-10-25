import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
const api = import.meta.env.VITE_API_URL;

interface ImageProps {
  url: string[];
}

const ImageCard = ({ url }: ImageProps) => {
  const [currImage, setCurrImage] = useState(0);

  return (
    <div
      className="w-full h-[40vh] md:h-[30vh] bg-cover bg-center  "
      style={{
        backgroundImage: `url(${api}/images/${encodeURIComponent(
          url[currImage]
        )})`,
      }}
    >
      <div className="w-full h-full relative py-10 px-6 bg-gradient-to-r from-black/10 via-black/0 to-black/10">
        {url.length > 1 && (
          <>
            <div className="absolute top-[50%] left-0 h-fit flex items-center justify-center px-4">
              <RiArrowLeftSLine
                size={24}
                className="cursor-pointer"
                color="white"
                onClick={() => {
                  if (currImage === 0) {
                    setCurrImage(url.length - 1);
                  } else {
                    setCurrImage((prev) => prev - 1);
                  }
                }}
              />
            </div>
            <div className="absolute top-[50%] right-0 h-fit flex items-center justify-center px-4">
              <RiArrowRightSLine
                size={24}
                className="cursor-pointer"
                color="white"
                onClick={() => {
                  if (currImage === url.length - 1) {
                    setCurrImage(0);
                  } else {
                    setCurrImage((prev) => prev + 1);
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
