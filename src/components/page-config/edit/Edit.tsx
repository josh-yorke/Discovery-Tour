import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Input from "../../input/Input";
import Modal from "../../modal/Modal";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import SectionLoader from "../../loader/SectionLoader";
import MultiSelect from "../../input/MultiSelect";
import {
  getPageConfigs,
  updatePageConfig,
} from "../../../hooks/page-config/pageConfig";
import {
  editPageConfigSchema,
  type editPageConfigData,
} from "../../../types/page-config/pageConfigTypes";

interface ChildPage {
  _id: string;
  type: string;
  key: string;
  displayName: string;
  pathLink: string;
  order: number;
  isUnderMaintenance: boolean;
}

interface EditInputsProps {
  id: string;
  type: "maintab" | "subtab" | "solo";
  keyName: string;
  displayName: string;
  pathLink: string;
  order: number;
  isUnderMaintenance: boolean;
  childPages: ChildPage[];
}

const Edit = ({
  id,
  type,
  keyName,
  displayName,
  pathLink,
  order,
  isUnderMaintenance,
  childPages,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initialChildPageIds = childPages.map((child) => child._id);
  const [allSubtabs, setAllSubtabs] = useState<any[]>([]);

  const { data: availableSubtabs, isLoading: isLoadingSubtabs } = useQuery({
    queryKey: ["pageConfigs", "subtab", "all"],
    queryFn: async () => {
      let allConfigs: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await getPageConfigs(currentPage.toString(), ["subtab"]);
        if (result?.configs) {
          allConfigs = [...allConfigs, ...result.configs];
          hasMore = result.totalPages > currentPage;
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      return allConfigs;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (availableSubtabs) {
      setAllSubtabs(availableSubtabs);
    }
  }, [availableSubtabs]);

  const methods = useForm<editPageConfigData>({
    resolver: zodResolver(editPageConfigSchema),
    defaultValues: {
      type,
      key: keyName,
      displayName,
      pathLink,
      order,
      isUnderMaintenance,
      childPages: initialChildPageIds,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const watchType = watch("type");
  const selectedChildPageIds = watch("childPages") || [];

  useEffect(() => {
    reset({
      type,
      key: keyName,
      displayName,
      pathLink,
      order,
      isUnderMaintenance,
      childPages: childPages.map((child) => child._id),
    });
  }, [
    type,
    keyName,
    displayName,
    pathLink,
    order,
    isUnderMaintenance,
    childPages,
    reset,
  ]);

  useEffect(() => {
    if (watchType !== "maintab") {
      setValue("childPages", []);
    }
  }, [watchType, setValue]);

  const mutation = useMutation({
    mutationFn: (data: editPageConfigData) => updatePageConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageConfigs"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["pageConfig", id] });
      navigate(-1);
      reset();
    },
    onError: (error: Error) => {
      console.error("Update error:", error);
    },
  });

  const onSubmit = (data: editPageConfigData) => mutation.mutate(data);

  const handleChildPagesChange = (selectedIds: string[]) => {
    setValue("childPages", selectedIds, { shouldDirty: true });
  };

  if (isLoadingSubtabs && allSubtabs.length === 0 && !availableSubtabs) {
    return <SectionLoader />;
  }

  const subtabOptions = allSubtabs.map((subtab: any) => ({
    value: subtab._id,
    label: subtab.displayName,
  }));

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <InputOption
            disabled={false}
            options={["maintab", "subtab", "solo"]}
            {...register("type")}
            style="w-full bg-white"
            title="Type"
          />

          <Input
            disabled={false}
            style="bg-white"
            error={errors.displayName?.message || ""}
            title="Display Name"
            placeholder="e.g., Visas, Tours, Insurance"
            type="text"
            {...register("displayName")}
          />

          <Input
            disabled={false}
            style="bg-white"
            error={errors.key?.message || ""}
            title="Key"
            placeholder="e.g., visas, tours, insurance"
            type="text"
            {...register("key")}
          />

          <Input
            disabled={false}
            style="bg-white"
            error={errors.pathLink?.message || ""}
            title="Path Link"
            placeholder="e.g., /visas, /tours, /insurance"
            type="text"
            {...register("pathLink")}
          />

          <Input
            disabled={false}
            style="bg-white"
            error={errors.order?.message || ""}
            title="Order"
            placeholder="e.g., 1, 2, 3"
            type="number"
            {...register("order", { valueAsNumber: true })}
          />

          <InputOption
            disabled={false}
            options={["false", "true"]}
            {...register("isUnderMaintenance")}
            style="w-full bg-white"
            title="Under Maintenance"
          />

          {watchType === "maintab" && (
            <div className="w-full">
              {subtabOptions.length > 0 ? (
                <MultiSelect
                  title="Child Pages (Subtabs)"
                  options={subtabOptions}
                  selectedValues={selectedChildPageIds}
                  onChange={handleChildPagesChange}
                  placeholder="Select subtabs to link to this main tab"
                  error={errors.childPages?.message || ""}
                />
              ) : (
                <div className="w-full p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-yellow-700">
                    No subtabs available. Create subtabs first to add them as
                    child pages.
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            isLoading={mutation.isPending}
            title="Update Page Config"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={false}
          action={() => navigate("/page-configs")}
          message={mutation.error.message}
        />
      )}

      {mutation.isSuccess && (
        <Modal
          success={true}
          action={() => navigate("/page-configs")}
          message="Page config updated successfully"
        />
      )}
    </>
  );
};

export default Edit;
