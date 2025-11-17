import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useEffect } from "react";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import EditFileInput from "../input/EditFileInput";
import {
  addDocumentSchema,
  type addDocumentData,
  type editDocumentData,
} from "../../types/document/addDocumentType";
import Input from "../input/Input";

import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import ActionButton from "../button/ActionButton";

export interface documentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData;
    documentFileData: addVisaFileData;
  } | null>;
}

interface DocumentFormProps {
  editData?: editDocumentData;
  fileData?: visaFileData;
  onDeleteFile?: () => void;
  isDeleting?: boolean;
}

const EditDocumentForm = forwardRef<documentFormHandle, DocumentFormProps>(
  ({ editData, fileData, onDeleteFile, isDeleting }, ref) => {
    useEffect(() => {
      console.log("EditDocumentForm - editData received:", editData);
      console.log("Document Title:", editData?.title);
    }, [editData]);

    // Document file upload form
    const fileMethods = useForm<addVisaFileData>({
      resolver: zodResolver(addVisaFileSchema),
      defaultValues: {
        fileTitle: editData?.fileTitle ?? fileData?.fileTitle ?? "",
        file: undefined,
      },
      mode: "onChange",
    });

    const {
      register: registerFile,
      setValue: setFileValue,
      formState: { errors: fileErrors },
      trigger: triggerFile,
      getValues: getFileValues,
      reset: resetFile,
      watch: watchFile,
    } = fileMethods;

    // Document form
    const documentMethods = useForm<addDocumentData>({
      resolver: zodResolver(addDocumentSchema),
      defaultValues: {
        docTitle: editData?.title || "",
        docDescription: editData?.description || "",
      },
      mode: "onChange",
    });

    const {
      register: registerDocument,
      formState: { errors: documentErrors },
      trigger: triggerDocument,
      getValues: getDocumentValues,
      reset: resetDocument,
    } = documentMethods;

    const currentFile = watchFile("file");

    // Pre-fill form when editData or fileData changes
    useEffect(() => {
      if (editData || fileData) {
        resetDocument({
          docTitle: editData?.title || "",
          docDescription: editData?.description || "",
        });

        resetFile({
          fileTitle: editData?.fileTitle || fileData?.fileTitle || "",
          file: undefined,
        });
      }
    }, [editData, fileData, resetDocument, resetFile]);

    // Handle new file selection
    const handleNewFileSelect = (files: FileList | null): void => {
      if (files && files.length > 0) {
        setFileValue("file", files);
      }
    };

    // Handle delete file (permanent deletion only)
    const handleDeleteFile = (): void => {
      if (onDeleteFile) {
        onDeleteFile();
      }
    };

    // Clear file input when user wants to remove new file selection
    const handleClearFileInput = (): void => {
      setFileValue("file", undefined);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    };

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      getFormData: async (): Promise<{
        documentData: addDocumentData;
        documentFileData: addVisaFileData;
      } | null> => {
        const isDocumentValid = await triggerDocument();

        // For editing, file validation is different
        const hasExistingFile = fileData?._id;
        const hasNewFile = currentFile && currentFile.length > 0;

        let isFileValid = true;

        if (hasExistingFile) {
          // If we have an existing file, only validate fileTitle
          isFileValid = await triggerFile(["fileTitle"]);
        } else if (hasNewFile) {
          // If we have a new file, validate both file and fileTitle
          isFileValid = await triggerFile(["fileTitle", "file"]);
        } else {
          // If no existing file and no new file, file is optional in edit mode
          // Only validate if there's actually data entered
          const fileValues = getFileValues();
          if (fileValues.fileTitle || fileValues.file) {
            isFileValid = await triggerFile(["fileTitle", "file"]);
          } else {
            // No file data at all, so it's valid (optional in edit mode)
            isFileValid = true;
          }
        }

        if (!isDocumentValid || !isFileValid) {
          return null;
        }

        const documentData = getDocumentValues();
        const documentFileData = getFileValues();

        return {
          documentData,
          documentFileData,
        };
      },
    }));

    // Only show existing file if we have fileData AND it has an _id (meaning it exists in the database)
    const showExistingFile = fileData?._id && !currentFile?.length;

    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={documentErrors.docTitle?.message || ""}
            title="Document Title"
            placeholder="Enter document title"
            type="text"
            {...registerDocument("docTitle")}
          />
          <Input
            disabled={false}
            error={documentErrors.docDescription?.message || ""}
            title="Document Description"
            placeholder="Enter document description"
            type="text"
            {...registerDocument("docDescription")}
          />
          <Input
            disabled={false}
            error={fileErrors.fileTitle?.message || ""}
            title="Document File Title"
            placeholder="Enter document file title"
            type="text"
            {...registerFile("fileTitle")}
          />

          <div className="space-y-2">
            <EditFileInput
              title="Update Document File (Optional)"
              disabled={false}
              setValue={setFileValue}
              onChange={handleNewFileSelect}
              error={
                typeof fileErrors.file?.message === "string"
                  ? fileErrors.file.message
                  : ""
              }
            />

            {/* Show existing file with delete button - ONLY if there's actually an existing file */}
            {showExistingFile && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      Current File:
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {fileData.fileTitle}
                    </p>
                  </div>

                  {/* Delete button (permanent deletion only) */}
                  {onDeleteFile && (
                    <ActionButton
                      style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 max-w-[120px]"
                      action={handleDeleteFile}
                      isLoading={isDeleting}
                      title="Delete"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Show new file selection */}
            {currentFile?.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700 font-medium">
                  New file selected: {(currentFile[0] as File).name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  This will replace the existing document file.
                </p>
                <button
                  type="button"
                  onClick={handleClearFileInput}
                  className="text-xs text-green-700 hover:text-green-900 underline mt-2"
                >
                  Clear selection
                </button>
              </div>
            )}

            {/* Help text for file requirements */}
            <div className="text-xs text-gray-500">
              <p>• File is optional when editing existing document</p>
              <p>
                • If you upload a new file, it will replace the existing one
              </p>
              <p>• File title is required if you upload a file</p>
              {fileData?._id && (
                <p>• To remove a file permanently, use the delete button</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EditDocumentForm.displayName = "EditDocumentForm";

export default EditDocumentForm;
