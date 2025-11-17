import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef } from "react";
import {
  addProcessSchema,
  type addProcessData,
} from "../../types/process/addProcessTypes";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import FileInput from "../input/FileInput";

export interface ProcessFormHandle {
  getFormData: () => Promise<{
    processData: addProcessData;
    processFileData: addVisaFileData;
  } | null>;
}

const ProcessForm = forwardRef<ProcessFormHandle>((_props, ref) => {
  // Process file upload form
  const fileMethods = useForm<addVisaFileData>({
    resolver: zodResolver(addVisaFileSchema),
    defaultValues: {
      fileTitle: "", // Set default as empty string for optional field
    },
  });

  const {
    register: registerFile,
    setValue: setFileValue,
    formState: { errors: fileErrors },
    trigger: triggerFile,
    getValues: getFileValues,
    watch: watchFile,
  } = fileMethods;

  // Process form
  const processMethods = useForm<addProcessData>({
    resolver: zodResolver(addProcessSchema),
  });

  const {
    register: registerProcess,
    formState: { errors: processErrors },
    trigger: triggerProcess,
    getValues: getProcessValues,
  } = processMethods;

  const currentFile = watchFile("file");

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async (): Promise<{
      processData: addProcessData;
      processFileData: addVisaFileData;
    } | null> => {
      const isProcessValid = await triggerProcess();

      // For file validation: only require fileTitle if a file is actually selected
      const hasFile = currentFile && currentFile.length > 0;
      let isFileValid = true;

      if (hasFile) {
        // If file is selected, validate both file and fileTitle
        isFileValid = await triggerFile(["fileTitle", "file"]);
      } else {
        // If no file selected, only validate file (fileTitle is optional)
        isFileValid = await triggerFile(["file"]);
      }

      if (!isProcessValid || !isFileValid) {
        return null;
      }

      const processData = getProcessValues();
      const processFileData = getFileValues();

      return { processData, processFileData };
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={processErrors.processTitle?.message || ""}
            title="Title"
            placeholder="process title"
            type="text"
            {...registerProcess("processTitle")}
          />
          <TextArea
            disabled={false}
            error={processErrors.process?.message || ""}
            title="Process"
            placeholder="process"
            {...registerProcess("process")}
          />

          <Input
            disabled={false}
            error={fileErrors.fileTitle?.message || ""}
            title="Process File Title"
            placeholder="process file title (optional)"
            type="text"
            {...registerFile("fileTitle")}
          />
          <FileInput
            title="Upload Process File"
            disabled={false}
            setValue={setFileValue}
            error={
              typeof fileErrors.file?.message === "string"
                ? fileErrors.file.message
                : ""
            }
          />

          {/* Help text explaining file title is optional */}
          <div className="text-xs text-gray-500">
            <p>
              • File title is optional - if left empty, the filename will be
              used
            </p>
            <p>• File is required if you enter a file title</p>
          </div>
        </div>
      </div>
    </>
  );
});

ProcessForm.displayName = "ProcessForm";

export default ProcessForm;
