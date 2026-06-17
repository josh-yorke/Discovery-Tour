import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import {
  type addDocumentData,
  type editDocumentData,
} from "../../types/document/addDocumentType";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import EditFileInput from "../input/EditFileInput";
import IconButton from "../button/IconButton";
import FormattedLinkInput from "../input/FormattedLinkInput";

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

const hasCompleteDocument = (document: {
  docTitle?: string;
  docDescription?: string;
}): boolean => {
  return (
    (document.docTitle?.trim() ?? "").length > 0 &&
    (document.docDescription?.trim() ?? "").length > 0
  );
};

const mergedSchema = z
  .object({
    docTitle: z.string().min(1, "Document title is required"),
    docDescription: z.string().min(1, "Document description is required"),
    fileTitle: z.string().optional(),
    file: z.any().optional(),
    formattedLinksForDocument: z
      .array(
        z.object({
          title: z.string().min(1, "Title is required"),
          link: z.string().url("Must be a valid URL").min(1, "URL is required"),
        }),
      )
      .default([]),
  })
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

type MergedSchemaType = {
  docTitle: string;
  docDescription: string;
  fileTitle?: string;
  file?: FileList;
  formattedLinksForDocument?: FormattedLink[];
};

type FormData = { documents: MergedSchemaType[] };

const DEFAULT_DOCUMENT: MergedSchemaType = {
  docTitle: "",
  docDescription: "",
  fileTitle: "",
  file: undefined,
  formattedLinksForDocument: [],
};

const mapEditDataToDefaultValues = (
  editData: editDocumentData[],
  fileData: visaFileData[],
): MergedSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_DOCUMENT];

  return editData.map((data, index) => ({
    docTitle: data?.title || "",
    docDescription: data?.description || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
    formattedLinksForDocument:
      (data as any)?.formattedLinks || data?.formattedLinksForDocument || [],
  }));
};

interface DocumentWithId extends editDocumentData {
  _id: string;
}

const EditDocumentForm = forwardRef<DocumentFormHandle, DocumentFormProps>(
  ({ editData = [], fileData = [], onDeleteFile, onDeleteDocument }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      setValue,
      watch,
      getValues,
      clearErrors,
      setError,
      reset,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        documents: mapEditDataToDefaultValues(editData, fileData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "documents",
    });

    const watchDocuments = watch("documents");

    useEffect(() => {
      if (editData.length > 0 || fileData.length > 0) {
        reset({
          documents: mapEditDataToDefaultValues(editData, fileData),
        });
      }
    }, [editData, fileData, reset]);

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const documentData: addDocumentData[] = [];
      const documentFileData: addVisaFileData[] = [];
      let isValid = true;

      clearErrors();

      values.documents.forEach((document, index) => {
        const hasContent = hasDocumentContent(document);
        const hasFile = (document.file?.length ?? 0) > 0;
        const hasCompleteData = hasCompleteDocument(document);

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
          }

          if (hasCompleteData) {
            documentData.push({
              docTitle: document.docTitle,
              docDescription: document.docDescription,
              formattedLinksForDocument:
                document.formattedLinksForDocument || [],
            });

            documentFileData.push({
              fileTitle: document.fileTitle || "",
              file: document.file,
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!document.docTitle?.trim()) {
              setError(`documents.${index}.docTitle` as any, {
                type: "manual",
                message: "Document title is required",
              });
            }
            if (!document.docDescription?.trim()) {
              setError(`documents.${index}.docDescription` as any, {
                type: "manual",
                message: "Document description is required",
              });
            }
          }

          if (hasFile && !hasCompleteData) {
            isValid = false;
            setError(`documents.${index}.docTitle` as any, {
              type: "manual",
              message: "Complete all fields before uploading a file",
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
        const documentItem = editData[index] as DocumentWithId;
        if (documentItem?._id && onDeleteDocument) {
          onDeleteDocument(documentItem._id, index);
        } else {
          remove(index);
          clearErrors(`documents.${index}` as any);
        }
      },
      [remove, editData, onDeleteDocument, clearErrors],
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

        const currentDocument = watchDocuments?.[index];
        if (!hasCompleteDocument(currentDocument)) {
          setError(`documents.${index}.docTitle` as any, {
            type: "manual",
            message: "Complete all fields before uploading a file",
          });
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
      [setValue, watchDocuments, clearErrors, setError],
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

        if (!isValid) {
          return null;
        }

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
      const currentDocument = watchDocuments?.[index];
      const hasContent = hasDocumentContent(currentDocument);
      const fileTitleError = errors.documents?.[index]?.fileTitle?.message;
      const fileError = errors.documents?.[index]?.file?.message;
      const docTitleError = errors.documents?.[index]?.docTitle?.message;

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

          <EditFileInput
            title="Upload Document File"
            disabled={false}
            setValue={(fieldName, value) => {
              if (fieldName === "file") {
                handleFileSelect(value as FileList, index);
              }
            }}
            onChange={(files) => handleFileSelect(files, index)}
            error={
              hasContent && fileError
                ? String(fileError)
                : docTitleError
                  ? String(docTitleError)
                  : ""
            }
          />

          {hasExistingFile && currentFileData && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Current File:
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {currentFileData.fileTitle}
                  </p>
                </div>
                <IconButton
                  action={() => onDeleteFile?.(index, currentFileData._id!)}
                  style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
                  title=""
                  icon={<RiDeleteBin4Fill size={16} />}
                />
              </div>
            </div>
          )}

          {hasNewFile && watchDocuments[index]?.file && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-medium">
                New file selected: {watchDocuments[index].file![0].name}
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
            <p>• Complete all fields before uploading a file</p>
            <p>• File title is required if you upload a file</p>
            <p>• If you upload a new file, it will replace the existing one</p>
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

      const existingLinks =
        (editData[index] as any)?.formattedLinks ||
        editData[index]?.formattedLinksForDocument ||
        [];

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center border-b border-gray-200 pb-6 last:border-0"
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
              title="Document Title *"
              placeholder="Enter document title"
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
              title="Document Description *"
              placeholder="Enter document description"
              {...register(`documents.${index}.docDescription` as const)}
            />

            {renderFileSection(index)}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <FormattedLinkInput
                control={control}
                register={register}
                errors={errors.documents?.[index]?.formattedLinksForDocument}
                faqIndex={index}
                fieldName="documents"
                fieldKey="formattedLinksForDocument"
                defaultValues={existingLinks}
              />
            </div>
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

        {fields.map(renderDocumentForm)}
      </div>
    );
  },
);

EditDocumentForm.displayName = "EditDocumentForm";

export default EditDocumentForm;
