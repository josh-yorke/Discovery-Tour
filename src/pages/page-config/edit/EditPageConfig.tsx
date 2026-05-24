import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useQuery } from "@tanstack/react-query";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import { getPageConfig } from "../../../hooks/page-config/pageConfig";
import Edit from "../../../components/page-config/edit/Edit";

const EditPageConfig = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pageConfig", id],
    queryFn: () => getPageConfig(id),
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
            title="Edit Page Config"
            url="/page-configs"
            id={data._id}
          />
          <Edit
            id={data._id}
            type={data.type}
            keyName={data.key}
            displayName={data.displayName}
            pathLink={data.pathLink}
            order={data.order}
            isUnderMaintenance={data.isUnderMaintenance}
            childPages={data.childPages}
          />
        </div>
      )}
    </>
  );
};

export default EditPageConfig;
