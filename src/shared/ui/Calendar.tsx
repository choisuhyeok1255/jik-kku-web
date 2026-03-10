"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCalendar from "react-calendar";
import { cn } from "../lib/tailwind";
import "./Calendar.css";

const SWIPE_THRESHOLD = 50;
const MIN_DATE = new Date(2023, 0, 1);

const toDate = (v: unknown): Date => {
  if (v instanceof Date) return v;
  if (Array.isArray(v) && v.length > 0) {
    const first = v[0];
    if (first instanceof Date) return first;
    if (typeof first === "string") return new Date(first);
  }
  if (typeof v === "string") return new Date(v);
  return new Date();
};

type CalendarProps = React.ComponentProps<typeof ReactCalendar>;

const Calendar = ({ className, value, ...props }: CalendarProps) => {
  const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
    const base = toDate(value);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const touchStartX = useRef<number>(0);
  const lastSyncedMonthRef = useRef<string>("");

  useEffect(() => {
    const date = toDate(value);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthKey !== lastSyncedMonthRef.current) {
      lastSyncedMonthRef.current = monthKey;
      setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

  const goToPrevMonth = useCallback(() => {
    setActiveStartDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return next >= MIN_DATE ? next : prev;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setActiveStartDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        if (deltaX > 0) goToPrevMonth();
        else goToNextMonth();
        e.preventDefault();
      }
    },
    [goToPrevMonth, goToNextMonth],
  );

  return (
    <div
      className="calendar-swipe-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ReactCalendar
        className={cn(className, "calendar-custom")}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        prevLabel={<ChevronLeftIcon size={24} />}
        nextLabel={<ChevronRightIcon size={24} />}
        minDetail="month"
        maxDetail="month"
        minDate={MIN_DATE}
        formatDay={(_, date) => date.getDate().toString()}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate: next }) => {
          if (next) setActiveStartDate(next);
        }}
        value={value}
        {...props}
      />
    </div>
  );
};

export default Calendar;
