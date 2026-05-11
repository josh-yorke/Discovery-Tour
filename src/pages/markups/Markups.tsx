import { useQuery } from "@tanstack/react-query";
import SectionLoader from "../../components/loader/SectionLoader";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import { getMarkups } from "../../hooks/markups/markups";
import MarkupParent from "../../components/markups/MarkupParent";
import MarkupSearch from "../../components/search/searchform/MarkupSearch";

const Markups = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["markups"],
    queryFn: () => getMarkups(),
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <MarkupSearch />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <MarkupParent markups={data.markups} isLoading={isLoading} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Markups;
