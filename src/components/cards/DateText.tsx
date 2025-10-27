import { RiCalendarView } from "react-icons/ri";

interface FieldProps {
  date: string;
  style: string;
  textStyle: string;
}

const DateText = ({ date, style, textStyle }: FieldProps) => {
  return (
    <div
      className={`${style} flex flex-row gap-1 items-center justify-start text-sm`}
    >
      <RiCalendarView size={16} className="text-black" />
      <p className={`uppercase text-sm text-black ${textStyle}`}>{date}</p>
    </div>
  );
};

export default DateText;
