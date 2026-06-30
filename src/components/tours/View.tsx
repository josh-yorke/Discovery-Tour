import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  RiListCheck2,
  RiCalendarTodoFill,
  RiTimer2Fill,
  RiMoneyCnyCircleFill,
  RiFolder3Fill,
  RiLayoutRight2Fill,
  RiQuestionFill,
  RiInformationFill,
  RiBuildingFill,
} from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";
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
import { getTourProcess } from "../../hooks/visa/process/getProcess";
import { getTourPayment } from "../../hooks/visa/payment/getPayment";
import { getTourTerm } from "../../hooks/visa/terms/getTerm";
import { getTourDocument } from "../../hooks/visa/document/getDocument";
import { getFaqs } from "../../hooks/visa/faqs/faqs";
import { getTourPricelist } from "../../hooks/visa/pricelist/getPriceList";
import { getItinerary } from "../../hooks/tours/itinerary/itinerary";
import { getAccommodation } from "../../hooks/tours/accomodation/accomodation";
import { getScope } from "../../hooks/tours/scope/scope";
import TabNavigation from "../visa/visa/TabNavigation";

interface Props extends tourData {
  onDelete: (_id: string) => void;
}

const NAV_ITEMS = [
  {
    id: "tour-location",
    label: "Information",
    icon: <RiInformationFill size={20} />,
  },
  {
    id: "accommodation",
    label: "Accommodation",
    icon: <RiBuildingFill size={20} />,
  },
  {
    id: "scope",
    label: "Scope",
    icon: <RiListCheck2 size={20} />,
  },

  {
    id: "itinerary",
    label: "Itinerary",
    icon: <RiCalendarTodoFill size={20} />,
  },

  {
    id: "pricelists",
    label: "Pricelists",
    icon: <FaFileInvoiceDollar size={20} />,
  },

  {
    id: "processes",
    label: "Processes",
    icon: <RiTimer2Fill size={20} />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <RiMoneyCnyCircleFill size={20} />,
  },
  {
    id: "terms",
    label: "Terms",
    icon: <RiLayoutRight2Fill size={20} />,
  },
  {
    id: "documents",
    label: "Documents",
    icon: <RiFolder3Fill size={20} />,
  },
  {
    id: "faqs",
    label: "FAQs",
    icon: <RiQuestionFill size={20} />,
  },
  {
    id: "conversion-rates",
    label: "Conversion Rates",
    icon: <RiMoneyCnyCircleFill size={20} />,
  },
];

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
  const queries = useQueries({
    queries: [
      {
        queryKey: ["tour-pricelists-check", _id],
        queryFn: () => getTourPricelist(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-itinerary-check", _id],
        queryFn: () => getItinerary(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-accommodation-check", _id],
        queryFn: () => getAccommodation(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-scope-check", _id],
        queryFn: () => getScope(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-processes-check", _id],
        queryFn: () => getTourProcess(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-payments-check", _id],
        queryFn: () => getTourPayment(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-terms-check", _id],
        queryFn: () => getTourTerm(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-documents-check", _id],
        queryFn: () => getTourDocument(_id),
        enabled: !!_id,
      },
      {
        queryKey: ["tour-faqs-check", _id],
        queryFn: () => getFaqs(_id),
        enabled: !!_id,
      },
    ],
  });

  const [
    pricelistsData,
    itineraryData,
    accommodationData,
    scopeData,
    processesData,
    paymentsData,
    termsData,
    documentsData,
    faqsData,
  ] = queries.map((q) => q.data);

  const sectionData = useMemo(
    () => ({
      pricelists:
        (pricelistsData?.pricelists || pricelistsData || []).length > 0,
      itinerary: (itineraryData?.itineraries || itineraryData || []).length > 0,
      accommodation:
        (accommodationData?.accommodations || accommodationData || []).length >
        0,
      scope: (scopeData?.scopes || scopeData || []).length > 0,
      processes: (processesData?.processes || processesData || []).length > 0,
      payments: (paymentsData?.payments || paymentsData || []).length > 0,
      terms: (termsData?.terms || termsData || []).length > 0,
      documents: (documentsData?.documents || documentsData || []).length > 0,
      faqs: (faqsData?.faqs || faqsData || []).length > 0,
      conversionRates: true,
    }),
    [
      pricelistsData,
      itineraryData,
      accommodationData,
      scopeData,
      processesData,
      paymentsData,
      termsData,
      documentsData,
      faqsData,
    ],
  );

  const navItems = useMemo(() => {
    const visibilityMap = {
      "tour-location": true,
      pricelists: sectionData.pricelists,
      itinerary: sectionData.itinerary,
      accommodation: sectionData.accommodation,
      scope: sectionData.scope,
      processes: sectionData.processes,
      payments: sectionData.payments,
      terms: sectionData.terms,
      documents: sectionData.documents,
      faqs: sectionData.faqs,
      "conversion-rates": sectionData.conversionRates,
    };
    return NAV_ITEMS.filter(
      (item) => visibilityMap[item.id as keyof typeof visibilityMap],
    );
  }, [sectionData]);

  const renderSection = (id: string, children: React.ReactNode) => (
    <div id={id} className="scroll-mt-24">
      {children}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {navItems.length > 0 && (
        <TabNavigation items={navItems} headerHeight={80} className="mb-4" />
      )}
      {renderSection(
        "tour-location",
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
        />,
      )}
      {sectionData.accommodation &&
        renderSection("accommodation", <TourAccommodation tourId={_id} />)}

      {sectionData.scope && renderSection("scope", <TourScope tourId={_id} />)}

      {sectionData.itinerary &&
        renderSection("itinerary", <TourItinerary tourId={_id} />)}

      {sectionData.pricelists &&
        renderSection("pricelists", <TourPricelists tourId={_id} />)}

      {sectionData.processes &&
        renderSection("processes", <TourProcesses tourId={_id} />)}

      {sectionData.payments &&
        renderSection("payments", <TourPayments tourId={_id} />)}

      {sectionData.terms && renderSection("terms", <TourTerms tourId={_id} />)}

      {sectionData.documents &&
        renderSection("documents", <TourDocuments tourId={_id} />)}

      {sectionData.faqs &&
        renderSection("faqs", <Faqs idType="tourId" id={_id} />)}

      {sectionData.conversionRates &&
        renderSection("conversion-rates", <ConversionRates />)}
    </div>
  );
};

export default View;
