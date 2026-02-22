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
  RiLayoutRight2Fill,
  RiArrowUpSLine,
} from "react-icons/ri";
import { useState } from "react";
import api from "../../../../hooks/axios/axios";
import SectionLoader from "../../../loader/SectionLoader";
import SectionError from "../../../error/SectionError";
import { getVisaFile } from "../../../../hooks/visa/file/getVisaFile";
import { getInsuranceTerm } from "../../../../hooks/visa/terms/getTerm";

interface FileData {
  _id: string;
  fileTitle: string;
  file: string;
  __v: number;
}

interface TermData {
  _id: string;
  title: string;
  terms: string;
  filesAssociated: string[];
  insuranceId: string;
  __v: number;
}

interface InsuranceTermsProps {
  insuranceId: string;
}

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

const InsuranceTerm = ({ insuranceId }: InsuranceTermsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const {
    data: terms,
    isLoading: isLoadingTerms,
    isError: isErrorTerms,
    error: termsError,
    refetch: refetchTerms,
  } = useQuery<TermData[], Error>({
    queryKey: ["insurance-terms", insuranceId],
    queryFn: () => getInsuranceTerm(insuranceId),
    enabled: !!insuranceId,
  });

  const termsList = terms || [];
  const allFileIds = termsList.flatMap((term) => term.filesAssociated);

  const fileQueries = useQueries({
    queries: allFileIds.map((fileId) => ({
      queryKey: ["insurance-term-file", fileId, insuranceId],
      queryFn: () => getVisaFile(fileId),
      enabled: !!fileId && !!insuranceId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const filesMap = fileQueries.reduce(
    (acc: Record<string, FileData>, query) => {
      if (query.data?.file) {
        acc[query.data.file._id] = query.data.file;
      }
      return acc;
    },
    {},
  );

  const isLoadingFiles = fileQueries.some((q) => q.isLoading && !q.isError);
  const isErrorFiles = fileQueries.some((q) => q.isError);
  const isLoading = isLoadingTerms || isLoadingFiles;

  if (!insuranceId) return null;

  if (isLoading) return <SectionLoader />;

  if (isErrorTerms)
    return <SectionError error={termsError?.message} action={refetchTerms} />;

  if (termsList.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiLayoutRight2Fill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Terms and Conditions
              </p>
              <p className="text-xs font-normal text-gray-600">
                Important terms and conditions for insurance policy
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

            <div className="w-full space-y-4 sm:space-y-6">
              {termsList.map((term, index) => {
                const termFiles = term.filesAssociated
                  .map((fileId) => filesMap[fileId])
                  .filter((file): file is FileData => file !== undefined);

                const termFileQueries = fileQueries.filter((q) =>
                  term.filesAssociated.includes(q.data?.file?._id || ""),
                );

                return (
                  <div key={term._id} className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-white bg-[#1d2087]">
                        {getStepIcon(index)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                          <p className="text-base font-semibold text-[#1d2087]">
                            {term.title}
                          </p>
                          {term.filesAssociated.length > 0 && (
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {term.filesAssociated.length} file
                              {term.filesAssociated.length !== 1
                                ? "s"
                                : ""}{" "}
                              attached
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-normal text-gray-600 mt-2 whitespace-pre-line">
                          {term.terms}
                        </p>
                      </div>
                    </div>

                    {term.filesAssociated.length > 0 && (
                      <div className="space-y-3 sm:space-y-4 ml-11 sm:ml-14">
                        {isErrorFiles && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                            <p className="text-red-600 text-xs sm:text-sm">
                              Failed to load some files
                            </p>
                            <button
                              onClick={() =>
                                termFileQueries.forEach((q) => q.refetch())
                              }
                              className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700 hover:text-red-900 font-medium"
                            >
                              Retry loading files
                            </button>
                          </div>
                        )}

                        {termFileQueries.some((q) => q.isLoading) ? (
                          <div className="space-y-2">
                            {term.filesAssociated.map((fileId) => (
                              <div
                                key={fileId}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-2xl animate-pulse"
                              >
                                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-300 rounded"></div>
                                <div className="flex-1">
                                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/3 mb-1 sm:mb-2"></div>
                                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-6 sm:h-8 bg-gray-300 rounded w-16 sm:w-24"></div>
                              </div>
                            ))}
                          </div>
                        ) : termFiles.length === 0 ? (
                          <p className="text-gray-500 text-xs sm:text-sm">
                            No files available
                          </p>
                        ) : (
                          <div className="space-y-2 sm:space-y-3">
                            {termFiles.map((file) => {
                              const fileQuery = fileQueries.find(
                                (q) => q.data?.file?._id === file._id,
                              );
                              const isFileError = fileQuery?.isError;
                              const fileUrl = getFileUrl(file.file);

                              return (
                                <div
                                  key={file._id}
                                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 sm:p-3 rounded-2xl ${
                                    isFileError
                                      ? "bg-red-50 border border-red-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="text-xl sm:text-2xl">
                                      {getFileIcon(file.file)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                                          {file.fileTitle}
                                        </p>
                                        {isFileError && (
                                          <span className="text-xs text-red-600">
                                            (Failed to load)
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                        <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full">
                                          {getFileType(file.file)}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate max-w-37.5 sm:max-w-xs">
                                          {file.file}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end sm:ml-auto mt-1 sm:mt-0">
                                    {!isFileError && fileUrl && (
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1d2087] text-white rounded-full hover:bg-[#393ca3] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                                      >
                                        Download
                                      </a>
                                    )}
                                    {isFileError && (
                                      <button
                                        onClick={() => fileQuery?.refetch()}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium"
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

export default InsuranceTerm;
