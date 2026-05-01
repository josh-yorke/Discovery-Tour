import { useCallback, useEffect, useState, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCardProps {
  url: string[];
  style: string;
}

const ImageCard = memo<ImageCardProps>(({ url, style }) => {
  const api = import.meta.env.VITE_API_URL;
  const total = url?.length || 0;
  const hasMultiple = total > 1;

  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: hasMultiple,
    align: "start",
    slidesToScroll: 1,
    dragFree: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  if (!total) {
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

  return (
    <div
      className={`w-full relative overflow-hidden ${style} bg-gray-100`}
      style={{ aspectRatio: "3/2" }}
    >
      {/* Embla Carousel */}
      <div className="embla h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {url.map((img, index) => (
            <div
              key={index}
              className="embla__slide shrink-0 w-full h-full"
              style={{ flex: "0 0 100%", minWidth: 0 }}
            >
              <div className="relative h-full w-full">
                {imageErrors.has(index) ? (
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
                    alt={`Slide ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {hasMultiple && (
        <>
          <button
            className="absolute left-4 bottom-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm cursor-pointer transition-opacity disabled:opacity-30"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Previous slide"
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
            className="absolute right-4 bottom-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm cursor-pointer transition-opacity disabled:opacity-30"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Next slide"
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

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

ImageCard.displayName = "ImageCard";

export default ImageCard;
