import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  editVisaSchema,
  type editVisaData,
} from "../../types/visa/editVisaTypes";
import { updateVisa } from "../../hooks/visa/visa/updateVisa";
import InputOption from "../input/InputOption";
import Input from "../input/Input";
import ImageInput from "../input/ImageInput";
import TextArea from "../input/TextArea";
import Button from "../button/Button";
import { fetchImageFiles } from "../../utils/fetchImageFiles";

export interface MainVisaFormHandle {
  getFormData: () => Promise<{
    mainData: editVisaData;
    isValid: boolean;
  }>;
}

interface EditMainVisaFormProps {
  editData?: {
    id: string;
    country: string;
    type: string;
    mainDescription: string;
    eligibleApplicants: string;
    images: string[] | File[];
  };
}

const EditMainVisaForm = forwardRef<MainVisaFormHandle, EditMainVisaFormProps>(
  ({ editData }, ref) => {
    const queryClient = useQueryClient();
    const formRef = useRef<HTMLFormElement>(null);
    const [fetchedImages, setFetchedImages] = useState<File[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [currentFormImages, setCurrentFormImages] = useState<File[]>([]);

    const {
      register,
      setValue,
      handleSubmit,
      formState: { errors },
      trigger,
      watch,
    } = useForm<editVisaData>({
      resolver: zodResolver(editVisaSchema),
      defaultValues: editData
        ? {
            country: editData.country,
            type: editData.type,
            mainDescription: editData.mainDescription,
            eligibleApplicants: editData.eligibleApplicants,
          }
        : undefined,
      mode: "onChange",
    });

    // Watch the images field to handle both existing and new images
    const currentImages = watch("images");

    // Track current form images separately
    useEffect(() => {
      if (currentImages && Array.isArray(currentImages)) {
        // Filter out any string values and keep only File objects
        const fileImages = currentImages.filter(
          (img): img is File => img instanceof File
        );
        setCurrentFormImages(fileImages);
      }
    }, [currentImages]);

    // Fetch images only on initial load - but don't override current form state
    useEffect(() => {
      const fetchImages = async () => {
        if (hasInitialized) {
          // If we already have form images, don't refetch
          if (currentFormImages.length > 0) {
            return;
          }
        }

        if (editData?.images && editData.images.length > 0) {
          setIsLoadingImages(true);
          try {
            console.log("Fetching images:", editData.images);

            // Filter out any File objects and only fetch string image names
            const imageNames = editData.images.filter(
              (img): img is string => typeof img === "string"
            );

            if (imageNames.length > 0) {
              const images = await fetchImageFiles(imageNames);
              setFetchedImages(images);
              console.log("Fetched images:", images);

              // Only set initial form value if we don't have current form images
              if (currentFormImages.length === 0) {
                setValue("images", images as any);
              }
            } else {
              // If all images are already File objects, use them directly
              const fileImages = editData.images.filter(
                (img): img is File => img instanceof File
              );
              setFetchedImages(fileImages);

              // Only set initial form value if we don't have current form images
              if (currentFormImages.length === 0) {
                setValue("images", fileImages as any);
              }
            }
            setHasInitialized(true);
          } catch (error) {
            console.error("Error fetching images:", error);
            setFetchedImages([]);
            setHasInitialized(true);
          } finally {
            setIsLoadingImages(false);
          }
        } else {
          setFetchedImages([]);
          // Only set empty if we don't have current form images
          if (currentFormImages.length === 0) {
            setValue("images", []);
          }
          setHasInitialized(true);
        }
      };

      fetchImages();
    }, [editData, setValue, hasInitialized, currentFormImages]);

    const mainVisaMutation = useMutation<
      string,
      Error,
      { id: string; data: FormData }
    >({
      mutationFn: ({ id, data }) => updateVisa(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["visas", editData?.id] });
      },
    });

    // Expose form data via ref - use current form state, not fetched images
    useImperativeHandle(ref, () => ({
      getFormData: async (): Promise<{
        mainData: editVisaData;
        isValid: boolean;
      }> => {
        const isFormValid = await trigger();

        const mainData: editVisaData = {
          country: watch("country"),
          type: watch("type"),
          eligibleApplicants: watch("eligibleApplicants"),
          mainDescription: watch("mainDescription"),
          images: currentFormImages, // Use current form images, not fetched ones
        };

        return {
          mainData,
          isValid: isFormValid,
        };
      },
    }));

    const handleSubmitForm = (data: editVisaData) => {
      if (!editData?.id) return;

      const formData = new FormData();
      formData.append("country", data.country);
      formData.append("type", data.type);
      formData.append("eligibleApplicants", data.eligibleApplicants);
      formData.append("mainDescription", data.mainDescription);

      // Handle images - only append File objects from current form state
      currentFormImages.forEach((file: File) => {
        formData.append("images", file);
      });

      mainVisaMutation.mutate({ id: editData.id, data: formData });
    };

    // Determine which images to show - prefer current form images over fetched ones
    const imagesToShow =
      currentFormImages.length > 0 ? currentFormImages : fetchedImages;

    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleSubmitForm, (err) => {
          console.log(err);
        })}
        className="w-full flex flex-col gap-6"
      >
        <div className="w-full grid grid-cols-1 gap-4">
          <InputOption
            disabled={false}
            style="bg-white w-full"
            title="Country"
            options={["Korea", "Japan", "Resident"]}
            {...register("country")}
          />
          <Input
            style=""
            disabled={false}
            error={errors.country?.message || ""}
            title="Visa Type"
            placeholder="visa type"
            type="text"
            {...register("type")}
          />
          <Input
            style=""
            disabled={false}
            error={errors.eligibleApplicants?.message || ""}
            title="Eligible Applicants"
            placeholder="eligible applicants"
            type="text"
            {...register("eligibleApplicants")}
          />
          <TextArea
            disabled={false}
            error={errors.mainDescription?.message || ""}
            title="Visa Description"
            placeholder="visa description"
            {...register("mainDescription")}
          />

          {isLoadingImages ? (
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d2087]"></div>
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : (
            <ImageInput
              initialFiles={imagesToShow}
              title="Images"
              disabled={false}
              register={register}
              setValue={setValue}
              error={
                typeof errors.images?.message === "string"
                  ? errors.images.message
                  : ""
              }
            />
          )}

          <div className="flex justify-end">
            <Button
              isLoading={mainVisaMutation.isPending}
              title="Update Visa Information"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300"
            />
          </div>
        </div>
      </form>
    );
  }
);

EditMainVisaForm.displayName = "EditMainVisaForm";

export default EditMainVisaForm;
