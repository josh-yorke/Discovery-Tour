import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getRentals } from "../../hooks/rental/rental";
import RentalSearch from "../../components/search/searchform/RentalSearch";
import RentalParent from "../../components/rental/RentalParent";
import { useSearchParams } from "react-router-dom";

const Rental = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlVehicle = searchParams.get("vehicle") || "";
    const urlMonth = searchParams.get("month") || "";
    const urlDay = searchParams.get("day") || "";
    const urlYear = searchParams.get("year") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setVehicle(urlVehicle);
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
    if (vehicle) params.set("vehicle", vehicle);
    if (month) params.set("month", month);
    if (day) params.set("day", day);
    if (year) params.set("year", year);

    setSearchParams(params, { replace: true });
  }, [
    page,
    search,
    status,
    vehicle,
    month,
    day,
    year,
    setSearchParams,
    isInitialized,
  ]);

  const fetchRentals = useCallback(async () => {
    return await getRentals({
      page,
      search,
      status,
      vehicle,
      month,
      day,
      year,
    });
  }, [page, search, status, vehicle, month, day, year]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["rentals", { page, search, status, vehicle, month, day, year }],
    queryFn: fetchRentals,
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleVehicleChange = (vehicleId: string) => {
    setVehicle(vehicleId);
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

  const statuses = [
    "pending",
    "confirmed",
    "awaiting payment",
    "paid",
    "ongoing",
    "completed",
    "cancelled",
  ];

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <RentalSearch
          searchValue={search}
          statusValue={status}
          monthValue={month}
          dayValue={day}
          yearValue={year}
          vehicleValue={vehicle}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onMonthChange={handleMonthChange}
          onDayChange={handleDayChange}
          onYearChange={handleYearChange}
          onVehicleChange={handleVehicleChange}
          onSearchSubmit={handleSearchSubmit}
          statuses={statuses}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <RentalParent rentals={data?.rentals} isLoading={isLoading} />
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

export default Rental;
