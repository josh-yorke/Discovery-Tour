import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import SearchInput from "../SearchInput";
import IconButton from "../../button/IconButton";

interface FormProps {
  searchValue: string;
  statusValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const InsuranceSearch = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: FormProps) => {
  const navigate = useNavigate();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Insurance</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search for insurance policies"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button
          onClick={onSearchSubmit}
          className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>
      <div className="w-full flex flex-row gap-2 items-center justify-center">
        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/insurance/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default InsuranceSearch;
