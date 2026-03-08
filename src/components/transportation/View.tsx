import Faqs from "../../pages/visa/view/sections/Faqs";
import type { transportationData } from "../../types/transportation/transportationDataTypes";
import TransportDocument from "./sections/TransportDocument";
import TransportInformation from "./sections/TransportInformation";
import TransportPayment from "./sections/TransportPayment";
import TransportPricelist from "./sections/TransportPricelist";
import TransportProcess from "./sections/TransportProcess";
import TransportTerm from "./sections/TransportTerm";

interface ViewProps {
  transportData: transportationData;
  onDelete: (_id: string) => void;
}

const View = ({ transportData, onDelete }: ViewProps) => {
  const { _id, country, typeV2, title, description, images } = transportData;

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <TransportInformation
          onDelete={onDelete}
          _id={_id}
          country={country}
          typeV2={typeV2}
          title={title}
          description={description}
          images={images}
        />
        <TransportPricelist transportId={_id} />
        <TransportProcess transportId={_id} />
        <TransportPayment transportId={_id} />
        <TransportTerm transportId={_id} />
        <TransportDocument transportId={_id} />
        <Faqs id={_id} idType="transportId" />
      </div>
    </>
  );
};

export default View;
