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
  RiArrowUpSLine,
} from "react-icons/ri";
import { useState } from "react";
import { getTourPayment } from "../../../hooks/visa/payment/getPayment";
import SectionLoader from "../../loader/SectionLoader";
import SectionError from "../../error/SectionError";

interface PaymentData {
  _id: string;
  type: string;
  currency: string;
  accountName: string;
  bankName: string;
  accountNo: string;
  bankAddress: string;
  swiftCode: string;
  tour: string;
  __v: number;
}

interface TourPaymentsProps {
  tourId: string;
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

const TourPayments = ({ tourId }: TourPaymentsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PaymentData[]>({
    queryKey: ["tour-payments", tourId],
    queryFn: () => getTourPayment(tourId),
    enabled: !!tourId,
  });

  // Don't render anything if no tourId is provided
  if (!tourId) return null;

  // Show loader if main query is loading
  if (isLoading) return <SectionLoader />;

  // Show error if main query failed
  if (isError) return <SectionError error={error?.message} action={refetch} />;

  // After loading and error checks, if no data, return null
  if (!payments || payments.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiMoneyCnyCircleFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Payment Information
              </p>
            </div>
          </div>
          <RiArrowUpSLine
            size={24}
            className={`cursor-pointer transition-transform duration-300 text-[#1d2087] ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={toggleExpand}
          />
        </div>

        {isExpanded && (
          <>
            <div className="w-full border-b border-black/6" />

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
          </>
        )}
      </div>
    </div>
  );
};

export default TourPayments;
