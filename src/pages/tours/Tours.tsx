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
import { getTours } from "../../hooks/tours/getTours";
import {
  tourSearchSchema,
  type tourSearchData,
} from "../../types/tours/tourSearchTypes";
import ToursSearch from "../../components/search/searchform/ToursSearch";
import ToursParent from "../../components/tours/ToursParent";

const Tours = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof tourSearchSchema>
  >({
    resolver: zodResolver(tourSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      country: "",
      // type: "",
    },
  });

  const [searchParams, setSearchParams] = useState<tourSearchData>({
    page: 1,
    search: "",
    country: "",
    // type: "",
  });

  // const { data: tourTypesData } = useQuery({
  //   queryKey: ["tourTypes"],
  //   queryFn: getTourTypes,
  //   select: (data) => {
  //     if (!data?.tourTypes) return [];
  //     return data.tourTypes.filter(
  //       (type): type is string => typeof type === "string"
  //     );
  //   },
  // });

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

  const onSubmit = (data: z.input<typeof tourSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const fetchTours = useCallback(async () => {
    return await getTours(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["tours", searchParams],
    queryFn: fetchTours,
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

  // const types = useMemo(() => tourTypesData || [], [tourTypesData]);
  const countries = useMemo(() => countriesData || [], [countriesData]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <ToursSearch
          // tourType={register("type")}
          country={register("country")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
          countries={countries}
          // types={types}
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
