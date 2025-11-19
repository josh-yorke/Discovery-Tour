import ButtonLoader from "../loader/ButtonLoader";

interface ButtonProps {
  title: string;
  style: string;
  isLoading: boolean | undefined;
  action: () => void;
}

const ActionButton = ({ action, title, style, isLoading }: ButtonProps) => {
  return (
    <button
      className={`${style} flex flex-row items-center justify-center gap-2 font-semibold px-6 py-4 rounded-lg w-full cursor-pointer`}
      onClick={action}
    >
      {isLoading ? <ButtonLoader /> : title}
    </button>
  );
};

export default ActionButton;
