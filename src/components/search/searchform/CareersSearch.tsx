import { RiAddLine, RiFilter3Line, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useState } from "react";
import SearchInput from "../SearchInput";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleClearFilters = () => {
    onClearFilters();
  };

  const employmentOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const statusOptions = ["open", "closed", "draft"];

  const hasActiveFilters =
    searchValue !== "" ||
    statusValue !== "" ||
    employmentTypeValue !== "" ||
    branchValue !== "";
  const activeFiltersCount =
    (searchValue ? 1 : 0) +
    (statusValue ? 1 : 0) +
    (employmentTypeValue ? 1 : 0) +
    (branchValue ? 1 : 0);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1d2087]">Manage Careers</h2>
        <p className="text-xs text-gray-500 mt-1">
          Create, edit, and manage your career opportunities
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search careers by title, department, or description..."
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-xs font-medium ${
                  isFilterOpen || hasActiveFilters
                    ? "bg-[#1d2087] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <RiFilter3Line size={14} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 bg-white text-[#1d2087] text-xs rounded-full px-1.5 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                >
                  Clear all
                </button>
              )}
            </div>

            <IconButton
              icon={<RiAddLine size={14} />}
              title="Create New Career"
              action={() => navigate("/careers/add")}
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-medium"
            />
          </div>

          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-black/6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={statusValue}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {statusValue && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing careers with status: {statusValue}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Filter by Employment Type
                  </label>
                  <select
                    value={employmentTypeValue}
                    onChange={handleEmploymentTypeChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {employmentOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {employmentTypeValue && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing {employmentTypeValue} positions
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <SearchableBranchDropdown
                    disabled={false}
                    title="Filter by Branch"
                    value={branchValue}
                    onChange={handleBranchChange}
                    placeholder="Search branches..."
                  />
                  {branchValue && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing careers for selected branch
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersSearch;
