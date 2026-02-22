import React from "react";
import { cn } from "../lib/tailwind";

const Modal = ({
  className,
  children,
  handleCloseModal,
}: {
  className?: string;
  children: React.ReactNode;
  handleCloseModal?: () => void;
}) => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 z-9999 bg-[#000000]/60">
      {}
      <div
        className={cn(
          "absolute right-0 bottom-[11px] left-0 mx-auto flex h-[80%] max-h-[748px] min-h-0 w-[calc(100%-32px)] flex-col rounded-[20px] bg-[#181818] pt-[40px] pr-[24px] pb-[32px] pl-[24px]",
          className,
        )}
      >
        {handleCloseModal && (
          <button
            className="absolute top-[8px] right-[8px] h-[28px] w-[28px]"
            type="button"
            onClick={handleCloseModal}
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
