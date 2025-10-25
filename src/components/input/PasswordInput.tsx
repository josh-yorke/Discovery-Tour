import { useState } from "react";
import { RiEye2Line, RiEyeCloseLine } from "react-icons/ri";

interface InputData {
  title: string;
  placeholder: string;
  error: string | undefined;
}

const PasswordInput = ({ title, placeholder, error, ...props }: InputData) => {
  const [type, setType] = useState(true);

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <div className="w-full relative flex items-center justify-center">
        <input
          type={type ? "password" : "text"}
          className="w-full bg-black/5 px-6 py-3 outline-none rounded-lg font-normal"
          placeholder={placeholder}
          {...props}
        />
        {type ? (
          <RiEye2Line
            size={16}
            className="absolute right-4 cursor-pointer"
            onClick={() => setType(!type)}
          />
        ) : (
          <RiEyeCloseLine
            size={16}
            className="absolute right-4 cursor-pointer"
            onClick={() => setType(!type)}
          />
        )}
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default PasswordInput;
