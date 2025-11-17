import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import LinkText from "../nav/LinkText";
import { searchVisa } from "../../hooks/visa/visa/searchVisa";
import { useMutation } from "@tanstack/react-query";
import type { visaData } from "../../types/visa/visaDataTypes";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import PageError from "../error/PageError";

interface VisaInputProps {
  onVisaSelect: (visaId: string) => void;
}

const VisaInput: React.FC<VisaInputProps> = ({ onVisaSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const {
    data: visas,
    isPending: visaPending,
    isError: visaError,
    error: vError,
    mutate: searchVisas,
    reset: resetVisaMutation,
  } = useMutation({
    mutationFn: (search: string) => searchVisa(search),
  });

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setHasSearched(false);
      resetVisaMutation();
      return;
    }

    setHasSearched(true);
    setShowResults(true);
    searchVisas(trimmedSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleVisaClick = (visaId: string) => {
    setSelectedVisa(visaId);
    setSearchTerm(visaId.toUpperCase());
    setShowResults(false);
    onVisaSelect(visaId);
  };

  const handleClearSelection = () => {
    setSelectedVisa(null);
    setSearchTerm("");
    setShowResults(false);
    setHasSearched(false);
    resetVisaMutation();
    onVisaSelect("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (selectedVisa && value !== selectedVisa) {
      setSelectedVisa(null);
      onVisaSelect("");
    }

    if (!showResults && value.trim()) {
      setShowResults(true);
    }
  };

  if (visaPending) return <PageLoader />;

  if (visaError)
    return (
      <PageError
        error={vError.message}
        action={() => handleSearch}
        title="Reload"
      />
    );

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold">Visa Input</p>
      <div className="w-full flex flex-row gap-2 relative">
        <input
          className="w-full bg-white px-6 py-3 rounded-lg text-sm font-normal pr-12"
          placeholder="search for visa"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />

        {selectedVisa && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 duration-300"
          >
            <RiCloseLine size={16} color="#6b7280" />
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={visaPending}
          className="p-3.5 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>

      {showResults && hasSearched && visas && (
        <div className="w-full bg-white flex flex-col rounded-lg text-sm max-h-[60vh] overflow-y-auto shadow-xl shadow-black/10">
          {visas.length === 0 ? (
            <div className="px-6 py-3">No visas found</div>
          ) : (
            visas.map((visa: visaData) => (
              <div
                key={visa._id}
                className="hover:bg-gray-50 px-6 py-4 cursor-pointer"
                onClick={() => handleVisaClick(visa._id)}
              >
                <LinkText
                  title={visa._id}
                  url={`visa/view/${visa._id}`}
                  style="uppercase font-semibold"
                />
                <p>{`Country: ${visa.country}`}</p>
                <p>{`Type: ${visa.type}`}</p>
                <p className="line-clamp-2">{`Description: ${visa.mainDescription}`}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VisaInput;
