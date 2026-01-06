import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useState, useCallback, useMemo } from "react";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";

import {
  railSearchSchema,
  type railSearchData,
} from "../../types/rail-pass/railSearchTypes";
import { getRailPasses } from "../../hooks/rail-passes/getRailPasses";
import RailPassSearch from "../../components/search/searchform/RailPassSearch";
import RailPassParent from "../../components/rail-pass/RailPassParent";

const Tours = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof railSearchSchema>
  >({
    resolver: zodResolver(railSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      country: "",
      type: "",
    },
  });

  const [searchParams, setSearchParams] = useState<railSearchData>({
    page: 1,
    search: "",
    country: "",
    type: "",
  });

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string"
      );
    },
  });

  const onSubmit = (data: z.input<typeof railSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const fetchRailPasses = useCallback(async () => {
    return await getRailPasses(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["railPasses", searchParams],
    queryFn: fetchRailPasses,
    enabled: true,
  });

  const handlePageChange = (page: number) => {
    const values = getValues();
    setValue("page", page);
    setSearchParams({
      ...values,
      page,
    });
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <RailPassSearch
          country={register("country")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
          countries={countries}
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
                currentPage={searchParams.page ?? 1}
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
