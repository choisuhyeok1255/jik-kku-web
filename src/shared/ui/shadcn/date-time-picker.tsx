"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";

import { cn } from "@/src/shared/lib/tailwind";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Calendar } from "@/src/shared/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/ui/shadcn/popover";

export interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** 시간 선택 숨김 (날짜만) */
  hideTime?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function DateTimePicker({
  value,
  onChange,
  placeholder = "날짜와 시간 선택",
  disabled,
  className,
  hideTime = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [hour, setHour] = React.useState(value?.getHours() ?? 23);
  const [minute, setMinute] = React.useState(value?.getMinutes() ?? 59);

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
      setHour(value.getHours());
      setMinute(value.getMinutes());
    } else {
      setDate(undefined);
      setHour(23);
      setMinute(59);
    }
  }, [value, open]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const newDate = hideTime
      ? selectedDate
      : setMinutes(setHours(new Date(selectedDate), hour), minute);
    setDate(newDate);
    if (hideTime) {
      onChange?.(newDate);
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    if (!date) return;
    const newDate = hideTime ? date : setMinutes(setHours(date, hour), minute);
    onChange?.(newDate);
    setOpen(false);
  };

  const displayValue = React.useMemo(() => {
    if (!date) return null;
    const displayDate = hideTime
      ? date
      : setMinutes(setHours(new Date(date), hour), minute);
    return hideTime
      ? format(displayDate, "yyyy-MM-dd")
      : format(displayDate, "yyyy-MM-dd HH:mm");
  }, [date, hour, minute, hideTime]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-[48px] w-full justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4 font-normal",
            !displayValue && "text-white/60",
            className,
          )}
        >
          {displayValue ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border border-white/10 bg-[#171717] p-0"
        align="start"
      >
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            classNames={{ root: "bg-transparent" }}
            formatters={{
              formatCaption: (d) => {
                const year = d.getFullYear();
                const month = d.getMonth() + 1;
                return `${year}년 ${month}월`;
              },
            }}
          />
          {!hideTime && date && (
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
              <div className="flex flex-1 items-center gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white [&>option]:bg-[#171717]"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}시
                    </option>
                  ))}
                </select>
                <span className="text-white/60">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white [&>option]:bg-[#171717]"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                className="shrink-0 bg-[#5724F0] hover:bg-[#5724F0]/90"
              >
                확인
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
