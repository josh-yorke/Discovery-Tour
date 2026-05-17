import TourPricelists from "./sections/TourPricelists";
import TourLocation from "./sections/TourLocation";
import TourItinerary from "./sections/TourItinerary";
import TourAccommodation from "./sections/TourAccommodations";
import TourScope from "./sections/TourScope";
import TourProcesses from "./sections/TourProcess";
import TourPayments from "./sections/TourPayments";
import TourTerms from "./sections/TourTerms";
import TourDocuments from "./sections/TourDocuments";
import type { tourData } from "../../types/tours/tourDataTypes";
import Faqs from "../../pages/visa/view/sections/Faqs";
import ConversionRates from "../../pages/visa/view/sections/ConversionRates";

interface Props extends tourData {
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  country,
  category,
  tags,
  mainDescription,
  mainLocationImages,
  mainLocationName,
  mainLocationDescription,
  dateAdded,
  typeV2,
  countryV2,
  images,
  onDelete,
  title,
}: Props) => {
  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <TourLocation
          title={title}
          onDelete={onDelete}
          _id={_id}
          country={country}
          typeV2={typeV2}
          category={category}
          tags={tags}
          mainDescription={mainDescription}
          mainLocationImages={mainLocationImages}
          mainLocationName={mainLocationName}
          mainLocationDescription={mainLocationDescription}
          dateAdded={dateAdded}
          countryV2={countryV2}
          images={images}
        />
        <TourPricelists tourId={_id} />
        <TourItinerary tourId={_id} />
        <TourAccommodation tourId={_id} />
        <TourScope tourId={_id} />
        <TourProcesses tourId={_id} />
        <TourPayments tourId={_id} />
        <TourTerms tourId={_id} />
        <TourDocuments tourId={_id} />
        <Faqs idType="tourId" id={_id} />
        <ConversionRates />
      </div>
    </>
  );
};

export default View;
