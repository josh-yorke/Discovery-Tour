import { useForm, useFieldArray } from "react-hook-form";
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
import FormattedLinkInput from "../input/FormattedLinkInput";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface DocumentFormHandle {
  getFormData: () => Promise<{
    documentData: addDocumentData[];
    documentFileData: addVisaFileData[];
  } | null>;
}

interface FormattedLink {
  title: string;
  link: string;
}

const hasDocumentContent = (document: {
  docTitle?: string;
  docDescription?: string;
  fileTitle?: string;
  file?: FileList;
  formattedLinks?: FormattedLink[];
}): boolean => {
  return (
    (document.docTitle?.trim() ?? "").length > 0 ||
    (document.docDescription?.trim() ?? "").length > 0 ||
    (document.fileTitle?.trim() ?? "").length > 0 ||
    (document.file?.length ?? 0) > 0 ||
    (document.formattedLinks?.length ?? 0) > 0
  );
};

const mergedSchema = addDocumentSchema
  .merge(
    addVisaFileSchema.omit({ file: true, fileTitle: true }).extend({
      file: addVisaFileSchema.shape.file.optional(),
      fileTitle: z.string().optional(),
      formattedLinksForDocument: z
        .array(
          z.object({
            title: z.string().min(1, "Title is required"),
            link: z
              .string()
              .url("Must be a valid URL")
              .min(1, "URL is required"),
          }),
        )
        .default([]),
    }),
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
    },
  );

type MergedSchemaType = z.infer<typeof mergedSchema>;
type FormData = { documents: MergedSchemaType[] };

const DEFAULT_DOCUMENT: MergedSchemaType = {
  docTitle: "",
  docDescription: "",
  fileTitle: "",
  file: undefined,
  formattedLinksForDocument: [],
};

const DocumentForm = forwardRef<DocumentFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { documents: [DEFAULT_DOCUMENT] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchDocuments = watch("documents");

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const documentData: addDocumentData[] = [];
    const documentFileData: addVisaFileData[] = [];
    let isValid = true;

    clearErrors();

    values.documents.forEach((document, index) => {
      const hasContent = hasDocumentContent(document);

      if (hasContent) {
        const result = mergedSchema.safeParse(document);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`documents.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
          documentData.push({
            docTitle: document.docTitle,
            docDescription: document.docDescription,
            formattedLinksForDocument:
              result.data.formattedLinksForDocument || [],
          });

          documentFileData.push({
            fileTitle: document.fileTitle || "",
            file: document.file,
          });
        }
      }
    });

    return { isValid, documentData, documentFileData };
  }, [getValues, setError, clearErrors]);

  const addDocument = useCallback(() => {
    append(DEFAULT_DOCUMENT);
  }, [append]);

  const removeDocument = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`documents.${index}` as any);
    },
    [remove, clearErrors],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) {
        setValue(`documents.${index}.file`, undefined);
        setValue(`documents.${index}.fileTitle`, "");
        clearErrors(`documents.${index}.fileTitle` as any);
        clearErrors(`documents.${index}.file` as any);
        return;
      }

      setValue(`documents.${index}.file`, files);

      const currentFileTitle = watchDocuments?.[index]?.fileTitle;
      if (!currentFileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`documents.${index}.fileTitle`, fileName);
      }

      clearErrors(`documents.${index}.fileTitle` as any);
      clearErrors(`documents.${index}.file` as any);
    },
    [setValue, watchDocuments, clearErrors],
  );

  const handleClearFile = useCallback(
    (index: number) => {
      setValue(`documents.${index}.file`, undefined);
      setValue(`documents.${index}.fileTitle`, "");
      clearErrors(`documents.${index}.fileTitle` as any);
      clearErrors(`documents.${index}.file` as any);
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, documentData, documentFileData } =
        validateAndGetFormData();

      if (!isValid || documentData.length === 0) {
        return null;
      }

      return { documentData, documentFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentDocument = watchDocuments?.[index];
    const hasNewFile = !!currentDocument?.file;
    const fileName = currentDocument?.file?.[0]?.name || "";
    const hasContent = hasDocumentContent(currentDocument);
    const fileTitleError = errors.documents?.[index]?.fileTitle?.message;
    const fileError = errors.documents?.[index]?.file?.message;

    return (
      <div className="space-y-4">
        <Input
          style="bg-white"
          disabled={false}
          error={hasContent && fileTitleError ? String(fileTitleError) : ""}
          title="Document File Title"
          placeholder="Enter document file title"
          type="text"
          {...register(`documents.${index}.fileTitle` as const)}
        />

        <FileInput
          title="Upload Document File"
          disabled={false}
          setValue={(fieldName, value) => {
            if (fieldName === "file") {
              handleFileSelect(value as FileList, index);
            }
          }}
          onChange={(files) => handleFileSelect(files, index)}
          error={hasContent && fileError ? String(fileError) : ""}
        />

        {hasNewFile && fileName && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">
              New file selected: {fileName}
            </p>
            <p className="text-xs text-green-600 mt-1">
              This will be uploaded as a new file.
            </p>
            <button
              type="button"
              onClick={() => handleClearFile(index)}
              className="text-xs text-green-700 hover:text-green-900 underline mt-2"
            >
              Clear selection
            </button>
          </div>
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
    const currentDocument = watchDocuments?.[index];
    const hasContent = hasDocumentContent(currentDocument);
    const docTitleError = errors.documents?.[index]?.docTitle?.message;
    const docDescriptionError =
      errors.documents?.[index]?.docDescription?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
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
            error={hasContent && docTitleError ? String(docTitleError) : ""}
            title="Document Title"
            placeholder="Enter document title (e.g., Visa Application Form, Requirements Checklist)"
            type="text"
            {...register(`documents.${index}.docTitle` as const)}
          />
          <TextArea
            disabled={false}
            error={
              hasContent && docDescriptionError
                ? String(docDescriptionError)
                : ""
            }
            title="Document Description"
            placeholder="Enter detailed document description and instructions"
            {...register(`documents.${index}.docDescription` as const)}
          />

          {renderFileSection(index)}

          <FormattedLinkInput
            control={control}
            register={register}
            errors={errors.documents?.[index]?.formattedLinksForDocument}
            faqIndex={index}
            fieldName="documents"
            fieldKey="formattedLinksForDocument"
          />
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

DocumentForm.displayName = "DocumentForm";
export default DocumentForm;
