import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import PageLoader from "../../loader/PageLoader";
import {
  getScraperConfig,
  editScraperConfig,
} from "../../../hooks/scraper/scraper";
import {
  editScraperConfigSchema,
  type editScraperConfigData,
} from "../../../types/scraper/editScraperConfigTypes";
import CronInput from "../../input/CronInput";

const Edit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["scraper-config"],
    queryFn: () => getScraperConfig(),
  });

  const methods = useForm<editScraperConfigData>({
    resolver: zodResolver(editScraperConfigSchema),
    defaultValues: {
      smbcInterval: "",
      frankfurterInterval: "",
      isMainSourceUSDJPY: false,
    },
  });

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const smbcInterval = watch("smbcInterval");
  const frankfurterInterval = watch("frankfurterInterval");
  const isMainSourceUSDJPY = watch("isMainSourceUSDJPY");

  // Extract the actual config data from the response
  const scraperConfig = response?.data;

  useEffect(() => {
    if (!scraperConfig) return;

    reset({
      smbcInterval: scraperConfig.smbc?.intervalCronFormat || "",
      frankfurterInterval: scraperConfig.frankfurter?.intervalCronFormat || "",
      isMainSourceUSDJPY: scraperConfig.smbc?.isMainSourceforUSDJPY ?? false,
    });
  }, [scraperConfig, reset]);

  const mutation = useMutation({
    mutationFn: (data: editScraperConfigData) => {
      const updatedConfig = {
        smbc: {
          intervalCronFormat: data.smbcInterval,
          isMainSourceforUSDJPY: data.isMainSourceUSDJPY,
        },
        frankfurter: {
          intervalCronFormat: data.frankfurterInterval,
          isMainSourceforUSDJPY: !data.isMainSourceUSDJPY,
        },
      };
      return editScraperConfig(updatedConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scraper-config"],
        exact: false,
      });
      navigate("/company/scraper");
    },
  });

  const onSubmit = (data: editScraperConfigData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <PageLoader />;

  if (!scraperConfig) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-sm font-normal">No scraper configuration found</p>
      </div>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6"
        >
          <CronInput
            title="SMBC Interval"
            placeholder="0 0 */6 * * *"
            value={smbcInterval}
            onChange={(val) => setValue("smbcInterval", val)}
            error={errors.smbcInterval?.message}
            description="Runs every 6 hours by default"
          />

          <CronInput
            title="Frankfurter Interval"
            placeholder="0 0 */1 * * *"
            value={frankfurterInterval}
            onChange={(val) => setValue("frankfurterInterval", val)}
            error={errors.frankfurterInterval?.message}
            description="Runs every hour by default"
          />

          <div className="w-full flex items-center gap-3">
            <input
              type="checkbox"
              id="isMainSourceUSDJPY"
              checked={isMainSourceUSDJPY}
              onChange={(e) => setValue("isMainSourceUSDJPY", e.target.checked)}
              className="w-4 h-4 text-[#1d2087] rounded border-gray-300 focus:ring-[#1d2087]"
            />
            <label
              htmlFor="isMainSourceUSDJPY"
              className="text-sm font-medium text-gray-700"
            >
              Use SMBC as main source for USD/JPY
            </label>
          </div>
          {errors.isMainSourceUSDJPY && (
            <p className="text-red-500 text-xs mt-1">
              {errors.isMainSourceUSDJPY.message}
            </p>
          )}

          <Button
            isLoading={mutation.isPending}
            title="Update Scraper Configuration"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={false}
          action={() => navigate("/scraper")}
          message={mutation.error.message}
        />
      )}

      {mutation.isSuccess && !mutation.isError && (
        <Modal
          success={true}
          action={() => navigate("/scraper")}
          message="Scraper configuration updated successfully"
        />
      )}
    </>
  );
};

export default Edit;
