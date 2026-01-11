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
      className={`${style} flex flex-row items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full w-full cursor-pointer`}
      onClick={action}
    >
      {isLoading ? <ButtonLoader /> : <p className="line-clamp-1">{title}</p>}
    </button>
  );
};

export default ActionButton;
