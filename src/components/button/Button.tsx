import ButtonLoader from "../loader/ButtonLoader";

interface ButtonProps {
  title: string;
  style: string;
  isLoading: boolean | null;
}

const Button = ({ title, style, isLoading }: ButtonProps) => {
  return (
    <button
      className={`${style} flex flex-row items-center justify-center gap-2 font-semibold px-6 py-3 rounded-lg w-full cursor-pointer`}
      type="submit"
    >
      {isLoading ? <ButtonLoader /> : title}
    </button>
  );
};

export default Button;
