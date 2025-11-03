import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getDetails } from "../../hooks/company/getDetails";
import Navbar from "../../components/nav/Navbar";
import IconButton from "../../components/button/IconButton";
import { RiPencilLine } from "react-icons/ri";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import ViewCarousel from "../../components/company/view/ViewCarousel";

const Carousel = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] py-12 gap-12">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold text-[#1d2087]">
            Manage Carousel
          </p>
          <IconButton
            action={() => navigate("/company/carousel/edit")}
            title="Edit Carousel"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-lg"
            icon={<RiPencilLine size={16} />}
          />
        </div>
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <>
              <ViewCarousel carousel={data.carousel} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default Carousel;
