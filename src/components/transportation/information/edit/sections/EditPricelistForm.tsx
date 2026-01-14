import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

import type { addTransportPricelistData } from "../../../../../types/pricelist/addPricelistTypes";
import type { editTransportPricelistData } from "../../../../../types/pricelist/pricelistDataTypes";
import type { visaFileData } from "../../../../../types/visafile/visaFileDataTypes";
import type { addVisaFileData } from "../../../../../types/visafile/addVisaFileTypes";

import Input from "../../../../input/Input";
import IconButton from "../../../../button/IconButton";
import TextArea from "../../../../input/TextArea";
import SearchableVehicleDropdown from "../../../../input/SearchableVehicleDropdown";
import EditFileInput from "../../../../input/EditFileInput";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addTransportPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
  removePricelistField: (index: number) => void;
}

interface PricelistFormProps {
  editData?: editTransportPricelistData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeletePricelist?: (pricelistId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingPricelist?: boolean;
}

// Constants
const DEFAULT_PRICE_LIST = {
  plan: "",
  fee: "",
  description: "",
  vehicle: "",
  fileTitle: "",
  file: undefined,
};

// Schema Definitions
const pricelistWithFileSchema = z
  .object({
    plan: z.string().min(1, "Plan name is required"),
    fee: z.string().min(1, "Fee amount is required"),
    description: z.string().min(1, "Description is required"),
    vehicle: z.string().min(1, "Vehicle is required"),
    fileTitle: z.string().optional(),
    file: z.any().optional(),
  })
  .refine((data) => !(data.file?.length > 0) || !!data.fileTitle?.trim(), {
    message: "File title is required when a file is uploaded",
    path: ["fileTitle"],
  });

const formSchema = z.object({
  pricelists: z
    .array(pricelistWithFileSchema)
    .min(1, "At least one pricelist is required")
    .refine(
      (pricelists) =>
        pricelists.every(
          (pricelist) =>
            pricelist.plan.trim() !== "" &&
            pricelist.fee.trim() !== "" &&
            pricelist.description.trim() !== "" &&
            pricelist.vehicle.trim() !== ""
        ),
      {
        message:
          "All pricelists must have Plan Name, Fee Amount, Description, and Vehicle filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;
type PricelistWithFileData = z.infer<typeof pricelistWithFileSchema>;

// Helper Functions
const getCleanFileTitle = (title: string): string => {
  return title?.replace(/^pricelist\s*-\s*/i, "") || "";
};

const extractVehicleId = (vehicle: any): string => {
  if (!vehicle) return "";

  if (typeof vehicle === "string") {
    return vehicle;
  }

  if (vehicle._id && typeof vehicle._id === "string") {
    return vehicle._id;
  }

  return "";
};

const mapEditDataToDefaultValues = (
  editData: editTransportPricelistData[],
  fileData: visaFileData[]
): PricelistWithFileData[] => {
  if (editData.length === 0) return [DEFAULT_PRICE_LIST];

  return editData.map((data, index) => ({
    plan: data?.plan || "",
    fee: data?.fee?.toString() || "",
    description: data?.description || "",
    vehicle: extractVehicleId(data?.vehicle),
    fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
    file: undefined,
  }));
};

// Sub-Components
const ExistingFileDisplay: React.FC<{
  fileData: visaFileData;
  onDelete: () => void;
}> = ({ fileData, onDelete }) => (
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
        icon={<RiDeleteBin4Fill size={16} />}
        title=""
      />
    </div>
  </div>
);

const NewFileDisplay: React.FC<{
  fileName: string;
  onClear: () => void;
}> = ({ fileName, onClear }) => (
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

// Main Component
const EditPricelistForm = forwardRef<PricelistFormHandle, PricelistFormProps>(
  ({ editData = [], fileData = [], onDeleteFile, onDeletePricelist }, ref) => {
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

    // Event Handlers
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

    // Form Methods exposed via ref
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const pricelistData: addTransportPricelistData[] = [];
        const pricelistFileData: addVisaFileData[] = [];

        const pricelistsArray = Array.isArray(formData.pricelists)
          ? formData.pricelists
          : [formData.pricelists];

        for (let i = 0; i < pricelistsArray.length; i++) {
          const pricelist = pricelistsArray[i];

          const hasPlan = pricelist.plan && pricelist.plan.trim() !== "";
          const hasFee = pricelist.fee && pricelist.fee.trim() !== "";
          const hasDescription =
            pricelist.description && pricelist.description.trim() !== "";
          const hasVehicle =
            pricelist.vehicle && pricelist.vehicle.trim() !== "";
          const hasFile = pricelist.file && pricelist.file.length > 0;

          if (
            (!hasPlan || !hasFee || !hasDescription || !hasVehicle) &&
            hasFile
          ) {
            alert(
              `❌ Pricelist #${
                i + 1
              }: Please fill out all required fields before uploading a file.`
            );
            return null;
          }

          if (hasPlan && hasFee && hasDescription && hasVehicle) {
            pricelistData.push({
              plan: pricelist.plan,
              fee: pricelist.fee,
              description: pricelist.description,
              vehicle: pricelist.vehicle,
            });

            pricelistFileData.push({
              fileTitle: pricelist.fileTitle || "",
              file: pricelist.file,
            });
          }
        }

        if (pricelistData.length === 0) {
          alert(
            "❌ Please fill out all required fields for at least one pricelist."
          );
          return null;
        }

        return { pricelistData, pricelistFileData };
      },
      removePricelistField: remove,
    }));

    // Render Functions
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

    const renderPricelistForm = (field: { id: string }, index: number) => (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removePricelist(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            icon={<RiDeleteBin4Fill size={16} />}
            title=""
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div>
            <SearchableVehicleDropdown
              disabled={false}
              title="Select Vehicle *"
              value={watchPricelists?.[index]?.vehicle || ""}
              onChange={(vehicleId: string) => {
                setValue(`pricelists.${index}.vehicle`, vehicleId);
              }}
              name={`pricelists.${index}.vehicle`}
              placeholder="Search for a vehicle..."
            />
            {errors.pricelists?.[index]?.vehicle && (
              <p className="text-xs text-red-500 -mt-2">
                {errors.pricelists[index]?.vehicle?.message}
              </p>
            )}
          </div>

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

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        {fields.map(renderPricelistForm)}

        <div className="w-full flex justify-center">
          <IconButton
            action={addPricelist}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Plan"
            icon={<RiAddFill size={16} />}
          />
        </div>
      </div>
    );
  }
);

EditPricelistForm.displayName = "EditPricelistForm";

export default EditPricelistForm;
