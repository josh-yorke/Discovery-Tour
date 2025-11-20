import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import {
  addPricelistSchema,
  type addPricelistData,
} from "../../types/pricelist/addPricelistTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import EditFileInput from "../input/EditFileInput";
import type { editPricelistData } from "../../types/pricelist/pricelistDataTypes";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
  removePricelistField: (index: number) => void;
}

interface PricelistFormProps {
  editData?: editPricelistData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeletePricelist?: (pricelistId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingPricelist?: boolean;
}

const pricelistWithFileSchema = addPricelistSchema
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

type PricelistWithFileData = addPricelistData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  pricelists: z.array(pricelistWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_PRICE_LIST: PricelistWithFileData = {
  plan: "",
  fee: "",
  description: "",
  fileTitle: "",
  file: undefined,
};

const getCleanFileTitle = (title: string): string => {
  return title?.replace(/^pricelist\s*-\s*/i, "") || "";
};

const mapEditDataToDefaultValues = (
  editData: editPricelistData[],
  fileData: visaFileData[]
): PricelistWithFileData[] => {
  // If no edit data, start with one empty price list
  if (editData.length === 0) return [DEFAULT_PRICE_LIST];

  return editData.map((data, index) => ({
    plan: data?.plan || "",
    fee: data?.fee?.toString() || "",
    description: data?.description || "",
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

const EditPricelistForm = forwardRef<PricelistFormHandle, PricelistFormProps>(
  (
    {
      editData = [],
      fileData = [],
      onDeleteFile,
      onDeletePricelist,
      isDeleting,
      // isDeletingPricelist,
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
        pricelists: mapEditDataToDefaultValues(editData, fileData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "pricelists",
    });

    const watchPricelists = watch("pricelists");

    const addPricelist = useCallback(() => {
      append(DEFAULT_PRICE_LIST);
    }, [append]);

    const removePricelist = useCallback(
      (index: number) => {
        // Allow deletion even if there's only one price list
        const pricelistItem = editData[index];
        if (pricelistItem?._id && onDeletePricelist) {
          // If it's an existing pricelist with an ID, call the delete handler
          onDeletePricelist(pricelistItem._id, index);
        } else {
          // If it's a new pricelist (no ID) or no delete handler, just remove from form
          remove(index);
        }
      },
      [remove, editData, onDeletePricelist]
    );

    const handleFileSelect = useCallback(
      (files: FileList | null, index: number) => {
        if (!files || files.length === 0) return;

        setValue(`pricelists.${index}.file`, files);

        const currentFileTitle = watchPricelists?.[index]?.fileTitle;
        if (!currentFileTitle) {
          const fileName = files[0].name.split(".").slice(0, -1).join(".");
          setValue(`pricelists.${index}.fileTitle`, fileName);
        }
      },
      [setValue, watchPricelists]
    );

    const handleClearFile = useCallback(
      (index: number) => {
        setValue(`pricelists.${index}.file`, undefined);
      },
      [setValue]
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const pricelistData: addPricelistData[] = [];
        const pricelistFileData: addVisaFileData[] = [];

        const pricelistsArray = Array.isArray(formData.pricelists)
          ? formData.pricelists
          : [formData.pricelists];

        pricelistsArray.forEach((pricelist) => {
          pricelistData.push({
            plan: pricelist.plan,
            fee: pricelist.fee,
            description: pricelist.description,
          });

          pricelistFileData.push({
            fileTitle: pricelist.fileTitle || "",
            file: pricelist.file,
          });
        });

        return { pricelistData, pricelistFileData };
      },
      removePricelistField: (index: number) => {
        // Allow deletion even if there's only one price list
        remove(index);
      },
    }));

    const renderFileSection = (index: number) => {
      const hasExistingFile =
        fileData[index]?._id && !watchPricelists?.[index]?.file;
      const hasNewFile = !!watchPricelists?.[index]?.file;
      const currentFileData = fileData[index];

      return (
        <div className="space-y-4">
          <Input
            disabled={false}
            error={errors.pricelists?.[index]?.fileTitle?.message || ""}
            title="Pricelist File Title"
            placeholder="Enter pricelist file title"
            type="text"
            {...register(`pricelists.${index}.fileTitle`)}
          />

          <EditFileInput
            title="Upload Pricelist File"
            disabled={false}
            setValue={(fieldName, value) => {
              if (fieldName === "file") {
                setValue(`pricelists.${index}.file`, value as FileList);
              }
            }}
            onChange={(files) => handleFileSelect(files, index)}
            error={
              typeof errors.pricelists?.[index]?.file?.message === "string"
                ? errors.pricelists[index]?.file?.message
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

          {hasNewFile && watchPricelists[index]?.file && (
            <NewFileDisplay
              fileName={watchPricelists[index].file![0].name}
              onClear={() => handleClearFile(index)}
            />
          )}

          <div className="text-xs text-gray-500">
            <p>• File is optional when editing existing pricelist</p>
            <p>• If you upload a new file, it will replace the existing one</p>
            <p>• File title is required if you upload a file</p>
            {currentFileData?.file && (
              <p>• To remove a file permanently, use the delete button</p>
            )}
          </div>
        </div>
      );
    };

    const renderPricelistForm = (field: { id: string }, index: number) => {
      // const pricelistItem = editData[index];
      // const isExistingPricelist = !!pricelistItem?._id;
      // const isThisPricelistDeleting = isExistingPricelist && isDeletingPricelist;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Always show delete button when there's at least one item */}
          {fields.length >= 1 && (
            <IconButton
              action={() => removePricelist(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              // isLoading={isThisPricelistDeleting}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              disabled={false}
              error={errors.pricelists?.[index]?.plan?.message || ""}
              title="Plan Name"
              placeholder="Enter visa plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan`)}
            />
            <Input
              disabled={false}
              error={errors.pricelists?.[index]?.fee?.message || ""}
              title="Fee Amount"
              placeholder="Enter fee amount"
              type="number"
              {...register(`pricelists.${index}.fee`)}
            />
            <TextArea
              disabled={false}
              error={errors.pricelists?.[index]?.description?.message || ""}
              title="Plan Description"
              placeholder="Enter detailed description of what this plan includes"
              {...register(`pricelists.${index}.description`)}
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
            action={addPricelist}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Plan"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderPricelistForm)}
      </div>
    );
  }
);

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

EditPricelistForm.displayName = "EditPricelistForm";

export default EditPricelistForm;
