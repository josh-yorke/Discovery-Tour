import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
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
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

// UPDATED: Add removeDocumentField method
export interface DocumentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData[];
    documentFileData: addVisaFileData[];
  } | null>;
  removeDocumentField: (index: number) => void;
}

// UPDATED: Interface with new props for multiple documents
interface DocumentFormProps {
  editData?: editDocumentData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteDocument?: (documentId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingDocument?: boolean;
}

// Types - Fix: Make fileTitle required only when file is present
const documentWithFileSchema = addDocumentSchema
  .merge(
    addVisaFileSchema.omit({ file: true, fileTitle: true }).extend({
      file: addVisaFileSchema.shape.file.optional(),
      fileTitle: z.string().optional(),
    })
  )
  .refine(
    (data) => {
      // File title is only required if a file is uploaded
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

type DocumentWithFileData = addDocumentData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  documents: z.array(documentWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_DOCUMENT: DocumentWithFileData = {
  docTitle: "",
  docDescription: "",
  fileTitle: "",
  file: undefined,
};

// Helper functions
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

// FIX: Create a type that includes _id for existing documents
interface DocumentWithId extends editDocumentData {
  _id: string;
}

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

    // FIXED: Remove document function with proper type handling
    const removeDocument = useCallback(
      (index: number) => {
        if (fields.length > 1) {
          const documentItem = editData[index];
          // Use type assertion to safely access _id
          const documentWithId = documentItem as DocumentWithId;

          // If it's an existing document (has _id), use API deletion
          if (documentWithId?._id && onDeleteDocument) {
            onDeleteDocument(documentWithId._id, index);
          } else {
            // If it's a new document (no _id), just remove from local state
            remove(index);
          }
        }
      },
      [fields.length, remove, editData, onDeleteDocument]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`documents.${index}.file`, files);

        // Auto-fill file title if empty
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
        // Optionally clear file title when clearing file
        // setValue(`documents.${index}.fileTitle`, "");
      },
      [setValue]
    );

    // UPDATED: Expose form data and remove method to parent
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const documentData: addDocumentData[] = [];
        const documentFileData: addVisaFileData[] = [];

        console.log(
          "🔍 EditDocumentForm - formData.documents:",
          formData.documents
        );
        console.log(
          "🔍 EditDocumentForm - isArray:",
          Array.isArray(formData.documents)
        );

        // FIX: Ensure we're always working with an array
        const documentsArray = Array.isArray(formData.documents)
          ? formData.documents
          : [formData.documents];

        documentsArray.forEach((document, index) => {
          console.log(`🔍 Processing document ${index}:`, document);

          documentData.push({
            docTitle: document.docTitle,
            docDescription: document.docDescription,
          });

          documentFileData.push({
            fileTitle: document.fileTitle || "", // Provide empty string if undefined
            file: document.file,
          });
        });

        console.log("🔍 EditDocumentForm - final documentData:", documentData);
        console.log(
          "🔍 EditDocumentForm - final documentFileData:",
          documentFileData
        );

        return { documentData, documentFileData };
      },
      removeDocumentField: (index: number) => {
        if (fields.length > 1) {
          remove(index);
        }
      },
    }));

    // Render helpers
    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchDocuments?.[index]?.file;
      const hasNewFile = !!watchDocuments?.[index]?.file;

      return (
        <div className="space-y-4">
          <Input
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

          {hasExistingFile && (
            <ExistingFileDisplay
              fileData={fileData[index]}
              onDelete={() => onDeleteFile?.(index, fileData[index]._id!)}
              isDeleting={isDeleting}
            />
          )}

          {hasNewFile && (
            <NewFileDisplay
              fileName={watchDocuments[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>• File is optional when editing existing document</p>
            <p>• If you upload a new file, it will replace the existing one</p>
            <p>• File title is required if you upload a file</p>
            {fileData[index]?.file && (
              <p>• To remove a file permanently, use the delete button</p>
            )}
          </div>
        </div>
      );
    };

    // FIXED: Render function with proper type handling
    const renderDocumentForm = (field: { id: string }, index: number) => {
      // const documentItem = editData[index];
      // Use type assertion to safely access _id
      // const documentWithId = documentItem as DocumentWithId;
      // const isExistingDocument = !!documentWithId?._id;
      // const isThisDocumentDeleting = isExistingDocument && isDeletingDocument;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length > 1 && (
            <IconButton
              action={() => removeDocument(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              // isLoading={isThisDocumentDeleting}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              disabled={false}
              error={errors.documents?.[index]?.docTitle?.message || ""}
              title="Document Title"
              placeholder="Enter document title"
              type="text"
              {...register(`documents.${index}.docTitle`)}
            />
            <TextArea
              disabled={false}
              error={errors.documents?.[index]?.docDescription?.message || ""}
              title="Document Description"
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
        <div className="w-full flex justify-center">
          <IconButton
            action={addDocument}
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
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
  // isDeleting,
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
