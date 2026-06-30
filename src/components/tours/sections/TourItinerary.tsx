import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  RiArrowUpSLine,
  RiMapPinLine,
  RiHotelLine,
  RiRestaurantLine,
  RiWalkLine,
  RiCarLine,
  RiFlightTakeoffLine,
  RiGuideLine,
  RiShoppingCartLine,
  RiCameraLine,
  RiTimeLine,
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
  RiKnifeLine,
  RiCupLine,
  RiCakeLine,
  RiCalendarTodoFill,
} from "react-icons/ri";
import { getItinerary } from "../../../hooks/tours/itinerary/itinerary";
import SectionLoader from "../../loader/SectionLoader";
import SectionError from "../../error/SectionError";

interface ActivityData {
  _id: string;
  activityType: string;
  information: string;
}

interface MealData {
  _id: string;
  mealType: string;
  mealCount: number;
  mealUnit: string;
  description: string;
}

interface ItineraryData {
  _id: string;
  tour: string;
  title: string;
  location: string;
  activities: ActivityData[];
  meals: MealData[];
  dayOrder: number;
  dateAdded: string;
  __v: number;
}

interface TourItineraryProps {
  tourId: string;
}

const getDayIcon = (index: number) => {
  const icons = [
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
  return (
    icons[index] || (
      <RiCheckboxCircleFill className="text-white" size={16} key="default" />
    )
  );
};

const getActivityIcon = (activityType: string) => {
  const icons: Record<string, React.ReactElement> = {
    accommodation: (
      <RiHotelLine className="text-white" size={16} key="accommodation" />
    ),
    transportation: (
      <RiCarLine className="text-white" size={16} key="transportation" />
    ),
    flight: (
      <RiFlightTakeoffLine className="text-white" size={16} key="flight" />
    ),
    tour: <RiGuideLine className="text-white" size={16} key="tour" />,
    sightseeing: (
      <RiCameraLine className="text-white" size={16} key="sightseeing" />
    ),
    shopping: (
      <RiShoppingCartLine className="text-white" size={16} key="shopping" />
    ),
    walking: <RiWalkLine className="text-white" size={16} key="walking" />,
    meal: <RiRestaurantLine className="text-white" size={16} key="meal" />,
  };
  return (
    icons[activityType] || (
      <RiTimeLine className="text-white" size={16} key="default" />
    )
  );
};

const getMealIcon = (mealType: string) => {
  const icons: Record<string, React.ReactElement> = {
    breakfast: <RiCupLine className="text-white" size={16} key="breakfast" />,
    lunch: <RiRestaurantLine className="text-white" size={16} key="lunch" />,
    dinner: <RiKnifeLine className="text-white" size={16} key="dinner" />,
    snack: <RiCakeLine className="text-white" size={16} key="snack" />,
  };
  return (
    icons[mealType] || (
      <RiRestaurantLine className="text-white" size={16} key="default" />
    )
  );
};

const formatMealType = (mealType: string): string => {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};

const formatDayNumber = (dayOrder: number): string => {
  return `Day ${dayOrder}`;
};

const TourItinerary = ({ tourId }: TourItineraryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    data: itineraries,
    isLoading: isLoadingItinerary,
    isError: isErrorItinerary,
    error: itineraryError,
    refetch: refetchItinerary,
  } = useQuery<ItineraryData[]>({
    queryKey: ["tour-itinerary", tourId],
    queryFn: () => getItinerary(tourId),
    enabled: !!tourId,
  });

  // Don't render anything if no tourId is provided
  if (!tourId) return null;

  // Show loader if main query is loading
  if (isLoadingItinerary) return <SectionLoader />;

  // Show error if main query failed
  if (isErrorItinerary)
    return (
      <SectionError error={itineraryError?.message} action={refetchItinerary} />
    );

  const sortedItineraries = [...(itineraries || [])].sort(
    (a, b) => a.dayOrder - b.dayOrder,
  );

  // After loading and error checks, if no data, return null
  if (sortedItineraries.length === 0) {
    return null;
  }

  const primaryGradient = "bg-gradient-to-r from-[#1d2087] to-[#393ca3]";
  const activityGradient = "bg-gradient-to-r from-blue-500 to-blue-600";
  const mealGradient = "bg-gradient-to-r from-amber-500 to-amber-600";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${primaryGradient} rounded-full`}>
              <RiCalendarTodoFill size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-black uppercase">
                Tour Itinerary
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

        {isExpanded && (
          <>
            <div className="border-b border-gray-200 my-6" />

            <div className="space-y-8">
              {sortedItineraries.map((itinerary, index) => {
                const isLastDay = index === sortedItineraries.length - 1;
                const activities = itinerary.activities || [];
                const meals = itinerary.meals || [];

                return (
                  <div key={itinerary._id} className="flex group">
                    <div className="flex flex-col items-center mr-4 sm:mr-6 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${primaryGradient} shadow-md`}
                      >
                        {getDayIcon(index)}
                      </div>
                      {!isLastDay && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${primaryGradient} opacity-60`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-base font-semibold text-[#1d2087] group-hover:text-[#393ca3] transition-colors">
                            {itinerary.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                            <RiMapPinLine
                              className="text-[#1d2087]"
                              size={16}
                            />
                            <span className="text-sm font-semibold text-[#1d2087]">
                              {itinerary.location}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className="inline-block px-3 py-1 bg-[#1d2087] text-white text-sm font-bold rounded-full">
                            {formatDayNumber(itinerary.dayOrder)}
                          </span>
                        </div>
                      </div>

                      {activities.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Activities
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {activities.map((activity, activityIndex) => (
                              <div
                                key={activity._id}
                                className="flex items-start group/activity"
                              >
                                <div className="flex flex-col items-center mr-3 sm:mr-4">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center ${activityGradient} shadow-sm group-hover/activity:shadow-md transition-shadow`}
                                  >
                                    {getActivityIcon(activity.activityType)}
                                  </div>
                                  {activityIndex < activities.length - 1 && (
                                    <div
                                      className={`w-0.5 flex-1 mt-1 ${activityGradient} opacity-60`}
                                    />
                                  )}
                                </div>
                                <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
                                  {activity.information}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {meals.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Meals Included
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {meals.map((meal, mealIndex) => (
                              <div
                                key={meal._id}
                                className="flex items-start group/meal"
                              >
                                <div className="flex flex-col items-center mr-3 sm:mr-4">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center ${mealGradient} shadow-sm group-hover/meal:shadow-md transition-shadow`}
                                  >
                                    {getMealIcon(meal.mealType)}
                                  </div>
                                  {mealIndex < meals.length - 1 && (
                                    <div
                                      className={`w-0.5 flex-1 mt-1 ${mealGradient} opacity-60`}
                                    />
                                  )}
                                </div>
                                <div className="pt-0.5">
                                  <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded mb-1">
                                    {formatMealType(meal.mealType)}
                                  </span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {meal.description} ({meal.mealCount}{" "}
                                    {meal.mealUnit})
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourItinerary;
