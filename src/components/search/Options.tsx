import { forwardRef } from "react";

interface OptionProps {
  options: string[];
  title: string;
  allowShowAll?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
}

const Options = forwardRef<HTMLSelectElement, OptionProps>(
  (
    { options, title, allowShowAll = true, value, onChange, onBlur, name },
    ref,
  ) => {
    const renderOptions = () => {
      return options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
    };

    return (
      <div className="flex flex-row px-4 py-2.5 rounded-full bg-white items-center justify-center">
        <p className="text-xs font-semibold">{`${title}:`}</p>
        <select
          ref={ref}
          className="bg-white text-xs font-normal outline-none capitalize flex items-center justify-center cursor-pointer"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
        >
          {allowShowAll && <option value="">All</option>}
          {renderOptions()}
        </select>
      </div>
    );
  },
);

export default Options;
