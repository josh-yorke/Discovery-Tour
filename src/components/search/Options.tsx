interface OptionProps {
  options: string[];
  title: string;
  allowShowAll?: boolean;
}

const Options = ({
  options,
  title,
  allowShowAll = true,
  ...props
}: OptionProps) => {
  const renderOptions = () => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle === "day") {
      return Array.from({ length: 31 }, (_, i) => (
        <option key={i + 1} value={String(i + 1)}>
          {i + 1}
        </option>
      ));
    }

    if (lowerTitle === "month") {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return months.map((month, index) => (
        <option key={month} value={String(index + 1)}>
          {month}
        </option>
      ));
    }

    if (lowerTitle === "year") {
      const currentYear = new Date().getFullYear();
      const startYear = 2000;
      const endYear = currentYear + 50;

      return Array.from({ length: endYear - startYear + 1 }, (_, i) => (
        <option key={startYear + i} value={String(startYear + i)}>
          {startYear + i}
        </option>
      ));
    }

    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <div className="flex flex-row px-4 py-2.5 rounded-full bg-white">
      <p className="text-xs font-semibold">{`${title}:`}</p>
      <select
        className="bg-white text-xs font-normal outline-none capitalize flex items-center justify-center"
        {...props}
      >
        {allowShowAll && <option value="">All</option>}

        {renderOptions()}
      </select>
    </div>
  );
};

export default Options;
