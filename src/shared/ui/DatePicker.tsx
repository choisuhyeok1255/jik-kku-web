"use client";

import dayjs from "dayjs";
import { useState } from "react";

import { cn } from "../lib/tailwind";
import Calendar from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";

type DatePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  minDate?: string;
};

const DatePicker = ({
  value,
  onChange,
  placeholder = "날짜 선택",
  className,
  minDate,
  triggerClassName,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const handleChange = (
    dateValue: Date | [Date | null, Date | null] | null,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    void event;
    if (dateValue === null) {
      onChange(null);
    } else {
      const dateObj = Array.isArray(dateValue) ? dateValue[0] : dateValue;
      onChange(dateObj ? dayjs(dateObj).format("YYYY-MM-DD") : null);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-[48px] rounded-[20px] border border-[#373737] bg-[#212121] px-[12px] py-[8px] text-left text-[14px] text-white",
            !value && "text-white/60",
            triggerClassName,
          )}
        >
          {value ?? placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn("border-none bg-[#212121]", className)}>
        <Calendar
          value={value ? dayjs(value).toDate() : undefined}
          minDate={minDate ? dayjs(minDate).toDate() : undefined}
          onChange={handleChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
