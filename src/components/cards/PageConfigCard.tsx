import {
  RiDeleteBin4Fill,
  RiPencilFill,
  RiLinkM,
  RiSortAsc,
  RiFolderChartLine,
} from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";

interface ChildPage {
  _id: string;
  type: string;
  key: string;
  displayName: string;
  pathLink: string;
  order: number;
  isUnderMaintenance: boolean;
}

interface PageConfigCardProps {
  _id: string;
  type: string;
  keyName: string;
  displayName: string;
  pathLink: string;
  order: number;
  isUnderMaintenance: boolean;
  childPages: ChildPage[];
  onDelete?: () => void;
}

const PageConfigCard = ({
  _id,
  type,
  keyName,
  displayName,
  pathLink,
  order,
  isUnderMaintenance,
  childPages,
  onDelete,
}: PageConfigCardProps) => {
  const navigate = useNavigate();

  const getTypeColor = () => {
    switch (type) {
      case "maintab":
        return "from-[#1d2087] to-[#2a2eb5]";
      case "subtab":
        return "from-green-600 to-green-700";
      default:
        return "from-purple-600 to-purple-700";
    }
  };

  const getTypeBadgeColor = () => {
    switch (type) {
      case "maintab":
        return "bg-blue-100 text-blue-800";
      case "subtab":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className={`bg-linear-to-r ${getTypeColor()} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor()}`}
              >
                {type}
              </span>
              {isUnderMaintenance && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Maintenance
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-xl tracking-tight">
              {displayName}
            </h3>
          </div>
          {onDelete && (
            <div className="flex items-center gap-1">
              <IconButton
                action={() => navigate(`/page-configs/edit/${_id}`)}
                title=""
                icon={<RiPencilFill size={16} />}
                style="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all"
              />
              <IconButton
                action={onDelete}
                title=""
                icon={<RiDeleteBin4Fill size={16} />}
                style="bg-white/20 hover:bg-red-500/70 text-white rounded-full p-2.5 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide flex items-center gap-1">
              <RiLinkM size={12} />
              Key
            </p>
            <p className="text-lg font-bold text-gray-800 mt-1 truncate">
              {keyName}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide flex items-center gap-1">
              <RiSortAsc size={12} />
              Order
            </p>
            <p className="text-lg font-bold text-gray-800 mt-1">{order}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
              <RiLinkM size={12} />
              Path Link
            </p>
            <p className="text-sm font-medium text-gray-800 mt-1 break-all">
              {pathLink}
            </p>
          </div>
        </div>

        {childPages && childPages.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1 mb-2">
              <RiFolderChartLine size={12} />
              Child Pages ({childPages.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {childPages.slice(0, 3).map((child) => (
                <span
                  key={child._id}
                  className="text-xs bg-white px-2 py-1 rounded-md text-gray-700 border border-gray-200"
                >
                  {child.displayName}
                </span>
              ))}
              {childPages.length > 3 && (
                <span className="text-xs bg-white px-2 py-1 rounded-md text-gray-500 border border-gray-200">
                  +{childPages.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageConfigCard;
