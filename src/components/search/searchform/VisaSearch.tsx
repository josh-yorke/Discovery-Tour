import { RiAddLine, RiFilter3Line, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useState } from "react";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";

interface FormProps {
  searchValue: string;
  countryValue: string;
  typeValue: string;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearchSubmit: () => void;
  types: string[];
  countries: string[];
}

const VisaSearch = ({
  searchValue,
  countryValue,
  typeValue,
  onSearchChange,
  onCountryChange,
  onTypeChange,
  onSearchSubmit,
  types,
  countries,
}: FormProps) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  const handleClearFilters = () => {
    onSearchChange("");
    onCountryChange("");
    onTypeChange("");
  };

  const hasActiveFilters =
    searchValue !== "" || countryValue !== "" || typeValue !== "";
  const activeFiltersCount =
    (searchValue ? 1 : 0) + (countryValue ? 1 : 0) + (typeValue ? 1 : 0);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1d2087]">Manage Visas</h2>
        <p className="text-xs text-gray-500 mt-1">
          Create, edit, and manage your visa packages
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search visas by name or description..."
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
              title="Create New Visa"
              action={() => navigate("/visas/visa/add")}
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-medium"
            />
          </div>

          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-black/6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Filter by Country
                  </label>
                  <select
                    value={countryValue}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {countryValue && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing visas from {countryValue}
                    </p>
                  )}
                </div>

                {types.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Filter by Visa Type
                    </label>
                    <select
                      value={typeValue}
                      onChange={handleTypeChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent"
                    >
                      <option value="">All Visa Types</option>
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {typeValue && (
                      <p className="text-xs text-gray-500 mt-2">
                        Showing {typeValue} visas
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaSearch;
