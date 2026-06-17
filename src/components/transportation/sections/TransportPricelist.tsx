import { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  RiCheckboxCircleFill,
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
  RiNumber8,
  RiNumber9,
  RiShoppingBasketFill,
  RiArrowUpSLine,
  RiCarFill,
  RiGasStationFill,
  RiUserFill,
  RiLuggageCartFill,
  RiCloseCircleFill,
} from "react-icons/ri";
import api from "../../../hooks/axios/axios";
import {
  getTransportPricelists,
  getVisaFile,
} from "../../../hooks/visa/visa/getVisa";
import SectionLoader from "../../loader/SectionLoader";
import SectionError from "../../error/SectionError";
import ImageCard from "../../cards/ImageCard";

interface FileData {
  _id: string;
  fileTitle: string;
  file: string;
  __v: number;
}

interface VehicleData {
  _id: string;
  vehicleName: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  seatingCapacity: number;
  luggageCapacity: string;
  transmission: string;
  fuelType: string;
  isAvailable: boolean;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PricelistData {
  _id: string;
  plan: string;
  fee: number;
  priceCurrency?: string;
  currency?: string;
  description: string;
  filesAssociated: string[];
  transportId: string;
  vehicle?: string | VehicleData;
  inclusions?: string[];
  duration?: string;
  __v: number;
}

interface PricelistsResponse {
  pricelists: PricelistData[];
}

interface TransportPricelistProps {
  transportId: string;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  JPY: "¥",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
};

const getFileType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const fileTypes: Record<string, string> = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
    gif: "Image",
    txt: "Text",
    zip: "Archive",
    rar: "Archive",
  };
  return fileTypes[extension] || extension.toUpperCase();
};

const getFileIcon = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  if (extension === "pdf") return "📄";
  if (["doc", "docx"].includes(extension)) return "📝";
  if (["xls", "xlsx"].includes(extension)) return "📊";
  if (["ppt", "pptx"].includes(extension)) return "📋";
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "🖼️";
  return "📎";
};

const getFileUrl = (filename: string): string => {
  const baseURL = api.defaults.baseURL || window.location.origin;
  return `${baseURL.replace(/\/$/, "")}/files/${filename}`;
};

const formatCurrency = (
  amount: number,
  currencyCode: string = "PHP",
): string => {
  if (amount === 0 || amount < 0.01) {
    return "Flexible";
  }

  const symbol = currencySymbols[currencyCode] || currencyCode;

  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const getStepIcon = (index: number) => {
  const icons = [
    <RiNumber1 size={16} />,
    <RiNumber2 size={16} />,
    <RiNumber3 size={16} />,
    <RiNumber4 size={16} />,
    <RiNumber5 size={16} />,
    <RiNumber6 size={16} />,
    <RiNumber7 size={16} />,
    <RiNumber8 size={16} />,
    <RiNumber9 size={16} />,
  ];
  return (
    icons[index] || (
      <RiCheckboxCircleFill className="text-[#1d2087]" size={16} />
    )
  );
};

const TransportPricelist = ({ transportId }: TransportPricelistProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const {
    data: pricelistsData,
    isLoading: isLoadingPricelists,
    isError: isErrorPricelists,
    error: pricelistsError,
    refetch: refetchPricelists,
  } = useQuery<PricelistsResponse>({
    queryKey: ["transport-pricelists", transportId],
    queryFn: () => getTransportPricelists(transportId),
    enabled: !!transportId, // Only run if transportId exists
  });

  const pricelists = pricelistsData?.pricelists || [];

  const allFileIds =
    pricelists.length > 0
      ? pricelists.flatMap((pricelist) => pricelist.filesAssociated)
      : [];

  const fileQueries = useQueries({
    queries: allFileIds.map((fileId) => ({
      queryKey: ["transport-pricelist-file", fileId],
      queryFn: () => getVisaFile(fileId),
      enabled: !!fileId && pricelists.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const filesMap = fileQueries.reduce(
    (acc, query) => {
      if (query.data?.file) acc[query.data.file._id] = query.data.file;
      return acc;
    },
    {} as Record<string, FileData>,
  );

  const isLoadingFiles = fileQueries.some((q) => q.isLoading && !q.isError);
  const isErrorFiles = fileQueries.some((q) => q.isError);

  const isLoading =
    isLoadingPricelists || (pricelists.length > 0 && isLoadingFiles);

  if (!transportId) {
    return null;
  }

  if (isLoading) return <SectionLoader />;

  if (isErrorPricelists) {
    return (
      <SectionError
        error={pricelistsError?.message}
        action={refetchPricelists}
      />
    );
  }

  if (pricelists.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiShoppingBasketFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Transportation Prices
              </p>
              <p className="text-xs font-normal text-gray-600">
                Available packages and pricing for this transportation service
              </p>
            </div>
          </div>
          <RiArrowUpSLine
            size={24}
            className={`cursor-pointer transition-transform duration-300 text-[#1d2087] ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={toggleExpand}
          />
        </div>

        {isExpanded && (
          <>
            <div className="w-full border-b border-black/6" />

            <div className="w-full space-y-6">
              {pricelists.map((pricelist, index) => {
                const pricelistFiles = pricelist.filesAssociated
                  .map((fileId) => filesMap[fileId])
                  .filter(Boolean);

                const pricelistFileQueries = fileQueries.filter((q) =>
                  pricelist.filesAssociated.includes(q.data?.file?._id || ""),
                );

                const vehicleData =
                  pricelist.vehicle && typeof pricelist.vehicle === "object"
                    ? (pricelist.vehicle as VehicleData)
                    : null;

                const currency =
                  pricelist.priceCurrency || pricelist.currency || "USD";

                return (
                  <div key={pricelist._id} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white bg-[#1d2087]">
                        {getStepIcon(index)}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <p className="text-lg font-semibold text-[#1d2087]">
                              {pricelist.plan}
                            </p>
                            {pricelist.duration && (
                              <p className="text-sm text-gray-600 mt-1">
                                Duration: {pricelist.duration}
                              </p>
                            )}
                          </div>
                          {/* This will show "Flexible" when fee is 0 */}
                          <p className="text-xl font-bold text-[#1d2087]">
                            {formatCurrency(pricelist.fee, currency)}
                          </p>
                        </div>

                        <p className="text-sm font-normal text-gray-600 whitespace-pre-line">
                          {pricelist.description}
                        </p>

                        {/* Vehicle Information Card - with ImageCard */}
                        {vehicleData && (
                          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <RiCarFill size={18} className="text-[#1d2087]" />
                              <p className="font-medium text-gray-800">
                                Vehicle Information
                              </p>
                            </div>

                            {vehicleData.images &&
                              vehicleData.images.length > 0 && (
                                <div className="mb-4">
                                  <ImageCard
                                    url={vehicleData.images}
                                    style="rounded-xl lg:h-[60vh] h-full w-full"
                                    tags={false}
                                  />
                                </div>
                              )}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {/* Vehicle Name */}
                              <div className="col-span-2 md:col-span-3">
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                  <RiCarFill
                                    size={14}
                                    className="text-[#1d2087]"
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">
                                      Vehicle
                                    </span>
                                    <span className="text-sm font-medium">
                                      {vehicleData.vehicleName}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {vehicleData.brand} {vehicleData.model} •{" "}
                                      {vehicleData.year}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Vehicle Type */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiCarFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Type
                                  </span>
                                  <span className="text-xs font-medium capitalize">
                                    {vehicleData.vehicleType}
                                  </span>
                                </div>
                              </div>

                              {/* Seating Capacity */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiUserFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Seats
                                  </span>
                                  <span className="text-xs font-medium">
                                    {vehicleData.seatingCapacity} seats
                                  </span>
                                </div>
                              </div>

                              {/* Transmission */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiCarFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Transmission
                                  </span>
                                  <span className="text-xs font-medium capitalize">
                                    {vehicleData.transmission}
                                  </span>
                                </div>
                              </div>

                              {/* Fuel Type */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiGasStationFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Fuel
                                  </span>
                                  <span className="text-xs font-medium capitalize">
                                    {vehicleData.fuelType}
                                  </span>
                                </div>
                              </div>

                              {/* Luggage Capacity */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiLuggageCartFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Luggage
                                  </span>
                                  <span className="text-xs font-medium">
                                    {vehicleData.luggageCapacity}
                                  </span>
                                </div>
                              </div>

                              {/* Availability */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                {vehicleData.isAvailable ? (
                                  <RiCheckboxCircleFill
                                    size={14}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <RiCloseCircleFill
                                    size={14}
                                    className="text-red-600"
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Available
                                  </span>
                                  <span className="text-xs font-medium">
                                    {vehicleData.isAvailable ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                                <RiCheckboxCircleFill
                                  size={14}
                                  className="text-[#1d2087]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">
                                    Status
                                  </span>
                                  <span className="text-xs font-medium capitalize">
                                    {vehicleData.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {pricelist.inclusions &&
                          pricelist.inclusions.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-semibold text-gray-800 mb-2">
                                Package Inclusions:
                              </p>
                              <ul className="space-y-2">
                                {pricelist.inclusions.map((inclusion, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <RiCheckboxCircleFill
                                      className="text-[#1d2087] mt-0.5 shrink-0"
                                      size={16}
                                    />
                                    <span className="text-sm text-gray-600">
                                      {inclusion}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>

                    {pricelist.filesAssociated.length > 0 && (
                      <div className="space-y-3 ml-14">
                        {isErrorFiles && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                            <p className="text-red-600 text-sm">
                              Failed to load some files
                            </p>
                            <button
                              onClick={() =>
                                pricelistFileQueries.forEach((q) => q.refetch())
                              }
                              className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
                            >
                              Retry loading files
                            </button>
                          </div>
                        )}

                        {pricelistFileQueries.some((q) => q.isLoading) ? (
                          <div className="space-y-2">
                            {pricelist.filesAssociated.map((fileId) => (
                              <div
                                key={fileId}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl animate-pulse"
                              >
                                <div className="h-8 w-8 bg-gray-300 rounded"></div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-8 bg-gray-300 rounded w-24"></div>
                              </div>
                            ))}
                          </div>
                        ) : pricelistFiles.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            No files available
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {pricelistFiles.map((file) => {
                              const fileQuery = fileQueries.find(
                                (q) => q.data?.file?._id === file._id,
                              );
                              const isFileError = fileQuery?.isError;
                              const fileUrl = getFileUrl(file.file);

                              return (
                                <div
                                  key={file._id}
                                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl ${
                                    isFileError
                                      ? "bg-red-50 border border-red-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                      {getFileIcon(file.file)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <p className="font-medium text-gray-800 text-base">
                                          {file.fileTitle}
                                        </p>
                                        {isFileError && (
                                          <span className="text-sm text-red-600">
                                            (Failed to load)
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                          {getFileType(file.file)}
                                        </span>
                                        <span className="text-sm text-gray-500 truncate max-w-xs">
                                          {file.file}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end sm:ml-auto">
                                    {!isFileError && fileUrl && (
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-[#1d2087] text-white rounded-full hover:bg-[#393ca3] transition-colors text-sm font-medium whitespace-nowrap"
                                      >
                                        Download
                                      </a>
                                    )}
                                    {isFileError && (
                                      <button
                                        onClick={() => fileQuery?.refetch()}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm font-medium"
                                      >
                                        Retry
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="w-full border-b border-black/6" />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransportPricelist;
