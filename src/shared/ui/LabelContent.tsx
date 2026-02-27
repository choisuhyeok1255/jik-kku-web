import { cn } from "@/src/shared";

const LabelContent = ({
  className,
  label,
  isRequired,
  children,
}: {
  className?: string;
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn(className)}>
      <div className="mb-[4px]">
        {label}
        {isRequired && <span className="ml-[4px] text-red-500">*</span>}
      </div>
      {children}
    </div>
  );
};

export default LabelContent;
