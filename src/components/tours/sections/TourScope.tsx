import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  RiCheckboxCircleFill,
  RiArrowUpSLine,
  RiCloseCircleFill,
} from "react-icons/ri";
import SectionLoader from "../../loader/SectionLoader";
import SectionError from "../../error/SectionError";
import { getScope } from "../../../hooks/tours/scope/scope";

interface ScopeData {
  _id: string;
  tour: string;
  scopeCategory: "inclusion" | "exclusion";
  scopeType: string;
  scopeTitle: string;
  scopeDescription: string;
  dateAdded: string;
  __v: number;
}

interface TourScopeProps {
  tourId: string;
}

const getScopeCategoryIcon = (category: "inclusion" | "exclusion") => {
  if (category === "inclusion") {
    return <RiCheckboxCircleFill className="text-emerald-500" size={16} />;
  }
  return <RiCloseCircleFill className="text-rose-500" size={16} />;
};

const getScopeCategoryText = (category: "inclusion" | "exclusion") => {
  if (category === "inclusion") {
    return "Included";
  }
  return "Not Included";
};

const TourScope = ({ tourId }: TourScopeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const {
    data: scopes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ScopeData[]>({
    queryKey: ["tour-scope", tourId],
    queryFn: () => getScope(tourId),
    enabled: !!tourId,
  });

  // Don't render anything if no tourId is provided
  if (!tourId) return null;

  // Show loader if main query is loading
  if (isLoading) return <SectionLoader />;

  // Show error if main query failed
  if (isError) return <SectionError error={error?.message} action={refetch} />;

  const sortedScopes = [...(scopes || [])].sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
  );

  // After loading and error checks, if no data, return null
  if (sortedScopes.length === 0) {
    return null;
  }

  const inclusions = sortedScopes.filter(
    (scope) => scope.scopeCategory === "inclusion",
  );
  const exclusions = sortedScopes.filter(
    (scope) => scope.scopeCategory === "exclusion",
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiCheckboxCircleFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Tour Scope
              </p>
              <p className="text-xs font-normal text-gray-600">
                What's included and excluded in this tour
              </p>
            </div>
          </div>
          <RiArrowUpSLine
            size={24}
            className={`cursor-pointer transition-transform duration-300 text-[#1d2087] ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={toggleExpand}
          />
        </div>

        {isExpanded && (
          <>
            <div className="w-full border-b border-black/6" />

            <div className="w-full space-y-4 sm:space-y-6">
              {inclusions.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  {inclusions.map((scope) => (
                    <div key={scope._id} className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-white bg-linear-to-r from-emerald-500 to-emerald-600">
                          <RiCheckboxCircleFill size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-emerald-700 wrap-break-word">
                                {scope.scopeTitle}
                              </p>
                            </div>
                            <div className="ml-2 shrink-0">
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                {getScopeCategoryIcon("inclusion")}
                                {getScopeCategoryText("inclusion")}
                              </div>
                            </div>
                          </div>
                          {scope.scopeDescription && (
                            <p className="text-xs sm:text-sm font-normal text-gray-600 mt-2 whitespace-pre-line">
                              {scope.scopeDescription}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full border-b border-black/6" />
                    </div>
                  ))}
                </div>
              )}

              {exclusions.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  {exclusions.map((scope) => (
                    <div key={scope._id} className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-white bg-linear-to-r from-rose-500 to-rose-600">
                          <RiCloseCircleFill size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-rose-700 wrap-break-word">
                                {scope.scopeTitle}
                              </p>
                            </div>
                            <div className="ml-2 shrink-0">
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                {getScopeCategoryIcon("exclusion")}
                                {getScopeCategoryText("exclusion")}
                              </div>
                            </div>
                          </div>
                          {scope.scopeDescription && (
                            <p className="text-xs sm:text-sm font-normal text-gray-600 mt-2 whitespace-pre-line">
                              {scope.scopeDescription}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full border-b border-black/6" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourScope;
