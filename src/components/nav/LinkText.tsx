interface LinkProps {
  title: string;
  url: string;
  style: string;
}

const LinkText = ({ title, url, style }: LinkProps) => {
  return (
    <p
      className={`${style} text-md cursor-pointer text-[#1d2087] hover:text-[#8f92ff] duration-300`}
      onClick={() => window.open(url, "_blank")}
    >
      {title}
    </p>
  );
};

export default LinkText;
