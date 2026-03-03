import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import SearchInput from "../SearchInput";
import Options from "../Options";
import IconButton from "../../button/IconButton";
import SearchableBranchDropdown from "../../input/SearchableBranchDropdown";

interface FormProps {
  searchValue: string;
  statusValue: string;
  employmentTypeValue: string;
  branchValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onEmploymentTypeChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

const CareersSearch = ({
  searchValue,
  statusValue,
  employmentTypeValue,
  branchValue,
  onSearchChange,
  onStatusChange,
  onEmploymentTypeChange,
  onBranchChange,
  onSearchSubmit,
  onClearFilters,
}: FormProps) => {
  const navigate = useNavigate();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  const handleEmploymentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onEmploymentTypeChange(e.target.value);
  };

  const handleBranchChange = (branchId: string) => {
    onBranchChange(branchId);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  const employmentOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];

  const statusOptions = ["open", "closed", "draft"];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Careers</p>
      </div>

      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search for careers"
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

      <div className="w-full flex flex-row flex-wrap gap-2 items-center justify-center">
        <Options
          options={statusOptions}
          value={statusValue}
          onChange={handleStatusChange}
          title="Status"
        />

        <Options
          options={employmentOptions}
          value={employmentTypeValue}
          onChange={handleEmploymentTypeChange}
          title="Type"
        />

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/careers/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
      <div className="min-w-[20vw]">
        <SearchableBranchDropdown
          disabled={false}
          title="Branch"
          value={branchValue}
          onChange={handleBranchChange}
          placeholder="Search branches..."
        />
      </div>

      {(searchValue || statusValue || employmentTypeValue || branchValue) && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default CareersSearch;
