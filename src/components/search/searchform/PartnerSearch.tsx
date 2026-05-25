import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";

interface FormProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const PartnerSearch = ({
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
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1d2087]">Manage Partners</h2>
        <p className="text-xs text-gray-500 mt-1">
          Create, edit, and manage your partner relationships
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search partners by name, email, or company..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <button
            onClick={onSearchSubmit}
            className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] transition-all duration-200 cursor-pointer"
          >
            <RiSearchLine size={16} color="white" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-black/6 p-4">
          <div className="flex justify-end">
            <IconButton
              icon={<RiAddLine size={14} />}
              title="Create New Partner"
              action={() => navigate("/partners/add")}
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSearch;
