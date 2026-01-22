import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/nav/Navbar";
import { getUsers } from "../../hooks/users/getUsers";
import { useState } from "react";
import {
  userSearchSchema,
  type userSearchData,
} from "../../types/users/userSearchTypes";
import UsersSearch from "../../components/search/searchform/UsersSearch";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Pagination from "../../components/pagination/Pagination";
import UsersParent from "../../components/users/UsersParent";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";

const Users = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof userSearchSchema>
  >({
    resolver: zodResolver(userSearchSchema),
  });

  const [searchParams, setSearchParams] = useState<userSearchData>({
    search: "",
    status: "",
    page: 1,
    role: "",
  });

  const onSubmit = (data: z.input<typeof userSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => getUsers(searchParams),
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
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <UsersSearch
          search={register("search")}
          status={register("status")}
          role={register("role")}
          action={handleSubmit(onSubmit)}
        />

        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <UsersParent users={data.users} isLoading={isLoading} />}
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

export default Users;
