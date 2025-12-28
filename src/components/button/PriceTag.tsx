import { useQuery } from "@tanstack/react-query";
import { getVisaPricelists } from "../../hooks/visa/visa/getVisa";

interface PricePlan {
  _id: string;
  plan: string;
  fee: number;
  description: string;
  visa: string;
  filesAssociated: string[];
  __v: number;
}

interface VisaPriceDisplayProps {
  visaId: string;
}

const PriceTag = ({ visaId }: VisaPriceDisplayProps) => {
  const {
    data: pricelist,
    isLoading: isPricelistLoading,
    isError: isPricelistError,
  } = useQuery({
    queryKey: ["pricelist", visaId],
    queryFn: () => getVisaPricelists(visaId),
  });

  if (isPricelistLoading) {
    return null;
  }

  if (isPricelistError || !pricelist || pricelist.pricelists.length === 0) {
    return (
      <div className="flex flex-col gap-1 items-center justify-center">
        <p className="text-xs text-white">No plan available</p>
      </div>
    );
  }

  const lowestPrice = pricelist.pricelists.reduce(
    (lowest: number, plan: PricePlan) => {
      return plan.fee < lowest ? plan.fee : lowest;
    },
    Number.MAX_SAFE_INTEGER
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div className="flex flex-col gap-1 items-start justify-center">
      {lowestPrice && (
        <p className="text-sm font-semibold text-white">
          Starting from ₱{formatPrice(lowestPrice)}
        </p>
      )}
      <p className="text-xs text-white">
        {pricelist.pricelists.length} plan
        {pricelist.pricelists.length > 1 ? "s" : ""} available
      </p>
    </div>
  );
};

export default PriceTag;
