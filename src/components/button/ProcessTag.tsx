import { useQuery } from "@tanstack/react-query";
import { getVisaProcesses } from "../../hooks/visa/visa/getVisa";

interface VisaProcessDisplayProps {
  visaId: string;
}

const ProcessTag = ({ visaId }: VisaProcessDisplayProps) => {
  const {
    data: process,
    isLoading: isProcessLoading,
    isError: isProcessError,
  } = useQuery({
    queryKey: ["process", visaId],
    queryFn: () => getVisaProcesses(visaId),
  });

  if (isProcessLoading) {
    return null;
  }

  if (isProcessError || !process || process.processes.length === 0) {
    return (
      <div className="">
        <p className="text-xs text-gray-500">No process available</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 rounded-2xl bg-[#f0f0f0] shadow-[inset_0_4px_4px_rgba(0,0,0,0.2)] shadow-black/6 cursor-default">
      <p className="text-xs font-semibold">
        {process.processes.length} step{process.processes.length > 1 ? "s" : ""}{" "}
        process
      </p>
    </div>
  );
};

export default ProcessTag;
