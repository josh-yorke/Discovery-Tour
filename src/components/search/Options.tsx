interface OptionProps {
  options: string[];
}

const Options = ({ options, ...props }: OptionProps) => {
  return (
    <div className="px-4 py-2.5 rounded-lg bg-white ">
      <select
        className="bg-white text-xs font-normal outline-none capitalize"
        {...props}
      >
        <option value="">All</option>
        {options.map((option: string, id) => (
          <option value={option} key={id}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Options;
