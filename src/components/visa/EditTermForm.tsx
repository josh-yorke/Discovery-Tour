import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import EditFileInput from "../input/EditFileInput";
import {
  type addTermData,
  type editTermData,
} from "../../types/terms/addTermType";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

export interface TermFormHandle {
  getFormData: () => Promise<{
    termData: addTermData[];
    termFileData: addVisaFileData[];
  } | null>;
  removeTermField: (index: number) => void;
}

interface TermFormProps {
  editData?: editTermData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteTerm?: (termId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingTerm?: boolean;
}

const hasTermContent = (term: {
  title?: string;
  terms?: string;
  fileTitle?: string;
  file?: FileList;
}): boolean => {
  return (
    (term.title?.trim() ?? "").length > 0 ||
    (term.terms?.trim() ?? "").length > 0 ||
    (term.fileTitle?.trim() ?? "").length > 0 ||
    (term.file?.length ?? 0) > 0
  );
};

const hasCompleteTerm = (term: { title?: string; terms?: string }): boolean => {
  return (
    (term.title?.trim() ?? "").length > 0 &&
    (term.terms?.trim() ?? "").length > 0
  );
};

const mergedSchema = z
  .object({
    title: z.string().min(1, "Term title is required"),
    terms: z.string().min(1, "Terms content is required"),
    fileTitle: z.string().optional(),
    file: z.any().optional(),
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
  title: string;
  terms: string;
  fileTitle?: string;
  file?: FileList;
};

type FormData = { terms: MergedSchemaType[] };

const DEFAULT_TERM: MergedSchemaType = {
  title: "",
  terms: "",
  fileTitle: "",
  file: undefined,
};

const mapEditDataToDefaultValues = (
  editData: editTermData[],
  fileData: visaFileData[],
): MergedSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_TERM];

  return editData.map((data, index) => ({
    title: data?.title || "",
    terms: data?.terms || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

interface TermWithId extends editTermData {
  _id: string;
}

const EditTermForm = forwardRef<TermFormHandle, TermFormProps>(
  ({ editData = [], fileData = [], onDeleteFile, onDeleteTerm }, ref) => {
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
        terms: mapEditDataToDefaultValues(editData, fileData),
      },
    });

    console.log(editData);

    const { fields, append, remove } = useFieldArray({
      control,
      name: "terms",
    });

    const watchTerms = watch("terms");

    useEffect(() => {
      if (editData.length > 0 || fileData.length > 0) {
        reset({
          terms: mapEditDataToDefaultValues(editData, fileData),
        });
      }
    }, [editData, fileData, reset]);

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const termData: addTermData[] = [];
      const termFileData: addVisaFileData[] = [];
      let isValid = true;
      let hasAnyCompleteData = false;

      clearErrors();

      values.terms.forEach((term, index) => {
        const hasContent = hasTermContent(term);
        const hasFile = (term.file?.length ?? 0) > 0;
        const hasCompleteData = hasCompleteTerm(term);

        if (hasContent) {
          const result = mergedSchema.safeParse(term);

          if (!result.success) {
            isValid = false;
            result.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(`terms.${index}.${path}` as any, {
                  type: "manual",
                  message: issue.message,
                });
              }
            });
          }

          if (hasCompleteData) {
            hasAnyCompleteData = true;
            termData.push({
              title: term.title,
              terms: term.terms,
            });

            termFileData.push({
              fileTitle: term.fileTitle || "",
              file: term.file,
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!term.title?.trim()) {
              setError(`terms.${index}.title` as any, {
                type: "manual",
                message: "Term title is required",
              });
            }
            if (!term.terms?.trim()) {
              setError(`terms.${index}.terms` as any, {
                type: "manual",
                message: "Terms content is required",
              });
            }
          }

          if (hasFile && !hasCompleteData) {
            isValid = false;
            setError(`terms.${index}.title` as any, {
              type: "manual",
              message: "Complete all fields before uploading a file",
            });
          }
        }
      });

      return { isValid, termData, termFileData, hasAnyCompleteData };
    }, [getValues, setError, clearErrors]);

    const addTerm = useCallback(() => {
      append(DEFAULT_TERM);
    }, [append]);

    const removeTerm = useCallback(
      (index: number) => {
        const termItem = editData[index] as TermWithId;
        if (termItem?._id && onDeleteTerm) {
          onDeleteTerm(termItem._id, index);
        } else {
          remove(index);
          clearErrors(`terms.${index}` as any);
        }
      },
      [remove, editData, onDeleteTerm, clearErrors],
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) {
          setValue(`terms.${index}.file`, undefined);
          setValue(`terms.${index}.fileTitle`, "");
          clearErrors(`terms.${index}.fileTitle` as any);
          clearErrors(`terms.${index}.file` as any);
          return;
        }

        const currentTerm = watchTerms?.[index];
        if (!hasCompleteTerm(currentTerm)) {
          setError(`terms.${index}.title` as any, {
            type: "manual",
            message: "Complete all fields before uploading a file",
          });
          return;
        }

        setValue(`terms.${index}.file`, files);

        const currentFileTitle = watchTerms?.[index]?.fileTitle;
        if (!currentFileTitle) {
          const fileName = files[0].name.split(".").slice(0, -1).join(".");
          setValue(`terms.${index}.fileTitle`, fileName);
        }

        clearErrors(`terms.${index}.fileTitle` as any);
        clearErrors(`terms.${index}.file` as any);
      },
      [setValue, watchTerms, clearErrors, setError],
    );

    const handleClearFile = useCallback(
      (index: number) => {
        setValue(`terms.${index}.file`, undefined);
        setValue(`terms.${index}.fileTitle`, "");
        clearErrors(`terms.${index}.fileTitle` as any);
        clearErrors(`terms.${index}.file` as any);
      },
      [setValue, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, termData, termFileData } = validateAndGetFormData();

        if (!isValid) {
          return null;
        }

        return { termData, termFileData };
      },
      removeTermField: (index: number) => {
        remove(index);
      },
    }));

    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchTerms?.[index]?.file;
      const hasNewFile = !!watchTerms?.[index]?.file;
      const currentFileData = fileData[index];
      const currentTerm = watchTerms?.[index];
      const hasContent = hasTermContent(currentTerm);
      const fileTitleError = errors.terms?.[index]?.fileTitle?.message;
      const fileError = errors.terms?.[index]?.file?.message;
      const titleError = errors.terms?.[index]?.title?.message;

      return (
        <div className="space-y-4">
          <Input
            style="bg-white"
            disabled={false}
            error={hasContent && fileTitleError ? String(fileTitleError) : ""}
            title="Term File Title"
            placeholder="Enter term file title"
            type="text"
            {...register(`terms.${index}.fileTitle` as const)}
          />

          <EditFileInput
            title="Upload Term File"
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
                : titleError
                  ? String(titleError)
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

          {hasNewFile && watchTerms[index]?.file && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-medium">
                New file selected: {watchTerms[index].file![0].name}
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

    const renderTermForm = (field: { id: string }, index: number) => {
      const currentTerm = watchTerms?.[index];
      const hasContent = hasTermContent(currentTerm);
      const titleError = errors.terms?.[index]?.title?.message;
      const termsError = errors.terms?.[index]?.terms?.message;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length >= 1 && (
            <IconButton
              action={() => removeTerm(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && titleError ? String(titleError) : ""}
              title="Term Title *"
              placeholder="Enter term title"
              type="text"
              {...register(`terms.${index}.title` as const)}
            />
            <TextArea
              disabled={false}
              error={hasContent && termsError ? String(termsError) : ""}
              title="Terms and Conditions *"
              placeholder="Enter terms and conditions"
              {...register(`terms.${index}.terms` as const)}
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
            action={addTerm}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Term"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderTermForm)}
      </div>
    );
  },
);

EditTermForm.displayName = "EditTermForm";

export default EditTermForm;
