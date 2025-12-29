import { useState, useRef, memo } from "react";
import { RiCloseLine } from "react-icons/ri";

const api = import.meta.env.VITE_API_URL;

interface InfiniteCarouselProps {
  images: string[];
  width?: number;
  height?: number;
  gap?: number;
  speed?: number;
}

const InfiniteCarousel = memo<InfiniteCarouselProps>(
  ({
    images,
    width = 300,
    height = 200,
    gap = 16,
    speed = 30, // seconds for one full cycle
  }) => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [fullscreenImage, setFullscreenImage] = useState<string>("");
    const animationRef = useRef<HTMLDivElement>(null);

    // Create duplicated images for seamless infinite loop
    const duplicatedImages = [...images, ...images, ...images];

    const getImageUrl = (imagePath: string, fullscreen: boolean = false) => {
      if (!imagePath) return "";

      const encodedPath = encodeURIComponent(imagePath);
      let imgWidth = width;
      let imgHeight = height;

      if (fullscreen) {
        imgWidth = Math.min(window.innerWidth * 2, 3840);
        imgHeight = Math.min(window.innerHeight * 2, 2160);
      } else {
        imgWidth = Math.round(width * 2); // 2x for retina
        imgHeight = Math.round(height * 2);
      }

      const params = new URLSearchParams({
        w: imgWidth.toString(),
        h: imgHeight.toString(),
        q: fullscreen ? "90" : "85",
        fit: "cover",
        format: "webp",
      });

      return `${api}/images/${encodedPath}?${params.toString()}`;
    };

    const openFullscreen = (image: string) => {
      setFullscreenImage(image);
      setIsFullscreen(true);
      document.body.style.overflow = "hidden";
    };

    const closeFullscreen = () => {
      setIsFullscreen(false);
      document.body.style.overflow = "";
    };

    if (!images || images.length === 0) {
      return (
        <div
          className="w-full bg-gray-100 rounded-xl flex items-center justify-center"
          style={{ height }}
        >
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    // Calculate animation distance
    const singleSetWidth = images.length * (width + gap);
    const totalWidth = singleSetWidth * 3;

    return (
      <>
        <div className="w-full overflow-hidden relative">
          <div
            ref={animationRef}
            className="flex"
            style={{
              width: totalWidth,
              animation: `slide ${speed}s linear infinite`,
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="shrink-0 cursor-pointer rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                style={{
                  width,
                  height,
                  marginRight: gap,
                }}
                onClick={() => openFullscreen(image)}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Image ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = getImageUrl(image)
                      .replace("webp", "jpeg")
                      .replace("q=85", "q=80");
                  }}
                />
              </div>
            ))}
          </div>

          {/* CSS Animation */}
          <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${singleSetWidth}px); }
          }
        `}</style>
        </div>

        {/* Fullscreen View */}
        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white z-20 transition-all"
              aria-label="Close"
            >
              <RiCloseLine size={24} />
            </button>

            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={getImageUrl(fullscreenImage, true)}
                alt="Fullscreen view"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = getImageUrl(fullscreenImage, true)
                    .replace("webp", "jpeg")
                    .replace("q=90", "q=80");
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

InfiniteCarousel.displayName = "InfiniteCarousel";

export default InfiniteCarousel;
