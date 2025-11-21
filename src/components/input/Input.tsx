interface InputData {
  title: string;
  type: string;
  placeholder: string;
  error: string | undefined;
  disabled: boolean;
  style: string;
}

const Input = ({
  disabled,
  title,
  type,
  placeholder,
  error,
  style,
  ...props
}: InputData) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <input
        type={type}
        className={`w-full px-6 py-3 outline-none rounded-lg font-normal ${style}`}
        placeholder={placeholder}
        {...props}
        disabled={disabled}
      />
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default Input;
