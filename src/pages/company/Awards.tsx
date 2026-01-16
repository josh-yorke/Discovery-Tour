import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { RiAddLine } from "react-icons/ri";
import { useState, useEffect, useMemo } from "react";
import ViewAwards from "../../components/company/view/ViewAwards";
import IconButton from "../../components/button/IconButton";
import Navbar from "../../components/nav/Navbar";
import { getAwards, type AwardsResponse } from "../../hooks/company/getAwards";
import YearPicker from "../../components/input/YearInput";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { getCompanyId } from "../../hooks/company/getDetails";

const Awards = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get company ID first
  const {
    data: companyId,
    isLoading: isLoadingCompany,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["companyId"],
    queryFn: getCompanyId,
  });

  // Then fetch awards using company ID
  const {
    data: awardsData,
    isLoading: isLoadingAwards,
    refetch,
    isError: isAwardsError,
    error: awardsError,
  } = useQuery<AwardsResponse>({
    queryKey: ["awards", companyId],
    queryFn: () =>
      companyId
        ? getAwards(companyId)
        : Promise.reject(new Error("Company ID not found")),
    enabled: !!companyId,
  });

  // Set initial date to most recent year when awards data loads
  useEffect(() => {
    if (awardsData?.years.length) {
      const mostRecentYear = awardsData.years[0];
      setSelectedDate(new Date(mostRecentYear, 0, 1));
    }
  }, [awardsData]);

  // Memoize selected year awards to prevent unnecessary recalculations
  const selectedYearAwards = useMemo(() => {
    if (!awardsData) return [];
    const selectedYear = selectedDate.getFullYear();
    const yearData = awardsData.awardsByYear.find(
      (year) => year.year === selectedYear
    );
    return yearData ? yearData.awards : [];
  }, [awardsData, selectedDate]);

  const selectedYear = selectedDate.getFullYear();

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // Combine states
  const isLoading = isLoadingCompany || isLoadingAwards;
  const isError = isCompanyError || isAwardsError;
  const errorMessage =
    companyError?.message || awardsError?.message || "An error occurred";

  // Get available years from awards data
  const availableYears = awardsData?.years || [];

  // Loading and error states
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex items-center justify-center bg-gray-100 min-h-svh px-6 py-12">
          <SectionLoader />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="w-full flex items-center justify-center bg-gray-100 min-h-svh px-6 py-12">
          <SectionError action={refetch} error={errorMessage} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold text-[#1d2087]">Manage Awards</p>
          <IconButton
            action={() => navigate("/company/awards/add")}
            title="Add Award"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-full"
            icon={<RiAddLine size={16} />}
          />
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col gap-6 items-center justify-center">
          {/* Year Picker */}
          {availableYears.length > 0 && (
            <div className="w-full lg:w-1/4">
              <YearPicker
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                availableYears={availableYears}
              />
            </div>
          )}

          {/* Awards Display */}
          {selectedYearAwards.length > 0 ? (
            <ViewAwards awards={selectedYearAwards} />
          ) : (
            <div className="h-[60vh] flex items-center justify-center">
              <p className="text-sm font-normal">
                No Awards found for {selectedYear}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Awards;
