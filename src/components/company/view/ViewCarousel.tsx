import type { companyCarousel } from "../../../types/company/companyDataTypes";
import ImageCard from "../../cards/ImageCard";

const ViewCarousel = ({ carousel }: companyCarousel) => {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <ImageCard url={carousel} style="h-[40vh] lg:h-[80vh]" />
      </div>
    </>
  );
};

export default ViewCarousel;
