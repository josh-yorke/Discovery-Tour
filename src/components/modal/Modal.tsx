import { RiChatCheckFill, RiChatDeleteFill, RiCloseLine } from "react-icons/ri";

interface ModalProps {
  message: string;
  success: boolean;
  action: () => void;
}

const Modal = ({ message, success, action }: ModalProps) => {
  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black/10 z-sticky flex items-center justify-center">
      <div className="w-60 bg-white flex flex-col items-center justify-center text-sm p-6 rounded-lg gap-6">
        <div className="w-full flex flex-row items-center justify-between">
          <p
            className={`${
              success ? "text-[#1d2087]" : "text-red-600"
            } text-xs font-semibold`}
          >
            {success ? "Success" : "Error"}
          </p>
          <RiCloseLine size={18} onClick={action} className="cursor-pointer" />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          {success ? (
            <RiChatCheckFill size={40} className="text-[#1d2087]" />
          ) : (
            <RiChatDeleteFill size={40} className="text-red-600" />
          )}
          <p className="text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
