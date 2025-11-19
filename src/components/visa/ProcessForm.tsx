import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addProcessSchema,
  type addProcessData,
} from "../../types/process/addProcessTypes";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import FileInput from "../input/FileInput";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface ProcessFormHandle {
  getFormData: () => Promise<{
    processData: addProcessData[];
    processFileData: addVisaFileData[];
  } | null>;
}

const processWithFileSchema = addProcessSchema
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

type ProcessWithFileData = addProcessData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  processes: z.array(processWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_PROCESS: ProcessWithFileData = {
  processTitle: "",
  process: "",
  fileTitle: "",
  file: undefined,
};

const ProcessForm = forwardRef<ProcessFormHandle>((_props, ref) => {
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
      processes: [DEFAULT_PROCESS],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "processes",
  });

  const watchProcesses = watch("processes");

  const addProcess = useCallback(() => {
    append(DEFAULT_PROCESS);
  }, [append]);

  const removeProcess = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) return;

      setValue(`processes.${index}.file`, files);

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

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const processData: addProcessData[] = [];
      const processFileData: addVisaFileData[] = [];

      const processesArray = Array.isArray(formData.processes)
        ? formData.processes
        : [formData.processes];

      processesArray.forEach((process) => {
        processData.push({
          processTitle: process.processTitle,
          process: process.process,
        });

        processFileData.push({
          fileTitle: process.fileTitle || "",
          file: process.file,
        });
      });

      return { processData, processFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const hasNewFile = !!watchProcesses?.[index]?.file;

    return (
      <div className="space-y-4">
        <Input
          disabled={false}
          error={errors.processes?.[index]?.fileTitle?.message || ""}
          title="Process File Title"
          placeholder="Enter process file title"
          type="text"
          {...register(`processes.${index}.fileTitle`)}
        />

        <FileInput
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

        {hasNewFile && watchProcesses[index]?.file && (
          <NewFileDisplay
            fileName={watchProcesses[index].file![0].name}
            onClear={() => handleClearFile(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>• File is optional for each process step</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
        </div>
      </div>
    );
  };

  const renderProcessForm = (field: { id: string }, index: number) => {
    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length > 1 && (
          <IconButton
            action={() => removeProcess(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={errors.processes?.[index]?.processTitle?.message || ""}
            title="Process Title"
            placeholder="Enter process step title (e.g., Step 1: Application, Step 2: Review)"
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
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Process"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderProcessForm)}</div>
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

ProcessForm.displayName = "ProcessForm";

export default ProcessForm;
