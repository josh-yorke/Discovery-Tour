import { RiAddLine, RiSearchLine } from "react-icons/ri";
import SearchInput from "../SearchInput";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";
import LinkText from "../../nav/LinkText";

interface VisaSearchBoxProps {
  hasSearched: boolean;
  visaPending: boolean;
  visas: any[];
  action: () => void;
  search: any;
  onVisaClick: (visaId: string) => void;
  showVisaResults: boolean;
}

const VisaSearchBox: React.FC<VisaSearchBoxProps> = ({
  hasSearched,
  visaPending,
  visas,
  action,
  search,
  onVisaClick,
  showVisaResults,
}) => {
  const navigate = useNavigate();

  return (
    <form
      className="w-full flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <p className="text-md font-semibold text-[#1d2087]">Manage Pricelists</p>

      <div className="w-full lg:w-2/4 flex flex-row gap-2">
        <SearchInput placeholder="search for visas" {...search} />
        <button
          type="submit"
          disabled={visaPending}
          className="p-3.5 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>
      <IconButton
        icon={<RiAddLine size={16} />}
        title="New"
        action={() => navigate("/visas/pricelist/add")}
        style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-lg"
      />

      {showVisaResults && hasSearched && visas && (
        <div className="w-full lg:w-2/4 bg-white flex flex-col rounded-lg text-sm max-h-[60vh] overflow-y-auto shadow-xl shadow-black/10">
          {visas.length === 0 ? (
            <div className="px-6 py-3">No visas found</div>
          ) : (
            visas.map((visa) => (
              <div
                key={visa._id}
                className="hover:bg-gray-50 px-6 py-4 cursor-pointer"
                onClick={() => onVisaClick(visa._id)}
              >
                <LinkText
                  title={visa._id}
                  url={`visa/view/${visa._id}`}
                  style="uppercase font-semibold"
                />
                <p>{`Country: ${visa.country}`}</p>
                <p>{`Type: ${visa.type}`}</p>
                <p className="line-clamp-2">{`Description: ${visa.mainDescription}`}</p>
              </div>
            ))
          )}
        </div>
      )}
    </form>
  );
};
export default VisaSearchBox;
