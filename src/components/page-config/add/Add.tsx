import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import Input from "../../../components/input/Input";
import InputOption from "../../../components/input/InputOption";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import MultiSelect from "../../../components/input/MultiSelect";
import {
  editPageConfigSchema,
  type editPageConfigData,
  type PageConfig,
} from "../../../types/page-config/pageConfigTypes";
import {
  addPageConfig,
  getPageConfigs,
} from "../../../hooks/page-config/pageConfig";

interface AddPageConfigProps {
  initialData?: editPageConfigData;
  isEditing?: boolean;
  parentKey?: string;
  id?: string;
}

const Add = ({
  initialData,
  isEditing = false,
  parentKey,
  id,
}: AddPageConfigProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allSubtabs, setAllSubtabs] = useState<PageConfig[]>([]);

  const { data: subtabsData, isLoading: subtabsLoading } = useQuery({
    queryKey: ["pageConfigs", "subtab", currentPage],
    queryFn: () => getPageConfigs(currentPage.toString(), ["subtab"]),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (subtabsData?.configs) {
      setAllSubtabs((prev) =>
        currentPage === 1
          ? subtabsData.configs
          : [...prev, ...subtabsData.configs],
      );
      if (subtabsData.totalPages > currentPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  }, [subtabsData]);

  const methods = useForm<editPageConfigData>({
    resolver: zodResolver(editPageConfigSchema),
    defaultValues: {
      type: initialData?.type || "solo",
      key: initialData?.key || "",
      displayName: initialData?.displayName || "",
      pathLink: initialData?.pathLink || "",
      order: initialData?.order || 0,
      isUnderMaintenance: initialData?.isUnderMaintenance || false,
      childPages:
        initialData?.type === "maintab" ? initialData?.childPages || [] : [],
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const selectedType = watch("type");
  const selectedChildPageIds = watch("childPages") || [];

  const subtabOptions = useMemo(
    () =>
      allSubtabs.map((subtab: PageConfig) => ({
        value: subtab._id,
        label: `${subtab.displayName} (${subtab.key})`,
      })),
    [allSubtabs],
  );

  const isSubtab =
    selectedType === "subtab" || (initialData?.type === "subtab" && isEditing);
  const isMaintab = selectedType === "maintab";

  const mutation = useMutation<any, Error, editPageConfigData>({
    mutationFn: async (data) => {
      const formattedData: any = {
        type: data.type,
        key: data.key,
        displayName: data.displayName,
        pathLink: data.pathLink,
        order: data.order,
        isUnderMaintenance:
          data.isUnderMaintenance === true ||
          data.isUnderMaintenance === "true",
      };

      if (data.type === "maintab") {
        formattedData.childPages = data.childPages || [];
      }

      if (data.type === "subtab" && parentKey) {
        formattedData.parentKey = parentKey;
      }

      if (isEditing && id) formattedData.id = id;

      return addPageConfig(formattedData);
    },
    onSuccess: () => {
      setModal({
        message: isEditing
          ? "Page configuration updated successfully!"
          : "Page configuration added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["pageConfigs"],
        exact: false,
      });
      reset();
    },
    onError: (error) => {
      setModal({
        message: error.message || "Failed to save page configuration",
        isSuccess: false,
      });
    },
  });

  const handleModalClose = () => {
    setModal(null);
    if (modal?.isSuccess) navigate(-1);
  };

  const onSubmit = (data: editPageConfigData) => mutation.mutate(data);
  const handleChildPagesChange = (selectedIds: string[]) =>
    setValue("childPages", selectedIds);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2xl min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full">
            <h2 className="text-2xl font-bold text-[#1d2087] mb-6">
              {isEditing
                ? "Edit Page Configuration"
                : "Add New Page Configuration"}
            </h2>
            {parentKey && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Parent Page:{" "}
                  <span className="font-semibold">{parentKey}</span>
                </p>
              </div>
            )}
          </div>

          <div className="w-full grid grid-cols-1 gap-4">
            <Input
              disabled={false}
              style="bg-white"
              error={errors.key?.message || ""}
              title="Key"
              placeholder="e.g., visas, tours, happenings"
              type="text"
              {...register("key")}
            />

            <Input
              disabled={false}
              style="bg-white"
              error={errors.displayName?.message || ""}
              title="Display Name"
              placeholder="e.g., Visas, Tours, Happenings"
              type="text"
              {...register("displayName")}
            />

            <Input
              disabled={false}
              style="bg-white"
              error={errors.pathLink?.message || ""}
              title="Path Link"
              placeholder="e.g., /visas, /tours, /happenings"
              type="text"
              {...register("pathLink")}
            />

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Type"
                options={["maintab", "subtab", "solo"]}
                {...register("type")}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <Input
              disabled={false}
              style="bg-white"
              error={errors.order?.message || ""}
              title="Order"
              placeholder="0, 1, 2, 3..."
              type="number"
              {...register("order", { valueAsNumber: true })}
            />

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Under Maintenance"
                options={["false", "true"]}
                {...register("isUnderMaintenance")}
              />
              {errors.isUnderMaintenance && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {typeof errors.isUnderMaintenance === "string"
                    ? errors.isUnderMaintenance
                    : errors.isUnderMaintenance.message}
                </p>
              )}
            </div>

            {isMaintab && !isSubtab && (
              <div className="w-full mt-2">
                {subtabsLoading && allSubtabs.length === 0 ? (
                  <div className="w-full p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Loading subtabs...</p>
                  </div>
                ) : (
                  <MultiSelect
                    title="Child Pages (Subtabs)"
                    options={subtabOptions}
                    selectedValues={selectedChildPageIds}
                    onChange={handleChildPagesChange}
                    placeholder="Select subtabs to link to this main tab"
                    error={errors.childPages?.message || ""}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Select subtabs that will appear as dropdown options under this
                  main tab
                </p>
              </div>
            )}

            {isMaintab &&
              selectedChildPageIds.length > 0 &&
              !subtabsLoading && (
                <div className="w-full p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium mb-2">
                    Selected Subtabs ({selectedChildPageIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedChildPageIds.map((id) => {
                      const subtab = allSubtabs.find((s) => s._id === id);
                      return subtab ? (
                        <span
                          key={id}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          {subtab.displayName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

            {selectedType === "subtab" && (
              <div className="w-full p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Subtabs are child pages. They must be linked to a main tab
                  to appear in the navigation.
                  {!parentKey &&
                    " You can link this subtab to a main tab from the main tab's configuration."}
                </p>
              </div>
            )}

            <Button
              isLoading={mutation.isPending}
              title={
                isEditing
                  ? "Update Page Configuration"
                  : "Add Page Configuration"
              }
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>

      {modal && (
        <Modal
          message={modal.message}
          success={modal.isSuccess}
          action={handleModalClose}
        />
      )}
    </>
  );
};

export default Add;
