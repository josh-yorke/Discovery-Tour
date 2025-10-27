import { RiHourglassFill } from "react-icons/ri";

interface FieldProps {
  style: string;
  status: string;
  textStyle: string;
}

const StatusText = ({ textStyle, style, status }: FieldProps) => {
  return (
    <div
      className={`${style} flex flex-row gap-1 items-center justify-start text-sm`}
    >
      <RiHourglassFill size={16} className="text-black" />
      <p className={`uppercase text-sm text-black ${textStyle}`}>{status}</p>
    </div>
  );
};

export default StatusText;
