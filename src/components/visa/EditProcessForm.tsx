import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  type addProcessData,
  type editProcessData,
} from "../../types/process/addProcessTypes";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
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

const hasCompleteProcess = (process: {
  processTitle?: string;
  process?: string;
}): boolean => {
  return (
    (process.processTitle?.trim() ?? "").length > 0 &&
    (process.process?.trim() ?? "").length > 0
  );
};

const mergedSchema = z
  .object({
    processTitle: z.string().min(1, "Process title is required"),
    process: z.string().min(1, "Process description is required"),
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
  processTitle: string;
  process: string;
  fileTitle?: string;
  file?: FileList;
};

type FormData = { processes: MergedSchemaType[] };

const DEFAULT_PROCESS: MergedSchemaType = {
  processTitle: "",
  process: "",
  fileTitle: "",
  file: undefined,
};

const getCleanFileTitle = (title: string): string => {
  return title?.replace(/^process\s*-\s*/i, "") || "";
};

const mapEditDataToDefaultValues = (
  editData: editProcessData[],
  fileData: visaFileData[],
): MergedSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_PROCESS];

  return editData.map((data, index) => ({
    processTitle: data?.processTitle || "",
    process: data?.process || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

interface ProcessWithId extends editProcessData {
  _id: string;
}

const EditProcessForm = forwardRef<ProcessFormHandle, ProcessFormProps>(
  ({ editData = [], fileData = [], onDeleteFile, onDeleteProcess }, ref) => {
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
      defaultValues: {
        processes: mapEditDataToDefaultValues(editData, fileData),
      },
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
      let hasAnyCompleteData = false;

      clearErrors();

      values.processes.forEach((process, index) => {
        const hasContent = hasProcessContent(process);
        const hasFile = (process.file?.length ?? 0) > 0;
        const hasCompleteData = hasCompleteProcess(process);

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
          }

          if (hasCompleteData) {
            hasAnyCompleteData = true;
            processData.push({
              processTitle: process.processTitle,
              process: process.process,
            });

            processFileData.push({
              fileTitle: process.fileTitle || "",
              file: process.file,
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!process.processTitle?.trim()) {
              setError(`processes.${index}.processTitle` as any, {
                type: "manual",
                message: "Process title is required",
              });
            }
            if (!process.process?.trim()) {
              setError(`processes.${index}.process` as any, {
                type: "manual",
                message: "Process description is required",
              });
            }
          }

          if (hasFile && !hasCompleteData) {
            isValid = false;
            setError(`processes.${index}.processTitle` as any, {
              type: "manual",
              message: "Complete all fields before uploading a file",
            });
          }
        }
      });

      return { isValid, processData, processFileData, hasAnyCompleteData };
    }, [getValues, setError, clearErrors]);

    const addProcess = useCallback(() => {
      append(DEFAULT_PROCESS);
    }, [append]);

    const removeProcess = useCallback(
      (index: number) => {
        const processItem = editData[index] as ProcessWithId;
        if (processItem?._id && onDeleteProcess) {
          onDeleteProcess(processItem._id, index);
        } else {
          remove(index);
          clearErrors(`processes.${index}` as any);
        }
      },
      [remove, editData, onDeleteProcess, clearErrors],
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

        const currentProcess = watchProcesses?.[index];
        if (!hasCompleteProcess(currentProcess)) {
          setError(`processes.${index}.processTitle` as any, {
            type: "manual",
            message: "Complete all fields before uploading a file",
          });
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
      [setValue, watchProcesses, clearErrors, setError],
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

        if (!isValid) {
          return null;
        }

        return { processData, processFileData };
      },
      removeProcessField: (index: number) => {
        remove(index);
      },
    }));

    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchProcesses?.[index]?.file;
      const hasNewFile = !!watchProcesses?.[index]?.file;
      const currentFileData = fileData[index];
      const currentProcess = watchProcesses?.[index];
      const hasContent = hasProcessContent(currentProcess);
      const fileTitleError = errors.processes?.[index]?.fileTitle?.message;
      const fileError = errors.processes?.[index]?.file?.message;
      const processTitleError =
        errors.processes?.[index]?.processTitle?.message;

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

          <EditFileInput
            title="Upload Process File"
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
                : processTitleError
                  ? String(processTitleError)
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
                    {getCleanFileTitle(currentFileData.fileTitle)}
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

          {hasNewFile && watchProcesses[index]?.file && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-medium">
                New file selected: {watchProcesses[index].file![0].name}
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

    const renderProcessForm = (field: { id: string }, index: number) => {
      const currentProcess = watchProcesses?.[index];
      const hasContent = hasProcessContent(currentProcess);
      const processTitleError =
        errors.processes?.[index]?.processTitle?.message;
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
              title="Process Title *"
              placeholder="Enter process title (e.g., Step 1: Application, Step 2: Review)"
              type="text"
              {...register(`processes.${index}.processTitle` as const)}
            />
            <TextArea
              disabled={false}
              error={hasContent && processError ? String(processError) : ""}
              title="Process Description *"
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

        {fields.map(renderProcessForm)}
      </div>
    );
  },
);

EditProcessForm.displayName = "EditProcessForm";

export default EditProcessForm;
