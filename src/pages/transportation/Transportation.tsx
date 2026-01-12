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
  transportSearchSchema,
  type transportSearchData,
} from "../../types/transportation/transportSearchTypes";
import { getTransports } from "../../hooks/transportation/transportation";
import TransportationSearch from "../../components/search/searchform/TransportationSearch";
import { getTransportTypes } from "../../hooks/category/type";
import TransportationParent from "../../components/transportation/Transportation";

const Transportation = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof transportSearchSchema>
  >({
    resolver: zodResolver(transportSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      country: "",
      type: "",
    },
  });

  const [searchParams, setSearchParams] = useState<transportSearchData>({
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

  const { data: typeData } = useQuery({
    queryKey: ["transportType"],
    queryFn: getTransportTypes,
    select: (data) => {
      if (!data?.types) return [];
      return data.types.filter(
        (type): type is string => typeof type === "string"
      );
    },
  });

  const onSubmit = (data: z.input<typeof transportSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const fetchTransports = useCallback(async () => {
    return await getTransports(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["transports", searchParams],
    queryFn: fetchTransports,
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
  const types = useMemo(() => typeData || [], [typeData]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <TransportationSearch
          types={types}
          type={register("type")}
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
              <TransportationParent
                transportations={data.transports}
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

export default Transportation;
