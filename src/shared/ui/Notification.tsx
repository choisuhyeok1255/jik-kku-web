import { cn } from "../lib/tailwind";

interface NotificationProps {
  className?: string;
  text: React.ReactNode | string;
}

const Notification = ({ className, text }: NotificationProps) => {
  return (
    <div className={cn("rounded-[20px] bg-[#5724F0]/40 p-[20px]", className)}>
      {text}
    </div>
  );
};

export default Notification;
