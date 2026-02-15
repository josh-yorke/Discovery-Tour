import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getTours } from "../../hooks/tours/getTours";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import ToursSearch from "../../components/search/searchform/ToursSearch";
import ToursParent from "../../components/tours/ToursParent";
import { useSearchParams } from "react-router-dom";

const Tours = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlCountry = searchParams.get("country") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setCountry(urlCountry);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (country) params.set("country", country);

    setSearchParams(params, { replace: true });
  }, [page, search, country, setSearchParams, isInitialized]);

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string",
      );
    },
  });

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["tours", { page, search, country }],
    queryFn: () => getTours({ page, search, country }),
    enabled: isInitialized,
  });

  const handleCountryChange = (value: string) => {
    setCountry(value);
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

  const countries = useMemo(() => countriesData || [], [countriesData]);

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <ToursSearch
          searchValue={search}
          countryValue={country}
          onSearchChange={handleSearchChange}
          onCountryChange={handleCountryChange}
          onSearchSubmit={handleSearchSubmit}
          countries={countries}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <ToursParent tours={data.tours} isLoading={isLoading} />}
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

export default Tours;
