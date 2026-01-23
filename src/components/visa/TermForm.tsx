import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import FileInput from "../input/FileInput";
import { addTermSchema, type addTermData } from "../../types/terms/addTermType";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface TermFormHandle {
  getFormData: () => Promise<{
    termData: addTermData[];
    termFileData: addVisaFileData[];
  } | null>;
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

const mergedSchema = addTermSchema
  .merge(
    addVisaFileSchema.omit({ file: true, fileTitle: true }).extend({
      file: addVisaFileSchema.shape.file.optional(),
      fileTitle: z.string().optional(),
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
type FormData = { terms: MergedSchemaType[] };

const DEFAULT_TERM: MergedSchemaType = {
  title: "",
  terms: "",
  fileTitle: "",
  file: undefined,
};

const TermForm = forwardRef<TermFormHandle>((_props, ref) => {
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
    defaultValues: { terms: [DEFAULT_TERM] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "terms",
  });

  const watchTerms = watch("terms");

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const termData: addTermData[] = [];
    const termFileData: addVisaFileData[] = [];
    let isValid = true;

    clearErrors();

    values.terms.forEach((term, index) => {
      const hasContent = hasTermContent(term);

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
        } else {
          termData.push({
            title: term.title,
            terms: term.terms,
          });

          termFileData.push({
            fileTitle: term.fileTitle || "",
            file: term.file,
          });
        }
      }
    });

    return { isValid, termData, termFileData };
  }, [getValues, setError, clearErrors]);

  const addTerm = useCallback(() => {
    append(DEFAULT_TERM);
  }, [append]);

  const removeTerm = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`terms.${index}` as any);
    },
    [remove, clearErrors],
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

      setValue(`terms.${index}.file`, files);

      const currentFileTitle = watchTerms?.[index]?.fileTitle;
      if (!currentFileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`terms.${index}.fileTitle`, fileName);
      }

      clearErrors(`terms.${index}.fileTitle` as any);
      clearErrors(`terms.${index}.file` as any);
    },
    [setValue, watchTerms, clearErrors],
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

      if (!isValid || termData.length === 0) {
        return null;
      }

      return { termData, termFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentTerm = watchTerms?.[index];
    const hasNewFile = !!currentTerm?.file;
    const fileName = currentTerm?.file?.[0]?.name || "";
    const hasContent = hasTermContent(currentTerm);
    const fileTitleError = errors.terms?.[index]?.fileTitle?.message;
    const fileError = errors.terms?.[index]?.file?.message;

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

        <FileInput
          title="Upload Term File"
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
          <p>• File is optional for each term</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
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
            title="Term Title"
            placeholder="Enter term title (e.g., General Terms, Privacy Policy)"
            type="text"
            {...register(`terms.${index}.title` as const)}
          />
          <TextArea
            disabled={false}
            error={hasContent && termsError ? String(termsError) : ""}
            title="Terms and Conditions"
            placeholder="Enter detailed terms and conditions"
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

      <div className="w-full space-y-6">{fields.map(renderTermForm)}</div>
    </div>
  );
});

TermForm.displayName = "TermForm";
export default TermForm;
