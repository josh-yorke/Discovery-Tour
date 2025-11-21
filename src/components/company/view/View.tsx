import {
  companyDetailSchema,
  type companyDetail,
} from "../../../types/company/companyDataTypes";
import TextArea from "../../input/TextArea";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../input/Input";

const View = ({
  name,
  tagline,
  about,
  mission,
  vision,
  coreValues,
}: companyDetail) => {
  const methods = useForm<companyDetail>({
    resolver: zodResolver(companyDetailSchema),
    defaultValues: {
      name,
      tagline,
      about,
      mission,
      vision,
      coreValues,
    },
  });

  const { register } = methods;

  return (
    <>
      <FormProvider {...methods}>
        <form className="w-full lg:w-2xl flex flex-col items-center justify-center gap-4">
          <Input
            type="text"
            disabled={true}
            title="Name"
            placeholder=""
            error=""
            {...register("name")}
          />
          <Input
            type="text"
            disabled={true}
            title="Tagline"
            placeholder=""
            error=""
            {...register("tagline")}
          />
          <Input
            type="text"
            disabled={true}
            title="Core Values"
            placeholder=""
            error=""
            {...register("coreValues")}
          />
          <TextArea
            disabled={true}
            title="About"
            placeholder=""
            error=""
            {...register("about")}
          />
          <TextArea
            disabled={true}
            title="Mission"
            placeholder=""
            error=""
            {...register("mission")}
          />
          <TextArea
            disabled={true}
            title="Vision"
            placeholder=""
            error=""
            {...register("vision")}
          />
        </form>
      </FormProvider>
    </>
  );
};

export default View;
