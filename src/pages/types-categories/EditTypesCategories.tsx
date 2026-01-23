import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Navbar from "../../components/nav/Navbar";
import Edit from "../../components/types-categories/Edit";
import Header from "../../components/users/Header";
import { getTypeCategory } from "../../hooks/types-categories/typesCategories";

const EditTypesCategories = () => {
  const { id } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") ?? null;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["visaType", id],
    queryFn: () => getTypeCategory(type, id),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Types and Categories"
            url="/types-categories"
            id={data.record._id}
          />
          <Edit
            id={data.record._id}
            type={data.type}
            visaType={data.record?.visaType}
            tourType={data.record?.tourType}
            transportType={data.record?.transportType}
            railPassType={data.record?.railPassType}
            railPassCategory={data.record?.railPassCategory}
            country={data.record?.country}
          />
        </div>
      )}
    </>
  );
};

export default EditTypesCategories;
