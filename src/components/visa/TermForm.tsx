import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef } from "react";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import FileInput from "../input/FileInput";
import { addTermSchema, type addTermData } from "../../types/terms/addTermType";
import TextArea from "../input/TextArea";

export interface termFormHandle {
  getFormData: () => Promise<{
    termData: addTermData;
    termFileData: addVisaFileData;
  } | null>;
}

const TermForm = forwardRef<termFormHandle>((_props, ref) => {
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
  const termMethods = useForm<addTermData>({
    resolver: zodResolver(addTermSchema),
  });

  const {
    register: registerTerm,
    formState: { errors: termErrors },
    trigger: triggerTerm,
    getValues: getTermValues,
  } = termMethods;

  const currentFile = watchFile("file");

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async (): Promise<{
      termData: addTermData;
      termFileData: addVisaFileData;
    } | null> => {
      const isTermValid = await triggerTerm();

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

      if (!isTermValid || !isFileValid) {
        return null;
      }

      const termData = getTermValues();
      const termFileData = getFileValues();

      return { termData, termFileData };
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={termErrors.title?.message || ""}
            title="Title"
            placeholder="terms title"
            type="text"
            {...registerTerm("title")}
          />
          <TextArea
            disabled={false}
            error={termErrors.terms?.message || ""}
            title="terms"
            placeholder="terms"
            {...registerTerm("terms")}
          />
        </div>
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={fileErrors.fileTitle?.message || ""}
            title="Term File Title"
            placeholder="term file title (optional)"
            type="text"
            {...registerFile("fileTitle")}
          />
          <FileInput
            title="Upload Term File"
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

TermForm.displayName = "TermForm";

export default TermForm;
