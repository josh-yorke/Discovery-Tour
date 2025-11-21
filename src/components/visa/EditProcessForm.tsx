import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addProcessSchema,
  type addProcessData,
  type editProcessData,
} from "../../types/process/addProcessTypes";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import EditFileInput from "../input/EditFileInput";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface ProcessFormHandle {
  getFormData: () => Promise<{
    processData: addProcessData[];
    processFileData: addVisaFileData[];
  } | null>;
  removeProcessField: (index: number) => void;
}

interface ProcessFormProps {
  editData?: editProcessData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteProcess?: (processId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingProcess?: boolean;
}

// Types - Fix: Make fileTitle required only when file is present
const processWithFileSchema = addProcessSchema
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

type ProcessWithFileData = addProcessData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  processes: z.array(processWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_PROCESS: ProcessWithFileData = {
  processTitle: "",
  process: "",
  fileTitle: "",
  file: undefined,
};

// Helper functions
const getCleanFileTitle = (title: string): string => {
  return title?.replace(/^process\s*-\s*/i, "") || "";
};

const mapEditDataToDefaultValues = (
  editData: editProcessData[],
  fileData: visaFileData[]
): ProcessWithFileData[] => {
  // If no edit data, start with one empty process
  if (editData.length === 0) return [DEFAULT_PROCESS];

  return editData.map((data, index) => ({
    processTitle: data?.processTitle || "",
    process: data?.process || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

// FIX: Create a type that includes _id for existing processes
interface ProcessWithId extends editProcessData {
  _id: string;
}

const EditProcessForm = forwardRef<ProcessFormHandle, ProcessFormProps>(
  (
    {
      editData = [],
      fileData = [],
      onDeleteFile,
      onDeleteProcess,
      isDeleting,
      // isDeletingProcess,
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
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        processes: mapEditDataToDefaultValues(editData, fileData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "processes",
    });

    const watchProcesses = watch("processes");

    // Handlers
    const addProcess = useCallback(() => {
      append(DEFAULT_PROCESS);
    }, [append]);

    // UPDATED: Allow deletion even when there's only one process, no auto-add
    const removeProcess = useCallback(
      (index: number) => {
        const processItem = editData[index];
        // Use type assertion to safely access _id
        const processWithId = processItem as ProcessWithId;

        // If it's an existing process (has _id), use API deletion
        if (processWithId?._id && onDeleteProcess) {
          onDeleteProcess(processWithId._id, index);
        } else {
          // If it's a new process (no _id), just remove from local state
          remove(index);
        }
      },
      [remove, editData, onDeleteProcess]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`processes.${index}.file`, files);

        // Auto-fill file title if empty
        const currentFileTitle = watchProcesses?.[index]?.fileTitle;
        if (!currentFileTitle) {
          const fileName = files[0].name.split(".").slice(0, -1).join(".");
          setValue(`processes.${index}.fileTitle`, fileName);
        }
      },
      [setValue, watchProcesses]
    );

    const handleClearFile = useCallback(
      (index: number) => {
        setValue(`processes.${index}.file`, undefined);
      },
      [setValue]
    );

    // UPDATED: Expose form data and remove method to parent
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const processData: addProcessData[] = [];
        const processFileData: addVisaFileData[] = [];

        console.log(
          "🔍 EditProcessForm - formData.processes:",
          formData.processes
        );
        console.log(
          "🔍 EditProcessForm - isArray:",
          Array.isArray(formData.processes)
        );

        // FIX: Ensure we're always working with an array
        const processesArray = Array.isArray(formData.processes)
          ? formData.processes
          : [formData.processes];

        processesArray.forEach((process, index) => {
          console.log(`🔍 Processing process ${index}:`, process);

          processData.push({
            processTitle: process.processTitle,
            process: process.process,
          });

          processFileData.push({
            fileTitle: process.fileTitle || "", // Provide empty string if undefined
            file: process.file,
          });
        });

        console.log("🔍 EditProcessForm - final processData:", processData);
        console.log(
          "🔍 EditProcessForm - final processFileData:",
          processFileData
        );

        return { processData, processFileData };
      },
      removeProcessField: (index: number) => {
        // UPDATED: Allow deletion even when there's only one process
        remove(index);
      },
    }));

    // Render helpers
    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchProcesses?.[index]?.file;
      const hasNewFile = !!watchProcesses?.[index]?.file;

      return (
        <div className="space-y-4">
          <Input
            style="bg-white"
            disabled={false}
            error={errors.processes?.[index]?.fileTitle?.message || ""}
            title="Process File Title"
            placeholder="Enter process file title"
            type="text"
            {...register(`processes.${index}.fileTitle`)}
          />

          <EditFileInput
            title="Upload Process File"
            disabled={false}
            setValue={(fieldName, value) => {
              if (fieldName === "file") {
                setValue(`processes.${index}.file`, value as FileList);
              }
            }}
            onChange={(files) => handleFileSelect(files, index)}
            error={
              typeof errors.processes?.[index]?.file?.message === "string"
                ? errors.processes[index]?.file?.message
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
              fileName={watchProcesses[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>• File is optional when editing existing process</p>
            <p>• If you upload a new file, it will replace the existing one</p>
            <p>• File title is required if you upload a file</p>
            {fileData[index]?.file && (
              <p>• To remove a file permanently, use the delete button</p>
            )}
          </div>
        </div>
      );
    };

    // UPDATED: Render function with always visible delete button
    const renderProcessForm = (field: { id: string }, index: number) => {
      // const processItem = editData[index];
      // // Use type assertion to safely access _id
      // const processWithId = processItem as ProcessWithId;
      // const isExistingProcess = !!processWithId?._id;
      // const isThisProcessDeleting = isExistingProcess && isDeletingProcess;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* UPDATED: Always show delete button when there's at least one process */}
          {fields.length >= 1 && (
            <IconButton
              action={() => removeProcess(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              // isLoading={isThisProcessDeleting}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.processes?.[index]?.processTitle?.message || ""}
              title="Process Title"
              placeholder="Enter process title (e.g., Step 1: Application, Step 2: Review)"
              type="text"
              {...register(`processes.${index}.processTitle`)}
            />
            <TextArea
              disabled={false}
              error={errors.processes?.[index]?.process?.message || ""}
              title="Process Description"
              placeholder="Enter detailed step-by-step process description"
              {...register(`processes.${index}.process`)}
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
            action={addProcess}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Process"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderProcessForm)}
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
        <p className="text-sm text-red-700 mt-1">
          {getCleanFileTitle(fileData.fileTitle)}
        </p>
      </div>

      <IconButton
        action={onDelete}
        style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
        title=""
        icon={<RiDeleteBin4Fill size={16} />}
        // isLoading={isDeleting}
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

EditProcessForm.displayName = "EditProcessForm";

export default EditProcessForm;
