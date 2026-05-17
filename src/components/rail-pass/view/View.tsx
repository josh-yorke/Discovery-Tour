import ConversionRates from "../../../pages/visa/view/sections/ConversionRates";
import Faqs from "../../../pages/visa/view/sections/Faqs";
import type { RailPassData } from "../../../types/rail-pass/railPassDataTypes";
import PassDocument from "./sections/PassDocument";
import PassInformation from "./sections/PassInformation";
import PassPayment from "./sections/PassPayment";
import PassPricelist from "./sections/PassPricelist";
import PassProcesses from "./sections/PassProcess";
import PassTerm from "./sections/PassTerm";

interface Props extends RailPassData {
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  country,
  category,
  description,
  typeV2,
  title,
  images,
  onDelete,
}: Props) => {
  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <PassInformation
          onDelete={onDelete}
          _id={_id}
          country={country}
          description={description}
          typeV2={typeV2}
          title={title}
          category={category}
          images={images}
        />
        <PassPricelist passId={_id} />
        <PassProcesses passId={_id} />
        <PassPayment passId={_id} />
        <PassTerm passId={_id} />
        <PassDocument passId={_id} />
        <Faqs id={_id} idType="railPassId" />
        <ConversionRates />
      </div>
    </>
  );
};

export default View;
