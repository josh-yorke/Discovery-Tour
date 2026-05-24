import { useState } from "react";
import { RiAddLine, RiFilter3Line, RiSwap3Line } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";

interface PageConfigsSearchProps {
  typesValue: string[];
  onTypesChange: (types: string[]) => void;
}

const PageConfigsSearch = ({
  typesValue,
  onTypesChange,
}: PageConfigsSearchProps) => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(typesValue);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableTypes = [
    { value: "maintab", label: "Main Tab", icon: "📑" },
    { value: "subtab", label: "Sub Tab", icon: "📄" },
    { value: "solo", label: "Solo", icon: "✨" },
  ];

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newTypes);
    onTypesChange(newTypes);
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    onTypesChange([]);
  };

  const getTypeColorClass = (type: string) => {
    switch (type) {
      case "maintab":
        return "bg-blue-100 text-blue-800";
      case "subtab":
        return "bg-green-100 text-green-800";
      case "solo":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1d2087]">
          Page Configurations
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your page layouts and navigation
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-black/6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-xs font-medium ${
                  isFilterOpen || selectedTypes.length > 0
                    ? "bg-[#1d2087] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <RiFilter3Line size={14} />
                <span>Filters</span>
                {selectedTypes.length > 0 && (
                  <span className="ml-1 bg-white text-[#1d2087] text-xs rounded-full px-1.5 py-0.5">
                    {selectedTypes.length}
                  </span>
                )}
              </button>

              {selectedTypes.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <IconButton
                icon={<RiSwap3Line size={14} />}
                title="Re-Order"
                action={() => navigate("/page-configs/re-order")}
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-medium"
              />
              <IconButton
                icon={<RiAddLine size={14} />}
                title="New Page Config"
                action={() => navigate("/page-configs/add")}
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-medium"
              />
            </div>
          </div>

          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-black/6">
              <div className="flex flex-wrap gap-3">
                {availableTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeToggle(type.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-xs font-medium ${
                      selectedTypes.includes(type.value)
                        ? `${getTypeColorClass(type.value)} ring-2 ring-offset-1 ring-[#1d2087]`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-black/6"
                    }`}
                  >
                    <span className="text-base">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageConfigsSearch;
