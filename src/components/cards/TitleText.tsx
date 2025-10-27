interface FieldProps {
  title: string;
  style: string;
}

const TitleText = ({ style, title }: FieldProps) => {
  return <p className={`${style} text-2xl font-semibold uppercase`}>{title}</p>;
};

export default TitleText;
