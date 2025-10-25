interface InputProps {
  placeholder: string;
}

const SearchInput = ({ placeholder, ...props }: InputProps) => {
  return (
    <input
      type="text"
      className="w-full bg-white px-6 py-3 rounded-lg text-sm font-normal"
      placeholder={placeholder}
      {...props}
    />
  );
};

export default SearchInput;
