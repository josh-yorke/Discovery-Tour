import type { insuranceData } from "../../../types/insurances/insuranceDataTypes";
import InsuranceDocument from "./sections/InsuranceDocument";
import InsuranceInformation from "./sections/InsuranceInformation";
import InsurancePayment from "./sections/InsurancePayment";
import InsurancePricelist from "./sections/InsurancePricelist";
import InsuranceProcesses from "./sections/InsuranceProcess";
import InsuranceTerm from "./sections/InsuranceTerm";

interface Props extends insuranceData {
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  country,
  insurancePartner,
  countryV2,
  insurancePartnerV2,
  title,
  description,
  images,
  dateAdded,
  onDelete,
}: Props) => {
  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <InsuranceInformation
          onDelete={onDelete}
          _id={_id}
          country={country}
          insurancePartner={insurancePartner}
          countryV2={countryV2}
          insurancePartnerV2={insurancePartnerV2}
          title={title}
          description={description}
          images={images}
          dateAdded={dateAdded}
        />
        <InsurancePricelist insuranceId={_id} />
        <InsuranceProcesses insuranceId={_id} />
        <InsurancePayment insuranceId={_id} />
        <InsuranceTerm insuranceId={_id} />
        <InsuranceDocument insuranceId={_id} />
      </div>
    </>
  );
};

export default View;
