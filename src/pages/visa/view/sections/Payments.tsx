import { useQuery } from "@tanstack/react-query";
import {
  RiCheckboxCircleFill,
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
  RiNumber8,
  RiNumber9,
  RiMoneyCnyCircleFill,
} from "react-icons/ri";
import SectionLoader from "../../../../components/loader/SectionLoader";
import SectionError from "../../../../components/error/SectionError";
import { getVisaPayments } from "../../../../hooks/visa/visa/getVisa";

interface PaymentData {
  _id: string;
  type: string;
  currency: string;
  accountName: string;
  bankName: string;
  accountNo: string;
  bankAddress: string;
  swiftCode: string;
  visa: string;
  __v: number;
}

interface PaymentsResponse {
  payments: PaymentData[];
}

interface PaymentsProps {
  visaId: string;
}

const getStepIcon = (index: number) => {
  const icons = [
    <RiNumber1 size={16} />,
    <RiNumber2 size={16} />,
    <RiNumber3 size={16} />,
    <RiNumber4 size={16} />,
    <RiNumber5 size={16} />,
    <RiNumber6 size={16} />,
    <RiNumber7 size={16} />,
    <RiNumber8 size={16} />,
    <RiNumber9 size={16} />,
  ];
  return (
    icons[index] || (
      <RiCheckboxCircleFill className="text-[#1d2087]" size={16} />
    )
  );
};

const Payments = ({ visaId }: PaymentsProps) => {
  const {
    data: paymentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PaymentsResponse>({
    queryKey: ["visa-payments", visaId],
    queryFn: () => getVisaPayments(visaId),
    enabled: !!visaId,
  });

  const payments = paymentsData?.payments || [];

  // Don't render anything if no visaId is provided
  if (!visaId) return null;

  // Don't render anything if there are no payments (and not loading or in error state)
  if (!isLoading && !isError && payments.length === 0) {
    return null;
  }

  if (isLoading) return <SectionLoader />;
  if (isError) return <SectionError error={error?.message} action={refetch} />;

  return (
    <div
      className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4"
      id="payment"
    >
      <div className="w-full flex items-start gap-3">
        <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
          <RiMoneyCnyCircleFill size={20} className="text-white" />{" "}
        </div>
        <div className="flex flex-col">
          <p className="text-base md:text-lg font-semibold text-black uppercase">
            Payment Information
          </p>
          <p className="text-xs font-normal text-gray-600">
            Bank account details for visa payment
          </p>
        </div>
      </div>

      <div className="w-full border-b border-black/6" />

      {payments.length === 0 ? (
        <div className="w-full text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm sm:text-base">
            No payment information available for this visa.
          </p>
        </div>
      ) : (
        <div className="w-full space-y-4 sm:space-y-6">
          {payments.map((payment, index) => (
            <div key={payment._id} className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-white bg-[#1d2087]">
                  {getStepIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                    <p className="text-base font-semibold text-[#1d2087]">
                      {payment.type}
                    </p>
                    <span className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100 rounded-2xl">
                      {payment.currency}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Account Name
                        </p>
                        <p className="text-sm font-normal text-gray-800 mt-1">
                          {payment.accountName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Bank Name
                        </p>
                        <p className="text-sm font-normal text-gray-800 mt-1">
                          {payment.bankName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Account Number
                        </p>
                        <p className="text-sm font-normal text-gray-800 mt-1 font-mono">
                          {payment.accountNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          SWIFT Code
                        </p>
                        <p className="text-sm font-normal text-gray-800 mt-1 font-mono">
                          {payment.swiftCode}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Bank Address
                      </p>
                      <p className="text-sm font-normal text-gray-800 mt-1 whitespace-pre-line">
                        {payment.bankAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full border-b border-black/6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
