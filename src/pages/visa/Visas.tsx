import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  visaSearchSchema,
  type visaSearchData,
} from "../../types/visa/visaSearchTypes";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useState, useCallback, useMemo } from "react";
import {
  getVisas,
  getVisaTypes,
  getVisaCountries,
} from "../../hooks/visa/visa/getVisas";
import Navbar from "../../components/nav/Navbar";
import VisaParent from "../../components/visa/visa/VisaParent";
import Pagination from "../../components/pagination/Pagination";
import VisaSearch from "../../components/search/searchform/VisaSearch";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";

const Visas = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof visaSearchSchema>
  >({
    resolver: zodResolver(visaSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      country: "",
      type: "",
    },
  });

  const [searchParams, setSearchParams] = useState<visaSearchData>({
    page: 1,
    search: "",
    country: "",
    type: "",
  });

  const { data: visaTypesData } = useQuery({
    queryKey: ["visaTypes"],
    queryFn: getVisaTypes,
    select: (data) => {
      if (!data?.visaTypes) return [];
      return data.visaTypes.filter(
        (type): type is string => typeof type === "string"
      );
    },
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

  const onSubmit = (data: z.input<typeof visaSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const fetchVisas = useCallback(async () => {
    return await getVisas(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["visas", searchParams],
    queryFn: fetchVisas,
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

  const types = useMemo(() => visaTypesData || [], [visaTypesData]);
  const countries = useMemo(() => countriesData || [], [countriesData]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <VisaSearch
          visaType={register("type")}
          country={register("country")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
          countries={countries}
          types={types}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <VisaParent visas={data.visas} isLoading={isLoading} />}
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

export default Visas;
