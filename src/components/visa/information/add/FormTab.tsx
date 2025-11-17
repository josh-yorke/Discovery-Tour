import {
  RiFolder3Fill,
  RiLayoutRight2Fill,
  RiMoneyCnyCircleFill,
  RiShoppingBasketFill,
  RiTimer2Fill,
} from "react-icons/ri";
import type { FormType } from "../edit/Edit";

interface FormTabsProps {
  formType: FormType;
  setFormType: (type: FormType) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ formType, setFormType }) => {
  return (
    <div className="flex flex-row gap-2 mb-6 bg-white rounded-xl p-2">
      <button
        type="button"
        onClick={() => setFormType("pricelist")}
        className={`flex flex-row  items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm duration-300 ${
          formType === "pricelist"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <RiShoppingBasketFill size={16} />
        <p className="hidden lg:block">Pricelist</p>
      </button>
      <button
        type="button"
        onClick={() => setFormType("process")}
        className={`flex flex-row  items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm duration-300 ${
          formType === "process"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <RiTimer2Fill size={16} />
        <p className="hidden lg:block">Process</p>
      </button>
      <button
        type="button"
        onClick={() => setFormType("payment")}
        className={`flex flex-row  items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm duration-300 ${
          formType === "payment"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <RiMoneyCnyCircleFill size={16} />
        <p className="hidden lg:block">Payment</p>
      </button>
      <button
        type="button"
        onClick={() => setFormType("term")}
        className={`flex flex-row  items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm duration-300  ${
          formType === "term"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <RiLayoutRight2Fill size={16} />
        <p className="hidden lg:block">Term</p>
      </button>
      <button
        type="button"
        onClick={() => setFormType("document")}
        className={`flex flex-row  items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm duration-300  ${
          formType === "document"
            ? "bg-[#1d2087] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <RiFolder3Fill size={16} />
        <p className="hidden lg:block">Documents</p>
      </button>
    </div>
  );
};

export default FormTabs;
