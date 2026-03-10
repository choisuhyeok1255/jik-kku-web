import { cn } from "@/src/shared/lib/tailwind";
import { Tabs, TabsList, TabsTrigger } from "./shadcn/tabs";

const AppTab = ({
  className,
  currentTab,
  tabItems,
  handleChangeTab,
}: {
  className?: string;
  currentTab: string;
  tabItems: { label: string; value: string }[];
  handleChangeTab: (tab: string) => void;
}) => {
  return (
    <Tabs
      className={cn("block", className)}
      value={currentTab}
      onValueChange={handleChangeTab}
    >
      <TabsList className="h-[44px] w-full rounded-[999px] border border-[#373737] bg-[#212121]">
        {tabItems.map((item) => (
          <TabsTrigger
            className="h-[36px] w-full cursor-pointer rounded-[999px] text-[14px] leading-[20px] font-bold text-white/40 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default AppTab;
