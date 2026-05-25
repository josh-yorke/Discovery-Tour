import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { RiCloseLine } from "react-icons/ri";
import { getAllBranches } from "../../hooks/branches/branches";

interface Branch {
  _id: string;
  branchName: string;
  companyName: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapLink: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  companyId: string;
}

interface SearchableBranchDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

const SearchableBranchDropdown = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = `Search ${title.toLowerCase()}...`,
  className = "",
  inputClassName = "",
  labelClassName = "",
  showLabel = true,
}: SearchableBranchDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (branch: Branch): string => {
    return `${branch.branchName} (${branch.companyName})`;
  };

  useEffect(() => {
    const initializeBranch = async () => {
      if (value && value.trim() !== "") {
        try {
          const branchesData = await getAllBranches();
          const branch = branchesData.find((b: Branch) => b._id === value);
          if (branch) {
            setSearchTerm(getDisplayName(branch));
          }
        } catch (error) {
          console.error("Error initializing branch:", error);
        }
      }
    };

    initializeBranch();
  }, [value]);

  const fetchBranches = useCallback(async (search: string) => {
    try {
      if (!isInitialMount.current) {
        setIsLoading(true);
      }

      const branchesData = await getAllBranches();

      let filtered = branchesData;
      if (search.trim()) {
        filtered = branchesData.filter(
          (branch: Branch) =>
            branch.branchName.toLowerCase().includes(search.toLowerCase()) ||
            branch.companyName.toLowerCase().includes(search.toLowerCase()) ||
            branch.contact.address
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            branch.contact.email.toLowerCase().includes(search.toLowerCase()),
        );
      }

      setBranches(filtered);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
    } finally {
      setIsLoading(false);
      isInitialMount.current = false;
    }
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchBranches(newSearchTerm);
    }, 300);

    if (!newSearchTerm.trim() && value) {
      onChange("");
    }
  };

  const handleBranchSelect = (branch: Branch) => {
    setSearchTerm(getDisplayName(branch));
    onChange(branch._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && branches.length === 0) {
      fetchBranches("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(true);
    fetchBranches("");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" && searchTerm.trim() === "" && value) {
      handleClear();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-start justify-center gap-2 ${className}`}
      ref={dropdownRef}
    >
      {showLabel && (
        <label
          className={`block text-xs font-medium text-gray-700 mb-2 ${labelClassName}`}
        >
          {title}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-gray-50 border border-black/6 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-transparent disabled:opacity-50 pr-10 ${inputClassName}`}
        />

        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear selection"
          >
            <RiCloseLine size={16} />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1d2087] border-t-transparent"></div>
          </div>
        )}

        {isOpen && branches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto border border-black/6">
            {branches.map((branch) => (
              <div
                key={branch._id}
                onClick={() => handleBranchSelect(branch)}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-black/6 last:border-b-0 transition-colors ${
                  branch._id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {branch.branchName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {branch.companyName} • {branch.contact.email} •{" "}
                  {branch.contact.phone}
                </div>
                <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {branch.contact.address}
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && !isLoading && branches.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 p-4 border border-black/6">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No branches found matching "${searchTerm}"`
                : "No branches available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableBranchDropdown;
