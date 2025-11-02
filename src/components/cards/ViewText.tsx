interface ViewProps {
  text: string;
  title: string;
  style: string;
}

const ViewText = ({ text, title, style }: ViewProps) => {
  return (
    <div className="w-full flex flex-col gap-2 items-start justify-center">
      <p className="text-sm font-semibold">{title}</p>
      <div
        className={`w-full flex items-center justify-start px-4 py-3 bg-white rounded-lg text-sm font-normal ${style}`}
      >
        {text}
      </div>
    </div>
  );
};

export default ViewText;
