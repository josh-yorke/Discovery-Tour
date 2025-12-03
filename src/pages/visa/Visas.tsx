import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  visaSearchSchema,
  type visaSearchData,
} from "../../types/visa/visaSearchTypes";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useState } from "react";
import { getVisas } from "../../hooks/visa/visa/getVisas";
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
  });

  const [searchParams, setSearchParams] = useState<visaSearchData>({
    page: 1,
    search: "",
    country: "",
    type: "",
  });

  const onSubmit = (data: z.input<typeof visaSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["visas", searchParams],
    queryFn: () => getVisas(searchParams),
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

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] px-6 py-12 gap-12">
        <VisaSearch
          visaType={register("type")}
          country={register("country")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
          result={data?.visas}
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
