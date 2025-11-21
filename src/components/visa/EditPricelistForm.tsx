import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import { type addPricelistData } from "../../types/pricelist/addPricelistTypes";
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

// FIXED: STRICTER validation - require at least plan name
const pricelistWithFileSchema = z
  .object({
    plan: z.string().min(1, "Plan name is required"),
    fee: z.string().min(1, "Fee amount is required"),
    description: z.string().min(1, "Description is required"),
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

type PricelistWithFileData = {
  plan: string;
  fee: string;
  description: string;
  fileTitle?: string;
  file?: FileList;
};

// FIXED: ULTRA STRICT form schema
const formSchema = z.object({
  pricelists: z
    .array(pricelistWithFileSchema)
    .min(1, "At least one pricelist is required")
    .refine(
      (pricelists) => {
        // Check that every pricelist has the required fields
        return pricelists.every(
          (pricelist) =>
            pricelist.plan.trim() !== "" &&
            pricelist.fee.trim() !== "" &&
            pricelist.description.trim() !== ""
        );
      },
      {
        message:
          "All pricelists must have Plan Name, Fee Amount, and Description filled out",
      }
    ),
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
        const pricelistItem = editData[index];
        if (pricelistItem?._id && onDeletePricelist) {
          onDeletePricelist(pricelistItem._id, index);
        } else {
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

    // FIXED: ULTRA STRICT getFormData
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        console.log("🔄 Validating pricelist form...");

        // First validate with Zod
        const isValid = await trigger();
        if (!isValid) {
          console.log("❌ Zod validation failed");
          return null;
        }

        const formData = getValues();
        const pricelistData: addPricelistData[] = [];
        const pricelistFileData: addVisaFileData[] = [];

        const pricelistsArray = Array.isArray(formData.pricelists)
          ? formData.pricelists
          : [formData.pricelists];

        console.log("📋 Raw pricelists data:", pricelistsArray);

        // FIXED: MANUAL VALIDATION - Check every pricelist has required data
        for (let i = 0; i < pricelistsArray.length; i++) {
          const pricelist = pricelistsArray[i];

          const hasPlan = pricelist.plan && pricelist.plan.trim() !== "";
          const hasFee = pricelist.fee && pricelist.fee.trim() !== "";
          const hasDescription =
            pricelist.description && pricelist.description.trim() !== "";
          const hasFile = pricelist.file && pricelist.file.length > 0;

          console.log(`📝 Pricelist ${i}:`, {
            hasPlan,
            hasFee,
            hasDescription,
            hasFile,
            plan: pricelist.plan,
            fee: pricelist.fee,
            description: pricelist.description,
          });

          // FIXED: BLOCK submission if pricelist data is missing but file is present
          if ((!hasPlan || !hasFee || !hasDescription) && hasFile) {
            console.log(
              "🚫 BLOCKED: File provided without complete pricelist data"
            );
            alert(
              `❌ Pricelist #${
                i + 1
              }: Please fill out Plan Name, Fee Amount, and Description before uploading a file.`
            );
            return null;
          }

          // FIXED: Only include if ALL required fields are filled
          if (hasPlan && hasFee && hasDescription) {
            pricelistData.push({
              plan: pricelist.plan,
              fee: pricelist.fee,
              description: pricelist.description,
            });

            pricelistFileData.push({
              fileTitle: pricelist.fileTitle || "",
              file: pricelist.file,
            });
          } else {
            console.log(`⚠️ Skipping pricelist ${i} - missing required fields`);
          }
        }

        // FIXED: Final check - must have at least one valid pricelist
        if (pricelistData.length === 0) {
          console.log("❌ No valid pricelists found");
          alert(
            "❌ Please fill out all required fields (Plan Name, Fee Amount, and Description) for at least one pricelist."
          );
          return null;
        }

        console.log("✅ Valid pricelists:", pricelistData.length);
        return { pricelistData, pricelistFileData };
      },
      removePricelistField: (index: number) => {
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
            style="bg-white"
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
            <p>
              •{" "}
              <strong>
                File upload is only allowed after filling all pricelist fields
              </strong>
            </p>
            <p>• File title is required if you upload a file</p>
            <p>• If you upload a new file, it will replace the existing one</p>
          </div>
        </div>
      );
    };

    const renderPricelistForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Delete button */}
          {fields.length >= 1 && (
            <IconButton
              action={() => removePricelist(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.pricelists?.[index]?.plan?.message || ""}
              title="Plan Name *"
              placeholder="Enter visa plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.pricelists?.[index]?.fee?.message || ""}
              title="Fee Amount *"
              placeholder="Enter fee amount"
              type="number"
              {...register(`pricelists.${index}.fee`)}
            />
            <TextArea
              disabled={false}
              error={errors.pricelists?.[index]?.description?.message || ""}
              title="Plan Description *"
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
        {/* Form-level errors */}
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
