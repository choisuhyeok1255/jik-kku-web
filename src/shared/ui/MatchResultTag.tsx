import { cn } from "../lib/tailwind";

/**
 * @param isVictory true: 승리, false: 패배, null: 무승부
 */
interface MatchResultTagProps {
  className?: string;
  isVictory: boolean | null;
}

const MatchResultTag = ({ className, isVictory }: MatchResultTagProps) => {
  const getStyle = () => {
    if (isVictory === true) return "bg-[#C6E90033] text-[#C6E900]";
    if (isVictory === false) return "bg-[#FF153833] text-[#FF1538]";
    return "bg-white/20 text-white";
  };

  const getLabel = () => {
    if (isVictory === true) return "승리";
    if (isVictory === false) return "패배";
    return "무승부";
  };

  return (
    <span
      className={cn(
        "inline-flex h-[24px] w-[64px] items-center justify-center rounded-[999px] text-[14px]",
        getStyle(),
        className,
      )}
    >
      {getLabel()}
    </span>
  );
};

export default MatchResultTag;
