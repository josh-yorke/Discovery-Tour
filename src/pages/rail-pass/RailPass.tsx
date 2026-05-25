import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getRailPasses } from "../../hooks/rail-passes/getRailPasses";
import { getPassCategory } from "../../hooks/category/category";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import RailPassSearch from "../../components/search/searchform/RailPassSearch";
import RailPassParent from "../../components/rail-pass/RailPassParent";
import { useSearchParams } from "react-router-dom";

const RailPasses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlCountry = searchParams.get("country") || "";
    const urlCategory = searchParams.get("category") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setCountry(urlCountry);
    setCategory(urlCategory);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (category) params.set("category", category);

    setSearchParams(params, { replace: true });
  }, [page, search, country, category, setSearchParams, isInitialized]);

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

  const { data: categoriesData } = useQuery({
    queryKey: ["passCategories"],
    queryFn: getPassCategory,
    select: (data) => {
      if (!data?.categories) return [];
      return data.categories.filter(
        (category): category is string => typeof category === "string",
      );
    },
  });

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["railPasses", { page, search, country, category }],
    queryFn: () =>
      getRailPasses({
        page,
        search,
        country,
        category,
      }),
    enabled: isInitialized,
  });

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
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
  const categories = useMemo(() => categoriesData || [], [categoriesData]);

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <RailPassSearch
          searchValue={search}
          countryValue={country}
          categoryValue={category}
          onSearchChange={handleSearchChange}
          onCountryChange={handleCountryChange}
          onCategoryChange={handleCategoryChange}
          onSearchSubmit={handleSearchSubmit}
          countries={countries}
          categories={categories}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <RailPassParent
                railPasses={data.railPasses}
                isLoading={isLoading}
              />
            )}
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

export default RailPasses;
