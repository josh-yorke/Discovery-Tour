interface OptionProps {
  options: string[];
  title: string;
}

const Options = ({ options, title, ...props }: OptionProps) => {
  return (
    <div className="flex flex-row px-4 py-2.5 rounded-lg bg-white">
      <p className="text-xs font-semibold">{`${title}:`}</p>
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
