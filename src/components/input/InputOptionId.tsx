interface OptionProps {
  options: {
    tourType: string;
    _id: string;
  }[];
  style: string;
  title: string;
  disabled: boolean;
}

const InputOptionId = ({
  disabled,
  options,
  title,
  style,
  ...props
}: OptionProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className={`px-4 py-2.5 rounded-full ${style}`}>
        <select
          className=" text-xs font-normal outline-none capitalize w-full"
          {...props}
          disabled={disabled}
        >
          {options.map((option, id) => (
            <option value={option._id} key={id}>
              {option.tourType}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InputOptionId;
