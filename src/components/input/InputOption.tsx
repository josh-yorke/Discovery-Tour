interface OptionProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "style"
> {
  options: string[];
  style: string;
  title: string;
  disabled: boolean;
}

const InputOption = ({
  disabled,
  options,
  title,
  style,
  value,
  ...props
}: OptionProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className={`px-4 py-2.5 rounded-full ${style}`}>
        <select
          className="text-xs font-normal outline-none capitalize w-full"
          disabled={disabled}
          value={value}
          {...props}
        >
          <option value="">Select {title.toLowerCase()}</option>
          {options.map((option: string, id) => (
            <option value={option} key={id}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InputOption;
