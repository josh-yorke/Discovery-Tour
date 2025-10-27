interface InputData {
  title: string;
  type: string;
  placeholder: string;
  error: string | undefined;
  disabled: boolean;
}

const Input = ({
  disabled,
  title,
  type,
  placeholder,
  error,
  ...props
}: InputData) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <input
        type={type}
        className="w-full bg-black/5 px-6 py-3 outline-none rounded-lg font-normal"
        placeholder={placeholder}
        {...props}
        disabled={disabled}
      />
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default Input;
