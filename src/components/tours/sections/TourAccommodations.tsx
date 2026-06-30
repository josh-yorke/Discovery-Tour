import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowUpSLine,
  RiStarFill,
  RiStarLine,
  RiGlobalLine,
  RiImageLine,
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
  RiNumber8,
  RiNumber9,
  RiCheckboxCircleFill,
  RiBuildingFill,
} from "react-icons/ri";
import { getAccommodation } from "../../../hooks/tours/accomodation/accomodation";
import SectionError from "../../error/SectionError";
import SectionLoader from "../../loader/SectionLoader";
import InfiniteCarousel from "../../cards/InfiniteCarousel";

interface AccommodationData {
  _id: string;
  tour: string;
  accommodationName: string;
  accommodationStar: number;
  accommodationDescription: string;
  accommodationWebsite: string;
  accommodationImages: string[];
  dateAdded: string;
  __v: number;
}

interface TourAccommodationProps {
  tourId: string;
}

const NUMBER_ICONS = [
  <RiNumber1 size={16} className="text-white" key="1" />,
  <RiNumber2 size={16} className="text-white" key="2" />,
  <RiNumber3 size={16} className="text-white" key="3" />,
  <RiNumber4 size={16} className="text-white" key="4" />,
  <RiNumber5 size={16} className="text-white" key="5" />,
  <RiNumber6 size={16} className="text-white" key="6" />,
  <RiNumber7 size={16} className="text-white" key="7" />,
  <RiNumber8 size={16} className="text-white" key="8" />,
  <RiNumber9 size={16} className="text-white" key="9" />,
];

const getAccommodationIcon = (index: number) => {
  return (
    NUMBER_ICONS[index] || (
      <RiCheckboxCircleFill className="text-white" size={16} key="default" />
    )
  );
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => {
    const isFullStar = index < Math.floor(rating);
    const isPartialStar = index === Math.floor(rating) && rating % 1 !== 0;

    if (isFullStar || isPartialStar) {
      return <RiStarFill key={index} className="text-amber-500" size={14} />;
    }
    return <RiStarLine key={index} className="text-gray-300" size={14} />;
  });
};

const TourAccommodation = ({ tourId }: TourAccommodationProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    data: accommodations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AccommodationData[]>({
    queryKey: ["tour-accommodation", tourId],
    queryFn: () => getAccommodation(tourId),
    enabled: !!tourId,
  });

  if (!tourId) return null;

  if (isLoading) return <SectionLoader />;

  if (isError) return <SectionError error={error?.message} action={refetch} />;

  const sortedAccommodations = [...(accommodations || [])].sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
  );

  if (sortedAccommodations.length === 0) {
    return null;
  }

  const primaryGradient = "bg-gradient-to-r from-[#1d2087] to-[#393ca3]";

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${primaryGradient} rounded-full`}>
                <RiBuildingFill size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-black uppercase">
                  Accommodation
                </h2>
              </div>
            </div>
            <RiArrowUpSLine
              size={24}
              className={`cursor-pointer transition-transform text-[#1d2087] hover:opacity-80 ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="border-t border-gray-200 mx-6" />

            <div className="p-6 pt-0">
              <div className="space-y-8 mt-6">
                {sortedAccommodations.map((accommodation, index) => {
                  const isLastAccommodation =
                    index === sortedAccommodations.length - 1;

                  return (
                    <div
                      key={accommodation._id}
                      className="flex flex-col md:flex-row gap-4 md:gap-6"
                    >
                      <div className="shrink-0 flex flex-col items-center relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${primaryGradient} shadow-md`}
                        >
                          {getAccommodationIcon(index)}
                        </div>
                        {!isLastAccommodation && (
                          <div
                            className={`w-0.5 flex-1 mt-2 ${primaryGradient} opacity-60`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-[#1d2087] line-clamp-1 wrap-break-word">
                              {accommodation.accommodationName}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                <div className="flex items-center">
                                  {renderStars(accommodation.accommodationStar)}
                                </div>
                                <span className="text-sm font-semibold text-emerald-800 whitespace-nowrap">
                                  {accommodation.accommodationStar} Star
                                </span>
                              </div>

                              {accommodation.accommodationWebsite && (
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                  <RiGlobalLine
                                    className="text-[#1d2087] shrink-0"
                                    size={14}
                                  />
                                  <a
                                    href={accommodation.accommodationWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-[#1d2087] hover:underline"
                                  >
                                    Website
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {accommodation.accommodationDescription && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <h4 className="text-sm font-semibold text-gray-800">
                                Description
                              </h4>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                              {accommodation.accommodationDescription}
                            </p>
                          </div>
                        )}

                        {accommodation.accommodationImages?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <RiImageLine
                                className="text-emerald-600"
                                size={16}
                              />
                              <h4 className="text-sm font-semibold text-gray-800">
                                Gallery
                              </h4>
                            </div>
                            <div className="w-full overflow-hidden rounded-xl">
                              <InfiniteCarousel
                                images={accommodation.accommodationImages}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourAccommodation;
