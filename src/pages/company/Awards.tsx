import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { RiAddLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import ViewAwards from "../../components/company/view/ViewAwards";
import IconButton from "../../components/button/IconButton";
import Navbar from "../../components/nav/Navbar";
import { getAwards } from "../../hooks/company/getAwards";
import YearPicker from "../../components/input/YearInput";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";

const Awards = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["awards"],
    queryFn: () => getAwards(),
    enabled: true,
  });

  // Set initial date to the most recent year when data loads
  useEffect(() => {
    if (data && data.years.length > 0) {
      const mostRecentYear = data.years[0];
      setSelectedDate(new Date(mostRecentYear, 0, 1)); // Jan 1 of most recent year
    }
  }, [data]);

  // Get awards for selected year
  const getSelectedYearAwards = () => {
    if (!data) return [];
    const selectedYear = selectedDate.getFullYear();
    const yearData = data.awardsByYear.find(
      (year) => year.year === selectedYear
    );
    return yearData ? yearData.awards : [];
  };

  const selectedYearAwards = getSelectedYearAwards();
  const selectedYear = selectedDate.getFullYear();

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] px-6 py-12 gap-12">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold text-[#1d2087]">Manage Awards</p>
          <IconButton
            action={() => navigate("/company/awards/add")}
            title="Add Award"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-lg"
            icon={<RiAddLine size={16} />}
          />
        </div>

        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : data ? (
          <div className="w-full flex flex-col gap-6 items-center justify-center">
            {/* Year Picker */}
            <div className="w-full lg:w-1/4">
              <YearPicker
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                availableYears={data.years}
                className=""
              />
            </div>

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
        ) : null}
      </div>
    </>
  );
};

export default Awards;
