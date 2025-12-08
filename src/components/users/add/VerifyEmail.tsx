import { RiChatCheckFill, RiCloseLine } from "react-icons/ri";
import Input from "../../input/Input";
import Button from "../../button/Button";
import { useForm } from "react-hook-form";

interface ModalProps {
  message: string;
  code: string;
  action: () => void;
  onVerify: () => void;
}

interface FormValues {
  codeInput: string;
}

const VerifyEmail = ({ message, action, code, onVerify }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    if (data.codeInput.trim() === code) {
      onVerify();
    } else {
      setError("codeInput", { message: "Invalid verification code" });
    }
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black/10 flex items-center justify-center">
      <div className="w-[320px] bg-white flex flex-col items-center justify-center text-sm p-6 rounded-lg gap-6">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[#1d2087]">Success</p>
          <RiCloseLine size={18} onClick={action} className="cursor-pointer" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center justify-center gap-4 text-center"
        >
          <RiChatCheckFill size={40} className="text-[#1d2087]" />
          <p>{message}</p>
          <Input
            style=""
            disabled={false}
            title="Code"
            type="text"
            placeholder="verification code"
            {...register("codeInput")}
            error={errors.codeInput?.message || ""}
          />
          <Button
            isLoading={false}
            title="Verify"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300"
          />
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
