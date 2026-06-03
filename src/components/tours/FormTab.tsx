import {
  RiBuildingFill,
  RiMapPinAddFill,
  RiListCheck2,
  RiCalendarTodoFill,
  RiShoppingBasketFill,
  RiTimer2Fill,
  RiMoneyCnyCircleFill,
  RiFolder3Fill,
  RiLayoutRight2Fill,
  RiQuestionFill,
} from "react-icons/ri";
import type { FormType } from "./information/add/Add";

interface FormTabsProps {
  formType: FormType;
  setFormType: (type: FormType) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ formType, setFormType }) => {
  const tabs = [
    {
      id: "accommodation" as const,
      icon: RiBuildingFill,
      title: "Accommodation",
    },
    { id: "city" as const, icon: RiMapPinAddFill, title: "City" },
    { id: "scope" as const, icon: RiListCheck2, title: "Scope" },
    { id: "itinerary" as const, icon: RiCalendarTodoFill, title: "Itinerary" },
    {
      id: "pricelist" as const,
      icon: RiShoppingBasketFill,
      title: "Pricelist",
    },
    { id: "process" as const, icon: RiTimer2Fill, title: "Process" },
    { id: "payment" as const, icon: RiMoneyCnyCircleFill, title: "Payment" },
    { id: "term" as const, icon: RiLayoutRight2Fill, title: "Terms" },
    { id: "document" as const, icon: RiFolder3Fill, title: "Documents" },
    { id: "faq" as const, icon: RiQuestionFill, title: "FAQs" },
  ];

  return (
    <div className="flex flex-row mb-6 bg-white rounded-xl p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = formType === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFormType(tab.id)}
            className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
              isActive
                ? "bg-[#1d2087] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            title={tab.title}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
};

export default FormTabs;
