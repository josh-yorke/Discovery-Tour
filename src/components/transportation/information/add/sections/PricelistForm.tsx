import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addTransportPricelistSchema,
  type addTransportPricelistData,
} from "../../../../../types/pricelist/addPricelistTypes";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../../../../types/visafile/addVisaFileTypes";
import Input from "../../../../input/Input";
import FileInput from "../../../../input/FileInput";
import IconButton from "../../../../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import SearchableVehicleDropdown from "../../../../input/SearchableVehicleDropdown";
import TextArea from "../../../../input/TextArea";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addTransportPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
}

const pricelistWithFileSchema = addTransportPricelistSchema
  .extend({
    file: addVisaFileSchema.shape.file.optional(),
    fileTitle: z.string().optional(),
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
    }
  );

type PricelistWithFileData = z.infer<typeof pricelistWithFileSchema>;

const formSchema = z.object({
  pricelists: z.array(pricelistWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_PRICELIST: PricelistWithFileData = {
  plan: "",
  fee: "",
  description: "",
  fileTitle: "",
  file: undefined,
  vehicle: "",
};

const PricelistForm = forwardRef<PricelistFormHandle>((_props, ref) => {
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
    defaultValues: { pricelists: [DEFAULT_PRICELIST] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricelists",
  });

  const watchPricelists = watch("pricelists");

  const addPricelist = useCallback(() => append(DEFAULT_PRICELIST), [append]);
  const removePricelist = useCallback(
    (index: number) => remove(index),
    [remove]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) return;

      setValue(`pricelists.${index}.file`, files);

      if (!watchPricelists?.[index]?.fileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`pricelists.${index}.fileTitle`, fileName);
      }
    },
    [setValue, watchPricelists]
  );

  const handleClearFile = useCallback(
    (index: number) => {
      setValue(`pricelists.${index}.file`, undefined);
      setValue(`pricelists.${index}.fileTitle`, "");
    },
    [setValue]
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      if (!(await trigger())) return null;

      const formData = getValues();
      const pricelistData: addTransportPricelistData[] = [];
      const pricelistFileData: addVisaFileData[] = [];

      const pricelistsArray = Array.isArray(formData.pricelists)
        ? formData.pricelists
        : [formData.pricelists];

      pricelistsArray.forEach((pricelist) => {
        const { file, fileTitle, ...rest } = pricelist;

        pricelistData.push({
          plan: rest.plan,
          fee: rest.fee,
          description: rest.description,
          vehicle: rest.vehicle,
        });

        pricelistFileData.push({
          fileTitle: fileTitle || "",
          file: file,
        });
      });

      return { pricelistData, pricelistFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentPricelist = watchPricelists?.[index];
    const hasNewFile = !!currentPricelist?.file;
    const fileName = currentPricelist?.file?.[0]?.name || "";

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

        <FileInput
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

        {hasNewFile && fileName && (
          <NewFileDisplay
            fileName={fileName}
            onClear={() => handleClearFile(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>• File is optional for each price plan</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
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
        {fields.length >= 1 && (
          <IconButton
            action={() => removePricelist(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.pricelists?.[index]?.plan?.message || ""}
              title="Plan Name"
              placeholder="Enter plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.pricelists?.[index]?.fee?.message || ""}
              title="Fee Amount"
              placeholder="Enter fee amount"
              type="number"
              {...register(`pricelists.${index}.fee`)}
            />
          </div>

          <SearchableVehicleDropdown
            disabled={false}
            title="Select Vehicle"
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
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addPricelist}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Plan"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderPricelistForm)}</div>
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

PricelistForm.displayName = "PricelistForm";

export default PricelistForm;
