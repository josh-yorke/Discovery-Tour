import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { RiAddLine } from "react-icons/ri";
import { useState, useMemo, useCallback } from "react";
import ViewAwards from "../../components/company/view/ViewAwards";
import IconButton from "../../components/button/IconButton";
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
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold text-[#1d2087]">Manage Awards</p>
          <IconButton
            action={() => navigate("/company/awards/add")}
            title="Add Award"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-full"
            icon={<RiAddLine size={16} />}
          />
        </div>

        <div className="w-full flex flex-col gap-6 items-center justify-center">
          <div className="w-full lg:w-1/2 flex gap-4">
            <select
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleYearChange(Number(e.target.value))
              }
              className="w-full p-2 border rounded-lg bg-white"
            >
              {availableYears.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonthName}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleMonthChange(e.target.value)
              }
              className="w-full p-2 border rounded-lg bg-white"
            >
              {availableMonths.map((month: MonthOption) => (
                <option key={month.name} value={month.name}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          {filteredAwards.length > 0 ? (
            <ViewAwards awards={filteredAwards} refetchAwards={refetch} />
          ) : (
            <div className="h-[60vh] flex items-center justify-center">
              <p className="text-sm font-normal">
                No Awards found for {selectedMonthName} {selectedYear}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Awards;
