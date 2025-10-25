import { useForm } from "react-hook-form";
import Navbar from "../../components/nav/Navbar";
import NewsSearch from "../../components/search/searchform/NewsSearch";
import {
  newsSearchSchema,
  type newsSearchData,
} from "../../types/news/newsSearchTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type z from "zod";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "../../hooks/news/getNews";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import NewsParent from "../../components/news/NewsParent";
import Pagination from "../../components/pagination/Pagination";

const News = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof newsSearchSchema>
  >({
    resolver: zodResolver(newsSearchSchema),
  });

  const [searchParams, setSearchParams] = useState<newsSearchData>({
    search: "",
    status: "",
    page: 1,
  });

  const onSubmit = (data: z.input<typeof newsSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["news", searchParams],
    queryFn: () => getNews(searchParams),
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
        <NewsSearch
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
            {data && <NewsParent news={data.news} isLoading={isLoading} />}
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

export default News;
