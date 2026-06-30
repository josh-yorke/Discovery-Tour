import {
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
  RiTimer2Fill,
  RiMoneyCnyCircleFill,
  RiQuestionFill,
  RiFolder3Fill,
  RiLayoutRight2Fill,
} from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { visaData } from "../../../../types/visa/visaDataTypes";
import {
  getVisaDocuments,
  getVisaProcesses,
  getVisaPricelists,
  getVisaTerms,
} from "../../../../hooks/visa/visa/getVisa";
import { getFaqs } from "../../../../hooks/visa/faqs/faqs";
import Documents from "../../../../pages/visa/view/sections/Documents";
import Processes from "../../../../pages/visa/view/sections/Processes";
import Pricelists from "../../../../pages/visa/view/sections/Pricelists";
import Terms from "../../../../pages/visa/view/sections/Terms";
import Faqs from "../../../../pages/visa/view/sections/Faqs";
import ConversionRates from "../../../../pages/visa/view/sections/ConversionRates";
import IconButton from "../../../button/IconButton";
import TitleText from "../../../cards/TitleText";
import TabNavigation from "../TabNavigation";

interface ViewProps extends visaData {
  savedAt: string;
  onDelete: (_id: string) => void;
}

const NAV_ITEMS = [
  {
    id: "visa-type",
    label: "type",
    icon: <RiInformationFill size={20} />,
  },
  { id: "documents", label: "Documents", icon: <RiFolder3Fill size={20} /> },
  { id: "processes", label: "Processes", icon: <RiTimer2Fill size={20} /> },
  {
    id: "pricelists",
    label: "Pricelists",
    icon: <FaFileInvoiceDollar size={20} />,
  },
  { id: "terms", label: "Terms", icon: <RiLayoutRight2Fill size={20} /> },
  { id: "faqs", label: "FAQs", icon: <RiQuestionFill size={20} /> },
  {
    id: "conversion-rates",
    label: "Conversion Rates",
    icon: <RiMoneyCnyCircleFill size={20} />,
  },
];

const View = ({ _id, mainDescription, onDelete, country, type }: ViewProps) => {
  const navigate = useNavigate();
  const hasDescription = !!mainDescription?.trim();
  const hasType = !!type?.trim();

  const queries = useQueries({
    queries: [
      {
        queryKey: ["visa-documents-check", _id],
        queryFn: () => getVisaDocuments(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["visa-processes-check", _id],
        queryFn: () => getVisaProcesses(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["visa-pricelists-check", _id],
        queryFn: () => getVisaPricelists(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["visa-terms-check", _id],
        queryFn: () => getVisaTerms(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["visa-faqs-check", _id],
        queryFn: () => getFaqs(_id),
        enabled: !!_id,
      },
    ],
  });

  const [documentsData, processesData, pricelistsData, termsData, faqsData] =
    queries.map((q) => q.data);

  const sectionData = useMemo(
    () => ({
      documents: (documentsData?.documents || []).length > 0,
      processes: (processesData?.processes || []).length > 0,
      pricelists: (pricelistsData?.pricelists || []).length > 0,
      terms: (termsData?.terms || []).length > 0,
      faqs: (faqsData?.faqs || []).length > 0,
      conversionRates: true,
    }),
    [documentsData, processesData, pricelistsData, termsData, faqsData],
  );

  const navItems = useMemo(() => {
    const visibilityMap = {
      "visa-type": hasType,
      "visa-description": hasDescription,
      documents: sectionData.documents,
      processes: sectionData.processes,
      pricelists: sectionData.pricelists,
      terms: sectionData.terms,
      faqs: sectionData.faqs,
      "conversion-rates": sectionData.conversionRates,
    };
    return NAV_ITEMS.filter(
      (item) => visibilityMap[item.id as keyof typeof visibilityMap],
    );
  }, [hasType, hasDescription, sectionData]);

  const renderSection = (id: string, children: React.ReactNode) => (
    <div id={id} className="scroll-mt-24">
      {children}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-row gap-2">
        <IconButton
          style="px-3 py-2 rounded-full bg-gray-200"
          action={() => navigate(`/visas/visa/edit/${_id}`)}
          title="Edit"
          icon={<RiPencilFill size={16} />}
        />
        <IconButton
          style="px-3 py-2 rounded-full bg-gray-200"
          action={() => onDelete(_id)}
          title="Delete"
          icon={<RiDeleteBin4Fill size={16} />}
        />
      </div>

      <TitleText style="text-[#1d2087]" title={`${country} - ${type} Visa`} />

      {navItems.length > 0 && (
        <TabNavigation items={navItems} headerHeight={80} className="mb-4" />
      )}

      {hasType &&
        renderSection(
          "visa-type",
          <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="w-full flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
                <RiInformationFill size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-semibold text-black uppercase">
                  Visa Type
                </p>
              </div>
            </div>
            <div className="w-full border-b border-gray-200" />
            <div className="w-full">
              <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed">
                {type}
              </p>
            </div>
          </div>,
        )}

      {hasDescription &&
        renderSection(
          "visa-description",
          <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="w-full flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
                <RiInformationFill size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-semibold text-black uppercase">
                  Visa Description
                </p>
              </div>
            </div>
            <div className="w-full border-b border-gray-200" />
            <div className="w-full">
              <pre className="text-sm md:text-base font-normal text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                {mainDescription}
              </pre>
            </div>
          </div>,
        )}

      {sectionData.documents &&
        renderSection("documents", <Documents visaId={_id} />)}
      {sectionData.processes &&
        renderSection("processes", <Processes visaId={_id} />)}
      {sectionData.pricelists &&
        renderSection("pricelists", <Pricelists visaId={_id} />)}
      {sectionData.terms && renderSection("terms", <Terms visaId={_id} />)}
      {sectionData.faqs &&
        renderSection("faqs", <Faqs idType="visaId" id={_id} />)}
      {sectionData.conversionRates &&
        renderSection("conversion-rates", <ConversionRates />)}
    </div>
  );
};

export default View;
