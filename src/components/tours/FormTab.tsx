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
  return (
    <div className="flex flex-row mb-6 bg-white rounded-xl p-2">
      <button
        type="button"
        onClick={() => setFormType("accommodation")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "accommodation"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Accommodation"
      >
        <RiBuildingFill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("city")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "city"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="City"
      >
        <RiMapPinAddFill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("scope")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "scope"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Scope"
      >
        <RiListCheck2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("itinerary")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "itinerary"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Itinerary"
      >
        <RiCalendarTodoFill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("pricelist")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "pricelist"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Pricelist"
      >
        <RiShoppingBasketFill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("process")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "process"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Process"
      >
        <RiTimer2Fill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("payment")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "payment"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Payment"
      >
        <RiMoneyCnyCircleFill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("term")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "term"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Terms"
      >
        <RiLayoutRight2Fill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("document")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "document"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="Documents"
      >
        <RiFolder3Fill size={16} />
      </button>
      <button
        type="button"
        onClick={() => setFormType("faq")}
        className={`flex items-center justify-center p-3 rounded-lg text-sm duration-300 ${
          formType === "faq"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title="FAQs"
      >
        <RiQuestionFill size={16} />
      </button>
    </div>
  );
};

export default FormTabs;
