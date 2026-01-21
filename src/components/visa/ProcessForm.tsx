import { useForm, useFieldArray } from "react-hook-form";
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

const hasProcessContent = (process: {
  processTitle?: string;
  process?: string;
  fileTitle?: string;
  file?: FileList;
}): boolean => {
  return (
    (process.processTitle?.trim() ?? "").length > 0 ||
    (process.process?.trim() ?? "").length > 0 ||
    (process.fileTitle?.trim() ?? "").length > 0 ||
    (process.file?.length ?? 0) > 0
  );
};

const mergedSchema = addProcessSchema
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
type FormData = { processes: MergedSchemaType[] };

const DEFAULT_PROCESS: MergedSchemaType = {
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
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { processes: [DEFAULT_PROCESS] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "processes",
  });

  const watchProcesses = watch("processes");

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const processData: addProcessData[] = [];
    const processFileData: addVisaFileData[] = [];
    let isValid = true;

    clearErrors();

    values.processes.forEach((process, index) => {
      const hasContent = hasProcessContent(process);

      if (hasContent) {
        const result = mergedSchema.safeParse(process);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`processes.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
          processData.push({
            processTitle: process.processTitle,
            process: process.process,
          });

          processFileData.push({
            fileTitle: process.fileTitle || "",
            file: process.file,
          });
        }
      }
    });

    return { isValid, processData, processFileData };
  }, [getValues, setError, clearErrors]);

  const addProcess = useCallback(() => {
    append(DEFAULT_PROCESS);
  }, [append]);

  const removeProcess = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`processes.${index}` as any);
    },
    [remove, clearErrors],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) {
        setValue(`processes.${index}.file`, undefined);
        setValue(`processes.${index}.fileTitle`, "");
        clearErrors(`processes.${index}.fileTitle` as any);
        clearErrors(`processes.${index}.file` as any);
        return;
      }

      setValue(`processes.${index}.file`, files);

      const currentFileTitle = watchProcesses?.[index]?.fileTitle;
      if (!currentFileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`processes.${index}.fileTitle`, fileName);
      }

      clearErrors(`processes.${index}.fileTitle` as any);
      clearErrors(`processes.${index}.file` as any);
    },
    [setValue, watchProcesses, clearErrors],
  );

  const handleClearFile = useCallback(
    (index: number) => {
      setValue(`processes.${index}.file`, undefined);
      setValue(`processes.${index}.fileTitle`, "");
      clearErrors(`processes.${index}.fileTitle` as any);
      clearErrors(`processes.${index}.file` as any);
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, processData, processFileData } =
        validateAndGetFormData();

      if (!isValid || processData.length === 0) {
        return null;
      }

      return { processData, processFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentProcess = watchProcesses?.[index];
    const hasNewFile = !!currentProcess?.file;
    const fileName = currentProcess?.file?.[0]?.name || "";
    const hasContent = hasProcessContent(currentProcess);
    const fileTitleError = errors.processes?.[index]?.fileTitle?.message;
    const fileError = errors.processes?.[index]?.file?.message;

    return (
      <div className="space-y-4">
        <Input
          style="bg-white"
          disabled={false}
          error={hasContent && fileTitleError ? String(fileTitleError) : ""}
          title="Process File Title"
          placeholder="Enter process file title"
          type="text"
          {...register(`processes.${index}.fileTitle` as const)}
        />

        <FileInput
          title="Upload Process File"
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
          <p>• File is optional for each process step</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
        </div>
      </div>
    );
  };

  const renderProcessForm = (field: { id: string }, index: number) => {
    const currentProcess = watchProcesses?.[index];
    const hasContent = hasProcessContent(currentProcess);
    const processTitleError = errors.processes?.[index]?.processTitle?.message;
    const processError = errors.processes?.[index]?.process?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removeProcess(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <Input
            style="bg-white"
            disabled={false}
            error={
              hasContent && processTitleError ? String(processTitleError) : ""
            }
            title="Process Title"
            placeholder="Enter process step title (e.g., Step 1: Application, Step 2: Review)"
            type="text"
            {...register(`processes.${index}.processTitle` as const)}
          />
          <TextArea
            disabled={false}
            error={hasContent && processError ? String(processError) : ""}
            title="Process Description"
            placeholder="Enter detailed step-by-step process description"
            {...register(`processes.${index}.process` as const)}
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

      <div className="w-full space-y-6">{fields.map(renderProcessForm)}</div>
    </div>
  );
});

ProcessForm.displayName = "ProcessForm";
export default ProcessForm;
