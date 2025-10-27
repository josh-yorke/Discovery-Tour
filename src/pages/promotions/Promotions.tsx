import { useState } from "react";
import Navbar from "../../components/nav/Navbar";
import PromotionsSearch from "../../components/search/searchform/PromotionsSearch";
import {
  promotionSearchSchema,
  type promotionSearchData,
} from "../../types/promotions/promotionSearchTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "../../hooks/promotions/getPromotions";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import Pagination from "../../components/pagination/Pagination";
import PromotionsParent from "../../components/promotions/PromotionsParent";

const Promotions = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof promotionSearchSchema>
  >({
    resolver: zodResolver(promotionSearchSchema),
  });

  const [searchParams, setSearchParams] = useState<promotionSearchData>({
    search: "",
    status: "",
    page: 1,
  });

  const onSubmit = (data: z.input<typeof promotionSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["promotions", searchParams],
    queryFn: () => getPromotions(searchParams),
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
        <PromotionsSearch
          search={register("search")}
          status={register("status")}
          action={handleSubmit(onSubmit)}
        />
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          <>
            {data && (
              <PromotionsParent
                promotions={data.promotions}
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

export default Promotions;
