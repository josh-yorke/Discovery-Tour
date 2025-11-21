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

const termWithFileSchema = addTermSchema
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

type TermWithFileData = addTermData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  terms: z.array(termWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_TERM: TermWithFileData = {
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
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: [DEFAULT_TERM],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "terms",
  });

  const watchTerms = watch("terms");

  const addTerm = useCallback(() => {
    append(DEFAULT_TERM);
  }, [append]);

  // UPDATED: Allow deletion even when there's only one term, no auto-add
  const removeTerm = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
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
      setValue(`terms.${index}.fileTitle`, ""); // Clear file title when clearing file
    },
    [setValue]
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const termData: addTermData[] = [];
      const termFileData: addVisaFileData[] = [];

      const termsArray = Array.isArray(formData.terms)
        ? formData.terms
        : [formData.terms];

      termsArray.forEach((term) => {
        termData.push({
          title: term.title,
          terms: term.terms,
        });

        termFileData.push({
          fileTitle: term.fileTitle || "",
          file: term.file,
        });
      });

      return { termData, termFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentTerm = watchTerms?.[index];
    const hasNewFile = !!currentTerm?.file;
    const fileName = currentTerm?.file?.[0]?.name || "";

    return (
      <div className="space-y-4">
        <Input
          style="bg-white"
          disabled={false}
          error={errors.terms?.[index]?.fileTitle?.message || ""}
          title="Term File Title"
          placeholder="Enter term file title"
          type="text"
          {...register(`terms.${index}.fileTitle`)}
        />

        <FileInput
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

        {hasNewFile && fileName && (
          <NewFileDisplay
            fileName={fileName}
            onClear={() => handleClearFile(index)}
          />
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
    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {/* UPDATED: Always show delete button when there's at least one term */}
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
            error={errors.terms?.[index]?.title?.message || ""}
            title="Term Title"
            placeholder="Enter term title (e.g., General Terms, Privacy Policy)"
            type="text"
            {...register(`terms.${index}.title`)}
          />
          <TextArea
            disabled={false}
            error={errors.terms?.[index]?.terms?.message || ""}
            title="Terms and Conditions"
            placeholder="Enter detailed terms and conditions"
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
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Term"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderTermForm)}</div>
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

TermForm.displayName = "TermForm";

export default TermForm;
