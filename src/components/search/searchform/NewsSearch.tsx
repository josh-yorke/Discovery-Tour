import type { UseFormRegisterReturn } from "react-hook-form";
import SearchInput from "../SearchInput";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import Options from "../Options";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";

interface FormProps {
  search: UseFormRegisterReturn;
  status: UseFormRegisterReturn;
  action: () => void;
}

const NewsSearch = ({ search, status, action }: FormProps) => {
  const navigate = useNavigate();
  return (
    <form
      className="w-full flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage News</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput placeholder="search for news" {...search} />
        <button className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer">
          <RiSearchLine size={14} color="white" />
        </button>
      </div>
      <div className="w-full flex flex-row gap-2 items-center justify-center">
        <Options options={["published", "draft"]} {...status} title="Status" />
        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/news/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </form>
  );
};

export default NewsSearch;
