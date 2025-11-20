import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
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
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface DocumentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData[];
    documentFileData: addVisaFileData[];
  } | null>;
}

const documentWithFileSchema = addDocumentSchema
  .merge(
    addVisaFileSchema.omit({ file: true, fileTitle: true }).extend({
      file: addVisaFileSchema.shape.file.optional(),
      fileTitle: z.string().optional(),
    })
  )
  .refine(
    (data) => {
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

const DEFAULT_DOCUMENT: DocumentWithFileData = {
  docTitle: "",
  docDescription: "",
  fileTitle: "",
  file: undefined,
};

const DocumentForm = forwardRef<DocumentFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [DEFAULT_DOCUMENT],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchDocuments = watch("documents");

  const addDocument = useCallback(() => {
    append(DEFAULT_DOCUMENT);
  }, [append]);

  // UPDATED: Allow deletion even when there's only one document, no auto-add
  const removeDocument = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
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
      setValue(`documents.${index}.fileTitle`, ""); // Clear file title when clearing file
    },
    [setValue]
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const documentData: addDocumentData[] = [];
      const documentFileData: addVisaFileData[] = [];

      const documentsArray = Array.isArray(formData.documents)
        ? formData.documents
        : [formData.documents];

      documentsArray.forEach((document) => {
        documentData.push({
          docTitle: document.docTitle,
          docDescription: document.docDescription,
        });

        documentFileData.push({
          fileTitle: document.fileTitle || "",
          file: document.file,
        });
      });

      return { documentData, documentFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentDocument = watchDocuments?.[index];
    const hasNewFile = !!currentDocument?.file;
    const fileName = currentDocument?.file?.[0]?.name || "";

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

        <FileInput
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

        {hasNewFile && fileName && (
          <NewFileDisplay
            fileName={fileName}
            onClear={() => handleClearFile(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>• File is optional for each document</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
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
        {/* UPDATED: Always show delete button when there's at least one document */}
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
            disabled={false}
            error={errors.documents?.[index]?.docTitle?.message || ""}
            title="Document Title"
            placeholder="Enter document title (e.g., Visa Application Form, Requirements Checklist)"
            type="text"
            {...register(`documents.${index}.docTitle`)}
          />
          <TextArea
            disabled={false}
            error={errors.documents?.[index]?.docDescription?.message || ""}
            title="Document Description"
            placeholder="Enter detailed document description and instructions"
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
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Document"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderDocumentForm)}</div>
    </div>
  );
});

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

DocumentForm.displayName = "DocumentForm";

export default DocumentForm;
