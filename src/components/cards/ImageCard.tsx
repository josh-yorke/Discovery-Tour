import { useState, useEffect, useCallback, useRef, memo } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const api = import.meta.env.VITE_API_URL;

interface ImageCardProps {
  url: string[];
  style: string;
}

interface Breakpoint {
  maxWidth: number;
  maxImageWidth: number;
}

interface ImageSize {
  width: number;
  height: number;
}

interface ContainerSize {
  containerWidth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface ImageUrls {
  getOptimizedImageUrl: (imagePath: string, index?: number) => string;
  getFallbackUrl: (imagePath: string) => string;
}

interface NavigationControlsProps {
  urlLength: number;
  currentImage: number;
  goToPrevious: () => void;
  goToNext: () => void;
  goToImage: (index: number) => void;
}

// Constants
const DPR = Math.min(window.devicePixelRatio || 1, 2);

const BREAKPOINTS: Record<string, Breakpoint> = {
  mobile: { maxWidth: 640, maxImageWidth: 800 },
  tablet: { maxWidth: 1024, maxImageWidth: 1200 },
  desktop: { maxWidth: Infinity, maxImageWidth: 1920 },
};

// Custom hooks
const useContainerSize = (): ContainerSize => {
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateContainerSize = (): void => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);

    const currentContainer = containerRef.current;
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { containerWidth, containerRef };
};

const useKeyboardNavigation = (
  urlLength: number,
  goToPrevious: () => void,
  goToNext: () => void
): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (urlLength <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [urlLength, goToPrevious, goToNext]);
};

const useImageUrls = (
  containerWidth: number,
  currentImage: number
): ImageUrls => {
  const getOptimalImageSize = useCallback((): ImageSize => {
    let targetWidth = containerWidth;

    if (containerWidth <= BREAKPOINTS.mobile.maxWidth) {
      targetWidth = Math.min(
        containerWidth * DPR,
        BREAKPOINTS.mobile.maxImageWidth
      );
    } else if (containerWidth <= BREAKPOINTS.tablet.maxWidth) {
      targetWidth = Math.min(
        containerWidth * DPR,
        BREAKPOINTS.tablet.maxImageWidth
      );
    } else {
      targetWidth = Math.min(
        containerWidth * DPR,
        BREAKPOINTS.desktop.maxImageWidth
      );
    }

    const targetHeight = Math.round((targetWidth * 2) / 3);

    return {
      width: Math.round(targetWidth / 25) * 25,
      height: Math.round(targetHeight / 25) * 25,
    };
  }, [containerWidth]);

  const getOptimizedImageUrl = useCallback(
    (imagePath: string, index: number = 0): string => {
      const encodedPath = encodeURIComponent(imagePath);
      const { width, height } = getOptimalImageSize();
      const quality = index === currentImage ? "80" : "65";

      const params = new URLSearchParams({
        w: width.toString(),
        h: height.toString(),
        q: quality,
        fit: "cover",
        format: "webp",
        dpr: DPR.toString(),
      });

      return `${api}/images/${encodedPath}?${params.toString()}`;
    },
    [getOptimalImageSize, currentImage]
  );

  const getFallbackUrl = useCallback((imagePath: string): string => {
    const encodedPath = encodeURIComponent(imagePath);
    const params = new URLSearchParams({
      format: "jpeg",
      q: "75",
    });
    return `${api}/images/${encodedPath}?${params.toString()}`;
  }, []);

  return { getOptimizedImageUrl, getFallbackUrl };
};

// Navigation component
const NavigationControls = memo<NavigationControlsProps>(
  ({ urlLength, currentImage, goToPrevious, goToNext, goToImage }) => {
    if (urlLength <= 1) return null;

    return (
      <>
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Previous image"
        >
          <RiArrowLeftSLine size={24} className="text-white drop-shadow-lg" />
        </button>

        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Next image"
        >
          <RiArrowRightSLine size={24} className="text-white drop-shadow-lg" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 backdrop-blur-sm rounded-full px-3 py-2 bg-black/10">
          {Array.from({ length: urlLength }, (_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                currentImage === index
                  ? "bg-white scale-110 shadow-lg"
                  : "bg-white/50 hover:bg-white/70 hover:scale-105"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm text-white text-xs">
          {currentImage + 1} / {urlLength}
        </div>
      </>
    );
  }
);

NavigationControls.displayName = "NavigationControls";

// Image component
interface ImageComponentProps {
  imagePath: string;
  index: number;
  isCurrent: boolean;
  getOptimizedImageUrl: (imagePath: string, index?: number) => string;
  getFallbackUrl: (imagePath: string) => string;
}

const ImageComponent = memo<ImageComponentProps>(
  ({ imagePath, index, isCurrent, getOptimizedImageUrl, getFallbackUrl }) => {
    const [hasError, setHasError] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string>(() =>
      getOptimizedImageUrl(imagePath, index)
    );

    useEffect(() => {
      setCurrentSrc(getOptimizedImageUrl(imagePath, index));
      setHasError(false);
    }, [imagePath, getOptimizedImageUrl, index]);

    const handleError = (): void => {
      if (!hasError) {
        // Try fallback URL
        setCurrentSrc(getFallbackUrl(imagePath));
        setHasError(true);
      }
    };

    if (hasError && currentSrc === getFallbackUrl(imagePath)) {
      return (
        <div className="w-full h-full shrink-0 flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-2">404</div>
            <div className="text-gray-500 text-sm">Image not found</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full shrink-0 flex items-center justify-center">
        <img
          src={currentSrc}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover"
          loading={isCurrent ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    );
  }
);

ImageComponent.displayName = "ImageComponent";

// Main component
const ImageCard = memo<ImageCardProps>(({ url, style }) => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const { containerWidth, containerRef } = useContainerSize();
  const { getOptimizedImageUrl, getFallbackUrl } = useImageUrls(
    containerWidth,
    currentImage
  );

  const goToPrevious = useCallback(
    () => setCurrentImage((prev) => (prev === 0 ? url.length - 1 : prev - 1)),
    [url.length]
  );

  const goToNext = useCallback(
    () => setCurrentImage((prev) => (prev === url.length - 1 ? 0 : prev + 1)),
    [url.length]
  );

  const goToImage = useCallback((index: number) => setCurrentImage(index), []);

  useKeyboardNavigation(url.length, goToPrevious, goToNext);

  // Empty state
  if (!url || url.length === 0) {
    return (
      <div
        className={`w-full relative overflow-hidden bg-gray-200 ${style}`}
        style={{ aspectRatio: "3/2" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full relative overflow-hidden ${style} bg-gray-100 group`}
      style={{ aspectRatio: "3/2" }}
    >
      <div
        className="w-full h-full flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {url.map((imagePath, index) => (
          <ImageComponent
            key={`${imagePath}-${index}`}
            imagePath={imagePath}
            index={index}
            isCurrent={index === currentImage}
            getOptimizedImageUrl={getOptimizedImageUrl}
            getFallbackUrl={getFallbackUrl}
          />
        ))}
      </div>

      <NavigationControls
        urlLength={url.length}
        currentImage={currentImage}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        goToImage={goToImage}
      />
    </div>
  );
});

ImageCard.displayName = "ImageCard";

export default ImageCard;
