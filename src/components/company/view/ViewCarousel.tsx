import type { companyCarousel } from "../../../types/company/companyDataTypes";
import ImageCard from "../../cards/ImageCard";

const ViewCarousel = ({ carousel }: companyCarousel) => {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <ImageCard url={carousel} style="" />
      </div>
    </>
  );
};

export default ViewCarousel;
