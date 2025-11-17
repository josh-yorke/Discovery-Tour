import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef } from "react";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import FileInput from "../input/FileInput";
import {
  addDocumentSchema,
  type addDocumentData,
} from "../../types/document/addDocumentType";

export interface documentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData;
    documentFileData: addVisaFileData;
  } | null>;
}

const DocumentForm = forwardRef<documentFormHandle>((_props, ref) => {
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
  const documentMethods = useForm<addDocumentData>({
    resolver: zodResolver(addDocumentSchema),
  });

  const {
    register: registerDocument,
    formState: { errors: documentErrors },
    trigger: triggerDocument,
    getValues: getDocumentValues,
  } = documentMethods;

  const currentFile = watchFile("file");

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async (): Promise<{
      documentData: addDocumentData;
      documentFileData: addVisaFileData;
    } | null> => {
      const isDocumentValid = await triggerDocument();

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

      if (!isDocumentValid || !isFileValid) {
        return null;
      }

      const documentData = getDocumentValues();
      const documentFileData = getFileValues();

      return { documentData, documentFileData };
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={documentErrors.docTitle?.message || ""}
            title="Title"
            placeholder="document title"
            type="text"
            {...registerDocument("docTitle")}
          />
          <Input
            disabled={false}
            error={documentErrors.docDescription?.message || ""}
            title="Document Description"
            placeholder="document description"
            type="text"
            {...registerDocument("docDescription")}
          />

          <Input
            disabled={false}
            error={fileErrors.fileTitle?.message || ""}
            title="Document File Title"
            placeholder="document file title (optional)"
            type="text"
            {...registerFile("fileTitle")}
          />
          <FileInput
            title="Upload Document File"
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

DocumentForm.displayName = "DocumentForm";

export default DocumentForm;
