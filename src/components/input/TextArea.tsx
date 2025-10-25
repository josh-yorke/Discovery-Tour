interface InputProps {
  title: string;
  placeholder: string;
  error: string | undefined;
}

const TextArea = ({ title, placeholder, error, ...props }: InputProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2">
      <p className="text-sm font-semibold">{title}</p>
      <textarea
        className="p-2 rounded-2xl bg-black/5 outline-none w-full px-6 py-3 text-sm font-normal"
        placeholder={placeholder}
        rows={16}
        {...props}
      />
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
