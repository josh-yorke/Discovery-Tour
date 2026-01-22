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
import NumberInput from "../../../../input/NumberInput";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addTransportPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
}

const hasPricelistContent = (pricelist: {
  plan?: string;
  fee?: string;
  description?: string;
  vehicle?: string;
  fileTitle?: string;
  file?: FileList;
}): boolean => {
  return (
    (pricelist.plan?.trim() ?? "").length > 0 ||
    (pricelist.fee?.trim() ?? "").length > 0 ||
    (pricelist.description?.trim() ?? "").length > 0 ||
    (pricelist.vehicle?.trim() ?? "").length > 0 ||
    (pricelist.fileTitle?.trim() ?? "").length > 0 ||
    (pricelist.file?.length ?? 0) > 0
  );
};

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
    },
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
    getValues,
    clearErrors,
    setError,
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

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const pricelistData: addTransportPricelistData[] = [];
    const pricelistFileData: addVisaFileData[] = [];
    let isValid = true;

    clearErrors();

    values.pricelists.forEach((pricelist, index) => {
      const hasContent = hasPricelistContent(pricelist);

      if (hasContent) {
        const result = pricelistWithFileSchema.safeParse(pricelist);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`pricelists.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
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
    });

    return { isValid, pricelistData, pricelistFileData };
  }, [getValues, setError, clearErrors]);

  const addPricelist = useCallback(() => {
    append(DEFAULT_PRICELIST);
  }, [append]);

  const removePricelist = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`pricelists.${index}` as any);
    },
    [remove, clearErrors],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) {
        setValue(`pricelists.${index}.file`, undefined);
        setValue(`pricelists.${index}.fileTitle`, "");
        clearErrors(`pricelists.${index}.fileTitle` as any);
        clearErrors(`pricelists.${index}.file` as any);
        return;
      }

      setValue(`pricelists.${index}.file`, files);

      const currentFileTitle = watchPricelists?.[index]?.fileTitle;
      if (!currentFileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`pricelists.${index}.fileTitle`, fileName);
      }

      clearErrors(`pricelists.${index}.fileTitle` as any);
      clearErrors(`pricelists.${index}.file` as any);
    },
    [setValue, watchPricelists, clearErrors],
  );

  const handleClearFile = useCallback(
    (index: number) => {
      setValue(`pricelists.${index}.file`, undefined);
      setValue(`pricelists.${index}.fileTitle`, "");
      clearErrors(`pricelists.${index}.fileTitle` as any);
      clearErrors(`pricelists.${index}.file` as any);
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, pricelistData, pricelistFileData } =
        validateAndGetFormData();

      if (!isValid || pricelistData.length === 0) {
        return null;
      }

      return { pricelistData, pricelistFileData };
    },
  }));

  const renderFileSection = (index: number) => {
    const currentPricelist = watchPricelists?.[index];
    const hasNewFile = !!currentPricelist?.file;
    const fileName = currentPricelist?.file?.[0]?.name || "";
    const hasContent = hasPricelistContent(currentPricelist);
    const fileTitleError = errors.pricelists?.[index]?.fileTitle?.message;
    const fileError = errors.pricelists?.[index]?.file?.message;

    return (
      <div className="space-y-4">
        <Input
          style="bg-white"
          disabled={false}
          error={hasContent && fileTitleError ? String(fileTitleError) : ""}
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
          <p>• File is optional for each price plan</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
        </div>
      </div>
    );
  };

  const renderPricelistForm = (field: { id: string }, index: number) => {
    const currentPricelist = watchPricelists?.[index];
    const hasContent = hasPricelistContent(currentPricelist);
    const planError = errors.pricelists?.[index]?.plan?.message;
    const feeError = errors.pricelists?.[index]?.fee?.message;
    const descriptionError = errors.pricelists?.[index]?.description?.message;
    const vehicleError = errors.pricelists?.[index]?.vehicle?.message;

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
              error={hasContent && planError ? String(planError) : ""}
              title="Plan Name"
              placeholder="Enter plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan`)}
            />
            <NumberInput
              style="bg-white"
              disabled={false}
              error={hasContent && feeError ? String(feeError) : ""}
              title="Fee Amount"
              placeholder="Enter fee amount"
              type="text"
              {...register(`pricelists.${index}.fee`)}
            />
          </div>

          <div>
            <SearchableVehicleDropdown
              disabled={false}
              title="Select Vehicle"
              value={watchPricelists?.[index]?.vehicle || ""}
              onChange={(vehicleId: string) => {
                setValue(`pricelists.${index}.vehicle`, vehicleId);
                clearErrors(`pricelists.${index}.vehicle`);
              }}
              name={`pricelists.${index}.vehicle`}
              placeholder="Search for a vehicle..."
            />
            {hasContent && vehicleError && (
              <p className="text-xs text-red-500 mt-1">{vehicleError}</p>
            )}
          </div>

          <TextArea
            disabled={false}
            error={
              hasContent && descriptionError ? String(descriptionError) : ""
            }
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

PricelistForm.displayName = "PricelistForm";

export default PricelistForm;
