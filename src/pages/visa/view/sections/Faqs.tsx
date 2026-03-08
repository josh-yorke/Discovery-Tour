import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RiQuestionFill } from "react-icons/ri";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SectionLoader from "../../../../components/loader/SectionLoader";
import { getAllFaqs } from "../../../../hooks/visa/faqs/faqs";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQsSectionProps {
  idType: "tourId" | "railPassId" | "transportId" | "insuranceId" | "visaId";
  id: string;
  title?: string;
}

const Faqs = ({
  idType,
  id,
  title = "Frequently Asked Questions",
}: FAQsSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const {
    data: faqs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["faqs", idType, id],
    queryFn: () => getAllFaqs(idType, id),
    enabled: !!id && !!idType,
  });

  const toggleItem = (faqId: string) => {
    setOpenItems((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId],
    );
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl">
        <SectionLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white p-6 rounded-3xl flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
            <RiQuestionFill size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm md:text-base font-semibold text-black uppercase">
              {title}
            </p>
            <p className="text-xs font-normal text-red-500">
              Error loading FAQs:{" "}
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col gap-4"
      id="faqs"
    >
      <div className="w-full flex items-start gap-3">
        <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
          <RiQuestionFill size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm md:text-base font-semibold text-black uppercase">
            {title}
          </p>
          <p className="text-xs font-normal text-gray-600">
            {faqs.length} {faqs.length === 1 ? "question" : "questions"}
          </p>
        </div>
      </div>

      <div className="w-full border-b border-black/6" />

      <div className="w-full flex flex-col divide-y divide-gray-200">
        {faqs.map((faq: FAQ) => (
          <div key={faq._id} className="py-3 first:pt-0 last:pb-0">
            <button
              onClick={() => toggleItem(faq._id)}
              className="w-full flex items-center justify-between text-left focus:outline-none group"
            >
              <span className="text-sm md:text-base font-medium text-gray-900 pr-4 group-hover:text-[#1d2087] transition-colors">
                {faq.question}
              </span>
              <span className="shrink-0 ml-4">
                {openItems.includes(faq._id) ? (
                  <FaChevronUp size={16} className="text-[#1d2087]" />
                ) : (
                  <FaChevronDown
                    size={16}
                    className="text-gray-400 group-hover:text-[#1d2087] transition-colors"
                  />
                )}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems.includes(faq._id) ? "max-h-96 mt-3" : "max-h-0"
              }`}
            >
              <div className="text-xs md:text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans">
                  {faq.answer}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
