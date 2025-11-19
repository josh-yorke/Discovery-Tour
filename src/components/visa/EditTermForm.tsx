import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import EditFileInput from "../input/EditFileInput";
import {
  addTermSchema,
  type addTermData,
  type editTermData,
} from "../../types/terms/addTermType";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

// UPDATED: Add removeTermField method
export interface TermFormHandle {
  getFormData: () => Promise<{
    termData: addTermData[];
    termFileData: addVisaFileData[];
  } | null>;
  removeTermField: (index: number) => void;
}

// UPDATED: Interface with new props for multiple terms
interface TermFormProps {
  editData?: editTermData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteTerm?: (termId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingTerm?: boolean;
}

// Types - Fix: Make fileTitle required only when file is present
const termWithFileSchema = addTermSchema
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

type TermWithFileData = addTermData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  terms: z.array(termWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_TERM: TermWithFileData = {
  title: "",
  terms: "",
  fileTitle: "",
  file: undefined,
};

// Helper functions
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

// FIX: Create a type that includes _id for existing terms
interface TermWithId extends editTermData {
  _id: string;
}

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

    // FIXED: Remove term function with proper type handling
    const removeTerm = useCallback(
      (index: number) => {
        if (fields.length > 1) {
          const termItem = editData[index];
          // Use type assertion to safely access _id
          const termWithId = termItem as TermWithId;

          // If it's an existing term (has _id), use API deletion
          if (termWithId?._id && onDeleteTerm) {
            onDeleteTerm(termWithId._id, index);
          } else {
            // If it's a new term (no _id), just remove from local state
            remove(index);
          }
        }
      },
      [fields.length, remove, editData, onDeleteTerm]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`terms.${index}.file`, files);

        // Auto-fill file title if empty
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
        // Optionally clear file title when clearing file
        // setValue(`terms.${index}.fileTitle`, "");
      },
      [setValue]
    );

    // UPDATED: Expose form data and remove method to parent
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const termData: addTermData[] = [];
        const termFileData: addVisaFileData[] = [];

        console.log("🔍 EditTermForm - formData.terms:", formData.terms);
        console.log(
          "🔍 EditTermForm - isArray:",
          Array.isArray(formData.terms)
        );

        // FIX: Ensure we're always working with an array
        const termsArray = Array.isArray(formData.terms)
          ? formData.terms
          : [formData.terms];

        termsArray.forEach((term, index) => {
          console.log(`🔍 Processing term ${index}:`, term);

          termData.push({
            title: term.title,
            terms: term.terms,
          });

          termFileData.push({
            fileTitle: term.fileTitle || "", // Provide empty string if undefined
            file: term.file,
          });
        });

        console.log("🔍 EditTermForm - final termData:", termData);
        console.log("🔍 EditTermForm - final termFileData:", termFileData);

        return { termData, termFileData };
      },
      removeTermField: (index: number) => {
        if (fields.length > 1) {
          remove(index);
        }
      },
    }));

    // Render helpers
    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchTerms?.[index]?.file;
      const hasNewFile = !!watchTerms?.[index]?.file;

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

          {hasExistingFile && (
            <ExistingFileDisplay
              fileData={fileData[index]}
              onDelete={() => onDeleteFile?.(index, fileData[index]._id!)}
              isDeleting={isDeleting}
            />
          )}

          {hasNewFile && (
            <NewFileDisplay
              fileName={watchTerms[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>• File is optional when editing existing term</p>
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
    const renderTermForm = (field: { id: string }, index: number) => {
      // const termItem = editData[index];
      // Use type assertion to safely access _id
      // const termWithId = termItem as TermWithId;
      // const isExistingTerm = !!termWithId?._id;
      // const isThisTermDeleting = isExistingTerm && isDeletingTerm;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length > 1 && (
            <IconButton
              action={() => removeTerm(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              // isLoading={isThisTermDeleting}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              disabled={false}
              error={errors.terms?.[index]?.title?.message || ""}
              title="Term Title"
              placeholder="Enter term title"
              type="text"
              {...register(`terms.${index}.title`)}
            />
            <TextArea
              disabled={false}
              error={errors.terms?.[index]?.terms?.message || ""}
              title="Terms and Conditions"
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
        <div className="w-full flex justify-center">
          <IconButton
            action={addTerm}
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
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
