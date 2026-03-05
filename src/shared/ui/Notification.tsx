import { cn } from "../lib/tailwind";

interface NotificationProps {
  className?: string;
  text: React.ReactNode | string;
}

const Notification = ({ className, text }: NotificationProps) => {
  return (
    <div
      className={cn(
        "rounded-[12px] bg-[#5724F0]/40 px-[16px] py-[12px] text-[14px]",
        className,
      )}
    >
      {text}
    </div>
  );
};

export default Notification;
