import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import EditFileInput from "../input/EditFileInput";
import {
  type addDocumentData,
  type editDocumentData,
} from "../../types/document/addDocumentType";
import Input from "../input/Input";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

export interface DocumentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData[];
    documentFileData: addVisaFileData[];
  } | null>;
  removeDocumentField: (index: number) => void;
}

interface DocumentFormProps {
  editData?: editDocumentData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteDocument?: (documentId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingDocument?: boolean;
}

// FIXED: STRICTER validation - require document title and description
const documentWithFileSchema = z
  .object({
    docTitle: z.string().min(1, "Document title is required"),
    docDescription: z.string().min(1, "Document description is required"),
    fileTitle: z.string().optional(),
    file: z.any().optional(),
  })
  .refine(
    (data) => {
      // Only require file title if file is actually provided
      if (data.file && data.file.length > 0) {
        return !!data.fileTitle?.trim();
      }
      return true;
    },
    {
      message: "File title is required when a file is uploaded",
      path: ["fileTitle"],
    }
  );

type DocumentWithFileData = {
  docTitle: string;
  docDescription: string;
  fileTitle?: string;
  file?: FileList;
};

// FIXED: ULTRA STRICT form schema
const formSchema = z.object({
  documents: z
    .array(documentWithFileSchema)
    .min(1, "At least one document is required")
    .refine(
      (documents) => {
        // Check that every document has the required fields
        return documents.every(
          (document) =>
            document.docTitle.trim() !== "" &&
            document.docDescription.trim() !== ""
        );
      },
      {
        message:
          "All documents must have Document Title and Document Description filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_DOCUMENT: DocumentWithFileData = {
  docTitle: "",
  docDescription: "",
  fileTitle: "",
  file: undefined,
};

// FIXED: Type for edit data with _id
interface EditDocumentWithId extends editDocumentData {
  _id?: string;
}

const mapEditDataToDefaultValues = (
  editData: editDocumentData[],
  fileData: visaFileData[]
): DocumentWithFileData[] => {
  if (editData.length === 0) return [DEFAULT_DOCUMENT];

  return editData.map((data, index) => ({
    docTitle: data?.title || "",
    docDescription: data?.description || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

const EditDocumentForm = forwardRef<DocumentFormHandle, DocumentFormProps>(
  (
    {
      editData = [],
      fileData = [],
      onDeleteFile,
      onDeleteDocument,
      isDeleting,
      // isDeletingDocument,
    },
    ref
  ) => {
    useEffect(() => {
      console.log("EditDocumentForm - editData received:", editData);
      console.log(
        "Document Titles:",
        editData?.map((doc) => doc?.title)
      );
    }, [editData]);

    const {
      register,
      control,
      formState: { errors },
      setValue,
      watch,
      trigger,
      getValues,
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        documents: mapEditDataToDefaultValues(editData, fileData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "documents",
    });

    const watchDocuments = watch("documents");

    // Pre-fill form when editData or fileData changes
    useEffect(() => {
      if (editData.length > 0 || fileData.length > 0) {
        reset({
          documents: mapEditDataToDefaultValues(editData, fileData),
        });
      }
    }, [editData, fileData, reset]);

    // Handlers
    const addDocument = useCallback(() => {
      append(DEFAULT_DOCUMENT);
    }, [append]);

    const removeDocument = useCallback(
      (index: number) => {
        // FIXED: Use type assertion to safely access _id
        const documentItem = editData[index] as EditDocumentWithId | undefined;

        // If it's an existing document (has _id), use API deletion
        if (documentItem?._id && onDeleteDocument) {
          onDeleteDocument(documentItem._id, index);
        } else {
          // If it's a new document (no _id), just remove from local state
          remove(index);
        }
      },
      [remove, editData, onDeleteDocument]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`documents.${index}.file`, files);

        const currentFileTitle = watchDocuments?.[index]?.fileTitle;
        if (!currentFileTitle) {
          const fileName = files[0].name.split(".").slice(0, -1).join(".");
          setValue(`documents.${index}.fileTitle`, fileName);
        }
      },
      [setValue, watchDocuments]
    );

    const handleClearFile = useCallback(
      (index: number) => {
        setValue(`documents.${index}.file`, undefined);
      },
      [setValue]
    );

    // FIXED: ULTRA STRICT getFormData
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        console.log("🔄 Validating document form...");

        // First validate with Zod
        const isValid = await trigger();
        if (!isValid) {
          console.log("❌ Zod validation failed");
          return null;
        }

        const formData = getValues();
        const documentData: addDocumentData[] = [];
        const documentFileData: addVisaFileData[] = [];

        const documentsArray = Array.isArray(formData.documents)
          ? formData.documents
          : [formData.documents];

        console.log("📋 Raw documents data:", documentsArray);

        // FIXED: MANUAL VALIDATION - Check every document has required data
        for (let i = 0; i < documentsArray.length; i++) {
          const document = documentsArray[i];

          const hasDocTitle =
            document.docTitle && document.docTitle.trim() !== "";
          const hasDocDescription =
            document.docDescription && document.docDescription.trim() !== "";
          const hasFile = document.file && document.file.length > 0;

          console.log(`📝 Document ${i}:`, {
            hasDocTitle,
            hasDocDescription,
            hasFile,
            docTitle: document.docTitle,
            docDescription: document.docDescription,
          });

          // FIXED: BLOCK submission if document data is missing but file is present
          if ((!hasDocTitle || !hasDocDescription) && hasFile) {
            console.log(
              "🚫 BLOCKED: File provided without complete document data"
            );
            alert(
              `❌ Document #${
                i + 1
              }: Please fill out Document Title and Document Description before uploading a file.`
            );
            return null;
          }

          // FIXED: Only include if ALL required fields are filled
          if (hasDocTitle && hasDocDescription) {
            documentData.push({
              docTitle: document.docTitle,
              docDescription: document.docDescription,
            });

            documentFileData.push({
              fileTitle: document.fileTitle || "",
              file: document.file,
            });
          } else {
            console.log(`⚠️ Skipping document ${i} - missing required fields`);
          }
        }

        // FIXED: Final check - must have at least one valid document
        if (documentData.length === 0) {
          console.log("❌ No valid documents found");
          alert(
            "❌ Please fill out all required fields (Document Title and Document Description) for at least one document."
          );
          return null;
        }

        console.log("✅ Valid documents:", documentData.length);
        return { documentData, documentFileData };
      },
      removeDocumentField: (index: number) => {
        remove(index);
      },
    }));

    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchDocuments?.[index]?.file;
      const hasNewFile = !!watchDocuments?.[index]?.file;
      const currentFileData = fileData[index];

      return (
        <div className="space-y-4">
          <Input
            style="bg-white"
            disabled={false}
            error={errors.documents?.[index]?.fileTitle?.message || ""}
            title="Document File Title"
            placeholder="Enter document file title"
            type="text"
            {...register(`documents.${index}.fileTitle`)}
          />

          <EditFileInput
            title="Upload Document File"
            disabled={false}
            setValue={(fieldName, value) => {
              if (fieldName === "file") {
                setValue(`documents.${index}.file`, value as FileList);
              }
            }}
            onChange={(files) => handleFileSelect(files, index)}
            error={
              typeof errors.documents?.[index]?.file?.message === "string"
                ? errors.documents[index]?.file?.message
                : ""
            }
          />

          {hasExistingFile && currentFileData && (
            <ExistingFileDisplay
              fileData={currentFileData}
              onDelete={() => onDeleteFile?.(index, currentFileData._id!)}
              isDeleting={isDeleting}
            />
          )}

          {hasNewFile && watchDocuments[index]?.file && (
            <NewFileDisplay
              fileName={watchDocuments[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>
              •{" "}
              <strong>
                File upload is only allowed after filling all document fields
              </strong>
            </p>
            <p>• File title is required if you upload a file</p>
            <p>• If you upload a new file, it will replace the existing one</p>
          </div>
        </div>
      );
    };

    const renderDocumentForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Delete button */}
          {fields.length >= 1 && (
            <IconButton
              action={() => removeDocument(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.documents?.[index]?.docTitle?.message || ""}
              title="Document Title *"
              placeholder="Enter document title"
              type="text"
              {...register(`documents.${index}.docTitle`)}
            />
            <TextArea
              disabled={false}
              error={errors.documents?.[index]?.docDescription?.message || ""}
              title="Document Description *"
              placeholder="Enter document description"
              {...register(`documents.${index}.docDescription`)}
            />

            {renderFileSection(index)}
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        {/* Form-level errors */}
        {errors.documents?.message && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              {errors.documents.message}
            </p>
          </div>
        )}

        <div className="w-full flex justify-center">
          <IconButton
            action={addDocument}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Document"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderDocumentForm)}
      </div>
    );
  }
);

// Sub-components for better organization
interface ExistingFileDisplayProps {
  fileData: visaFileData;
  onDelete: () => void;
  isDeleting?: boolean;
}

const ExistingFileDisplay: React.FC<ExistingFileDisplayProps> = ({
  fileData,
  onDelete,
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex flex-row items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900">Current File:</p>
        <p className="text-sm text-red-700 mt-1">{fileData.fileTitle}</p>
      </div>

      <IconButton
        action={onDelete}
        style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
        title=""
        icon={<RiDeleteBin4Fill size={16} />}
      />
    </div>
  </div>
);

interface NewFileDisplayProps {
  fileName: string;
  onClear: () => void;
}

const NewFileDisplay: React.FC<NewFileDisplayProps> = ({
  fileName,
  onClear,
}) => (
  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
    <p className="text-sm text-green-700 font-medium">
      New file selected: {fileName}
    </p>
    <p className="text-xs text-green-600 mt-1">
      This will be uploaded as a new file.
    </p>
    <button
      type="button"
      onClick={onClear}
      className="text-xs text-green-700 hover:text-green-900 underline mt-2"
    >
      Clear selection
    </button>
  </div>
);

EditDocumentForm.displayName = "EditDocumentForm";

export default EditDocumentForm;
