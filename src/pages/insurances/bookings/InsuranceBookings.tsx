import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { getInsuranceBookings } from "../../../hooks/insurances/insuranceBookings";
import SectionLoader from "../../../components/loader/SectionLoader";
import SectionError from "../../../components/error/SectionError";
import Pagination from "../../../components/pagination/Pagination";
import InsuranceBookingSearch from "../../../components/search/searchform/InsuranceBookingSearch";
import InsuranceBookingParent from "../../../components/insurances/bookings/InsuranceBookingsParent";
import Navbar from "../../../components/nav/Navbar";

const InsuranceBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [insurance, setInsurance] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlInsurance = searchParams.get("insurance") || "";
    const urlMonth = searchParams.get("month") || "";
    const urlDay = searchParams.get("day") || "";
    const urlYear = searchParams.get("year") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setInsurance(urlInsurance);
    setMonth(urlMonth);
    setDay(urlDay);
    setYear(urlYear);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (insurance) params.set("insurance", insurance);
    if (month) params.set("month", month);
    if (day) params.set("day", day);
    if (year) params.set("year", year);

    setSearchParams(params, { replace: true });
  }, [
    page,
    search,
    status,
    insurance,
    month,
    day,
    year,
    setSearchParams,
    isInitialized,
  ]);

  const fetchBookings = useCallback(async () => {
    return await getInsuranceBookings({
      page,
      search,
      status,
      insurance,
      month,
      day,
      year,
    });
  }, [page, search, status, insurance, month, day, year]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: [
      "insuranceBookings",
      { page, search, status, insurance, month, day, year },
    ],
    queryFn: fetchBookings,
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleInsuranceChange = (insuranceId: string) => {
    setInsurance(insuranceId);
    setPage(1);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    setPage(1);
  };

  const handleDayChange = (value: string) => {
    setDay(value);
    setPage(1);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const statuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <InsuranceBookingSearch
          searchValue={search}
          statusValue={status}
          monthValue={month}
          dayValue={day}
          yearValue={year}
          insuranceValue={insurance}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onMonthChange={handleMonthChange}
          onDayChange={handleDayChange}
          onYearChange={handleYearChange}
          onInsuranceChange={handleInsuranceChange}
          onSearchSubmit={handleSearchSubmit}
          statuses={statuses}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <InsuranceBookingParent
              bookings={data?.bookings}
              isLoading={isLoading}
            />
            {data?.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InsuranceBookings;
