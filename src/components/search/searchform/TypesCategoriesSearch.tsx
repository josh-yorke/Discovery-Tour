import type { UseFormRegisterReturn } from "react-hook-form";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import Options from "../Options";

interface FormProps {
  service: UseFormRegisterReturn;
  action: () => void;
  services: string[];
}

const TypesCategoriesSearch = ({ action, services, service }: FormProps) => {
  const navigate = useNavigate();

  return (
    <form
      className="w-full relative flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">
          Manage Types and Categories
        </p>
      </div>

      <div className="w-full flex flex-row gap-2 items-center justify-center flex-wrap">
        <Options options={services} {...service} allowShowAll={false} title="Types or Categories For" />

        <button
          type="submit"
          className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/types-categories/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </form>
  );
};

export default TypesCategoriesSearch;
