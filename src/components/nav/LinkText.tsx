import { useNavigate } from "react-router";

interface LinkProps {
  title: string;
  url: string;
  style: string;
}

const LinkText = ({ title, url, style }: LinkProps) => {
  const navigate = useNavigate();

  return (
    <p
      className={`${style} text-md cursor-pointer text-[#1d2087] hover:text-[#8f92ff] duration-300`}
      onClick={() => navigate(url)}
    >
      {title}
    </p>
  );
};

export default LinkText;
