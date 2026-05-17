import { useState } from "react";
import { triggerScraper } from "../../hooks/scraper/scraper";

interface TriggerScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ScraperModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: TriggerScraperModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<string>("");

  const scraperTypes = [
    {
      id: "smbc",
      label: "SMBC",
      description: "Sumitomo Mitsui Banking Corporation",
    },
    {
      id: "frankfurter",
      label: "Frankfurter",
      description: "Frankfurter exchange rates",
    },
    { id: "all", label: "All", description: "Trigger all scrapers" },
  ];

  const handleConfirm = async () => {
    if (!selectedType) {
      setError("Please select a scraper type");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await triggerScraper(selectedType);
      onClose();
      setSelectedType("");
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to trigger scraper";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSelectedType("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#1d2087]">Trigger Scraper</h3>
          <p className="text-sm text-gray-500 mt-1">
            Select which scraper you want to trigger
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {scraperTypes.map((type) => (
            <label
              key={type.id}
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedType === type.id
                  ? "border-[#1d2087] bg-[#1d2087]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="scraperType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setError("");
                }}
                className="mt-1 mr-3 text-[#1d2087]"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedType || isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-[#1d2087] text-white font-medium hover:bg-[#3b3eac] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Triggering...</span>
              </div>
            ) : (
              "Trigger"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScraperModal;
