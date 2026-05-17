import { useCallback, useEffect, useState, memo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCardProps {
  url: string[];
  style: string;
  tags?: boolean;
}

const ImageCard = memo<ImageCardProps>(({ url, style, tags }) => {
  const api = import.meta.env.VITE_API_URL;
  const total = url?.length || 0;
  const hasMultiple = total > 1;
  const validUrls = url?.filter(Boolean) || [];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const imageErrorsRef = useRef<Set<number>>(new Set());
  const [, forceUpdate] = useState({});

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: hasMultiple,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("init", onInit);
    emblaApi.on("select", onSelect);
    onInit();
    onSelect();

    return () => {
      emblaApi.off("init", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleImageError = useCallback((index: number) => {
    if (!imageErrorsRef.current.has(index)) {
      imageErrorsRef.current.add(index);
      forceUpdate({});
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleFullscreen();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, toggleFullscreen, scrollPrev, scrollNext]);

  if (!total || validUrls.length === 0) {
    return (
      <div
        className={`w-full bg-gray-200 ${style}`}
        style={{ aspectRatio: "3/2" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const canScrollPrev = emblaApi?.canScrollPrev() || false;
  const canScrollNext = emblaApi?.canScrollNext() || false;

  return (
    <>
      <div
        className={`w-full relative overflow-hidden ${style} bg-gray-100 group`}
        style={{ aspectRatio: style ? "1/1" : "3/2" }}
      >
        <div className="embla h-full w-full overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {validUrls.map((img, index) => (
              <div
                key={img}
                className="embla__slide shrink-0 w-full h-full"
                style={{ flex: "0 0 100%" }}
              >
                <div className="relative h-full w-full">
                  {imageErrorsRef.current.has(index) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 text-gray-400 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">Image not found</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`${api}/images/${img}`}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <button
              className={`${tags ? "bottom-16" : "bottom-4"} absolute left-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm cursor-pointer transition-opacity disabled:opacity-30 opacity-0 group-hover:opacity-100`}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <button
              className={`${tags ? "bottom-16" : "bottom-4"} absolute right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm cursor-pointer transition-opacity disabled:opacity-30 opacity-0 group-hover:opacity-100`}
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10 flex flex-col gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedIndex
                      ? "bg-white h-4"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>
          </>
        )}

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
          onClick={toggleFullscreen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-9999 bg-black/95 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div
            className="relative w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {imageErrorsRef.current.has(selectedIndex) ? (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">Image not found</p>
              </div>
            ) : (
              <img
                src={`${api}/images/${validUrls[selectedIndex]}`}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            )}

            {hasMultiple && (
              <>
                <button
                  className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer"
                  onClick={scrollPrev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                <button
                  className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer"
                  onClick={scrollNext}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === selectedIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      onClick={() => scrollTo(index)}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              className="absolute top-8 right-8 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer"
              onClick={toggleFullscreen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
});

ImageCard.displayName = "ImageCard";

export default ImageCard;
