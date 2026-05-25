import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { RiAddLine, RiFilter3Line, RiCalendarLine } from "react-icons/ri";
import { useState, useMemo, useCallback } from "react";
import ViewAwards from "../../components/company/view/ViewAwards";
import Navbar from "../../components/nav/Navbar";
import { type Award } from "../../hooks/company/getAwards";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { getAwards } from "../../hooks/company/getDetails";

interface MonthOption {
  number: number;
  name: string;
}

const Awards = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonthName, setSelectedMonthName] =
    useState<string>(currentMonthName);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: awardsData,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery<Award[]>({
    queryKey: ["awards", selectedYear, selectedMonthName],
    queryFn: () => getAwards(selectedYear.toString(), selectedMonthName),
  });

  const availableYears = useMemo<number[]>(() => {
    const currentYearNum = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2020; year <= currentYearNum; year++) {
      years.push(year);
    }
    return years.sort((a, b) => b - a);
  }, []);

  const availableMonths = useMemo<MonthOption[]>(() => {
    const months: MonthOption[] = [];
    const maxMonth = selectedYear === currentYear ? currentMonthNumber : 12;

    for (let month = 1; month <= maxMonth; month++) {
      const date = new Date(2000, month - 1, 1);
      months.push({
        number: month,
        name: date.toLocaleString("default", { month: "long" }),
      });
    }
    return months;
  }, [selectedYear, currentYear, currentMonthNumber]);

  const filteredAwards = useMemo<Award[]>(() => {
    if (!awardsData) return [];
    return awardsData.filter(
      (award: Award) =>
        award.year === selectedYear && award.monthName === selectedMonthName,
    );
  }, [awardsData, selectedYear, selectedMonthName]);

  const handleYearChange = useCallback(
    (year: number) => {
      setSelectedYear(year);
      setSelectedMonthName(year === currentYear ? currentMonthName : "January");
    },
    [currentYear, currentMonthName],
  );

  const handleMonthChange = useCallback((monthName: string) => {
    setSelectedMonthName(monthName);
  }, []);

  const handleClearFilters = () => {
    setSelectedYear(currentYear);
    setSelectedMonthName(currentMonthName);
  };

  const hasActiveFilters =
    selectedYear !== currentYear || selectedMonthName !== currentMonthName;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex items-center justify-center bg-gray-50 min-h-svh px-4 py-8">
          <SectionLoader />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="w-full flex items-center justify-center bg-gray-50 min-h-svh px-4 py-8">
          <SectionError
            action={refetch}
            error={error?.message || "An error occurred"}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full bg-gray-50 min-h-svh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1d2087]">Manage Awards</h1>
            <p className="text-xs text-gray-500 mt-1">
              View and manage your company awards and recognitions
            </p>
          </div>

          {/* Filter Section */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-3xl shadow-sm border border-black/6 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-xs font-medium ${
                      isFilterOpen || hasActiveFilters
                        ? "bg-[#1d2087] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <RiFilter3Line size={14} />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="ml-1 bg-white text-[#1d2087] text-xs rounded-full px-1.5 py-0.5">
                        {(selectedYear !== currentYear ? 1 : 0) +
                          (selectedMonthName !== currentMonthName ? 1 : 0)}
                      </span>
                    )}
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <button
                  onClick={() => navigate("/company/awards/add")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d2087] hover:bg-[#3b3eac] text-white text-xs font-medium rounded-full transition-all duration-200"
                >
                  <RiAddLine size={14} />
                  Add Award
                </button>
              </div>

              {isFilterOpen && (
                <div className="mt-4 pt-4 border-t border-black/6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleYearChange(Number(e.target.value))
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                      >
                        {availableYears.map((year: number) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Month
                      </label>
                      <select
                        value={selectedMonthName}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleMonthChange(e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                      >
                        {availableMonths.map((month: MonthOption) => (
                          <option key={month.name} value={month.name}>
                            {month.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Awards Content */}
          {filteredAwards.length > 0 ? (
            <ViewAwards awards={filteredAwards} refetchAwards={refetch} />
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-black/6 p-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <RiCalendarLine className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No Awards Found
                </h3>
                <p className="text-sm text-gray-500">
                  No awards found for {selectedMonthName} {selectedYear}
                </p>
                <button
                  onClick={() => navigate("/company/awards/add")}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm font-medium rounded-full transition-colors duration-200"
                >
                  <RiAddLine size={16} />
                  Add Your First Award
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Awards;
