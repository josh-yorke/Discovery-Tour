import { useState, useEffect } from "react";
import { RiCalendar2Fill } from "react-icons/ri";

export interface YearPickerProps {
  selectedDate?: Date | string | null;
  onDateChange: (date: Date) => void;
  availableYears?: number[];
  minYear?: number;
  maxYear?: number;
  className?: string;
}

const YearPicker: React.FC<YearPickerProps> = ({
  selectedDate,
  onDateChange,
  availableYears,
  minYear = 2000,
  maxYear = new Date().getFullYear() + 10,
  className = "",
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      return date.getFullYear();
    }
    return new Date().getFullYear();
  });

  const [currentDecade, setCurrentDecade] = useState<number>(() => {
    const initialYear = selectedDate
      ? new Date(selectedDate).getFullYear()
      : new Date().getFullYear();
    return Math.floor(initialYear / 10) * 10;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Update selectedYear when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      setSelectedYear(year);
      setCurrentDecade(Math.floor(year / 10) * 10);
    }
  }, [selectedDate]);

  // Generate years for the current decade
  const getDecadeYears = (): number[] => {
    const startYear = currentDecade;
    const endYear = currentDecade + 11; // Show 12 years (like months in a calendar)
    const years: number[] = [];

    for (let year = startYear; year <= endYear; year++) {
      if (year >= minYear && year <= maxYear) {
        years.push(year);
      }
    }

    return years;
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);

    // Create a new date with the selected year
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setFullYear(year);

    onDateChange(newDate);
    setIsOpen(false);
  };

  const handlePrevDecade = () => {
    setCurrentDecade((prev) => Math.max(minYear, prev - 12));
  };

  const handleNextDecade = () => {
    setCurrentDecade((prev) => Math.min(maxYear - 11, prev + 12));
  };

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const years = getDecadeYears();

  return (
    <div className={`relative ${className}`}>
      {/* Input Trigger */}
      <div
        onClick={togglePicker}
        className="w-full px-6 py-3 rounded-full bg-white cursor-pointer transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium">{selectedYear}</span>
        <RiCalendar2Fill size={14} className="text-gray-500" />
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-3xl shadow-lg z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-3">
            <button
              onClick={handlePrevDecade}
              disabled={currentDecade <= minYear}
              className="p-1 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="text-sm font-semibold">
              {currentDecade} - {currentDecade + 11}
            </span>

            <button
              onClick={handleNextDecade}
              disabled={currentDecade + 11 >= maxYear}
              className="p-1 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Years Grid */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {years.map((year) => {
              const isAvailable =
                !availableYears || availableYears.includes(year);
              const isSelected = year === selectedYear;

              return (
                <button
                  key={year}
                  onClick={() => isAvailable && handleYearSelect(year)}
                  disabled={!isAvailable}
                  className={`
                    aspect-square p-1 rounded-xl text-center transition-all transform hover:scale-105 text-sm
                    ${
                      isSelected
                        ? "bg-[#1d2087] text-white scale-105"
                        : isAvailable
                        ? "bg-white border border-gray-100 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <div className="font-medium">{year}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default YearPicker;
