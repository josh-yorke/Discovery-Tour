import { useForm } from "react-hook-form";
import Navbar from "../../components/nav/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type z from "zod";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/pagination/Pagination";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import BlogsSearch from "../../components/search/searchform/BlogsSearch";
import { getBlogs } from "../../hooks/blogs/getBlogs";
import BlogsParent from "../../components/blogs/BlogsParent";
import {
  blogsSearchSchema,
  type blogsSearchData,
} from "../../types/blogs/blogsSearchTypes";

const Blogs = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof blogsSearchSchema>
  >({
    resolver: zodResolver(blogsSearchSchema),
  });

  const [searchParams, setSearchParams] = useState<blogsSearchData>({
    search: "",
    status: "",
    page: 1,
  });

  const onSubmit = (data: z.input<typeof blogsSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["blogs", searchParams],
    queryFn: () => getBlogs(searchParams),
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
        <BlogsSearch
          search={register("search")}
          status={register("status")}
          action={handleSubmit(onSubmit)}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <BlogsParent blogs={data.blogs} isLoading={isLoading} />}
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

export default Blogs;
