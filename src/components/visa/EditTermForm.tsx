import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

// FIXED: STRICTER validation - require title and terms
const termWithFileSchema = z
  .object({
    title: z.string().min(1, "Term title is required"),
    terms: z.string().min(1, "Terms content is required"),
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

type TermWithFileData = {
  title: string;
  terms: string;
  fileTitle?: string;
  file?: FileList;
};

// FIXED: ULTRA STRICT form schema
const formSchema = z.object({
  terms: z
    .array(termWithFileSchema)
    .min(1, "At least one term is required")
    .refine(
      (terms) => {
        // Check that every term has the required fields
        return terms.every(
          (term) => term.title.trim() !== "" && term.terms.trim() !== ""
        );
      },
      {
        message: "All terms must have Title and Terms content filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_TERM: TermWithFileData = {
  title: "",
  terms: "",
  fileTitle: "",
  file: undefined,
};

// FIXED: Type for edit data with _id
interface EditTermWithId extends editTermData {
  _id?: string;
}

const mapEditDataToDefaultValues = (
  editData: editTermData[],
  fileData: visaFileData[]
): TermWithFileData[] => {
  if (editData.length === 0) return [DEFAULT_TERM];

  return editData.map((data, index) => ({
    title: data?.title || "",
    terms: data?.terms || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

const EditTermForm = forwardRef<TermFormHandle, TermFormProps>(
  (
    {
      editData = [],
      fileData = [],
      onDeleteFile,
      onDeleteTerm,
      isDeleting,
      // isDeletingTerm,
    },
    ref
  ) => {
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
        terms: mapEditDataToDefaultValues(editData, fileData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "terms",
    });

    const watchTerms = watch("terms");

    // Pre-fill form when editData or fileData changes
    useEffect(() => {
      if (editData.length > 0 || fileData.length > 0) {
        reset({
          terms: mapEditDataToDefaultValues(editData, fileData),
        });
      }
    }, [editData, fileData, reset]);

    // Handlers
    const addTerm = useCallback(() => {
      append(DEFAULT_TERM);
    }, [append]);

    const removeTerm = useCallback(
      (index: number) => {
        // FIXED: Use type assertion to safely access _id
        const termItem = editData[index] as EditTermWithId | undefined;

        // If it's an existing term (has _id), use API deletion
        if (termItem?._id && onDeleteTerm) {
          onDeleteTerm(termItem._id, index);
        } else {
          // If it's a new term (no _id), just remove from local state
          remove(index);
        }
      },
      [remove, editData, onDeleteTerm]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`terms.${index}.file`, files);

        const currentFileTitle = watchTerms?.[index]?.fileTitle;
        if (!currentFileTitle) {
          const fileName = files[0].name.split(".").slice(0, -1).join(".");
          setValue(`terms.${index}.fileTitle`, fileName);
        }
      },
      [setValue, watchTerms]
    );

    const handleClearFile = useCallback(
      (index: number) => {
        setValue(`terms.${index}.file`, undefined);
      },
      [setValue]
    );

    // FIXED: ULTRA STRICT getFormData
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        console.log("🔄 Validating term form...");

        // First validate with Zod
        const isValid = await trigger();
        if (!isValid) {
          console.log("❌ Zod validation failed");
          return null;
        }

        const formData = getValues();
        const termData: addTermData[] = [];
        const termFileData: addVisaFileData[] = [];

        const termsArray = Array.isArray(formData.terms)
          ? formData.terms
          : [formData.terms];

        console.log("📋 Raw terms data:", termsArray);

        // FIXED: MANUAL VALIDATION - Check every term has required data
        for (let i = 0; i < termsArray.length; i++) {
          const term = termsArray[i];

          const hasTitle = term.title && term.title.trim() !== "";
          const hasTermsContent = term.terms && term.terms.trim() !== "";
          const hasFile = term.file && term.file.length > 0;

          console.log(`📝 Term ${i}:`, {
            hasTitle,
            hasTermsContent,
            hasFile,
            title: term.title,
            terms: term.terms,
          });

          // FIXED: BLOCK submission if term data is missing but file is present
          if ((!hasTitle || !hasTermsContent) && hasFile) {
            console.log("🚫 BLOCKED: File provided without complete term data");
            alert(
              `❌ Term #${
                i + 1
              }: Please fill out Title and Terms content before uploading a file.`
            );
            return null;
          }

          // FIXED: Only include if ALL required fields are filled
          if (hasTitle && hasTermsContent) {
            termData.push({
              title: term.title,
              terms: term.terms,
            });

            termFileData.push({
              fileTitle: term.fileTitle || "",
              file: term.file,
            });
          } else {
            console.log(`⚠️ Skipping term ${i} - missing required fields`);
          }
        }

        // FIXED: Final check - must have at least one valid term
        if (termData.length === 0) {
          console.log("❌ No valid terms found");
          alert(
            "❌ Please fill out all required fields (Title and Terms content) for at least one term."
          );
          return null;
        }

        console.log("✅ Valid terms:", termData.length);
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

      return (
        <div className="space-y-4">
          <Input
            disabled={false}
            error={errors.terms?.[index]?.fileTitle?.message || ""}
            title="Term File Title"
            placeholder="Enter term file title"
            type="text"
            {...register(`terms.${index}.fileTitle`)}
          />

          <EditFileInput
            title="Upload Term File"
            disabled={false}
            setValue={(fieldName, value) => {
              if (fieldName === "file") {
                setValue(`terms.${index}.file`, value as FileList);
              }
            }}
            onChange={(files) => handleFileSelect(files, index)}
            error={
              typeof errors.terms?.[index]?.file?.message === "string"
                ? errors.terms[index]?.file?.message
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

          {hasNewFile && watchTerms[index]?.file && (
            <NewFileDisplay
              fileName={watchTerms[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>
              •{" "}
              <strong>
                File upload is only allowed after filling all term fields
              </strong>
            </p>
            <p>• File title is required if you upload a file</p>
            <p>• If you upload a new file, it will replace the existing one</p>
          </div>
        </div>
      );
    };

    const renderTermForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Delete button */}
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
              disabled={false}
              error={errors.terms?.[index]?.title?.message || ""}
              title="Term Title *"
              placeholder="Enter term title"
              type="text"
              {...register(`terms.${index}.title`)}
            />
            <TextArea
              disabled={false}
              error={errors.terms?.[index]?.terms?.message || ""}
              title="Terms and Conditions *"
              placeholder="Enter terms and conditions"
              {...register(`terms.${index}.terms`)}
            />

            {renderFileSection(index)}
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        {/* Form-level errors */}
        {errors.terms?.message && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              {errors.terms.message}
            </p>
          </div>
        )}

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

EditTermForm.displayName = "EditTermForm";

export default EditTermForm;
