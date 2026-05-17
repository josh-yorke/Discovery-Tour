import ImageCard from "../cards/ImageCard";

interface CardProps {
  id: string;
  partnerName: string;
  type: string;
  logoImage: string;
  websiteUrl: string;
  dateAdded: string;
  onDelete: () => void;
}

const PartnerCard = ({ id, partnerName, logoImage }: CardProps) => {
  return (
    <div
      className="w-full flex flex-col items-center justify-center p-6 rounded-3xl bg-white"
      key={id}
    >
      <ImageCard
        url={[logoImage]}
        style="max-w-[80px] max-h-[80px] rounded-full"
        tags
      />
      <p>{partnerName}</p>
    </div>
  );
};

export default PartnerCard;
