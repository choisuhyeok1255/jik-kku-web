import ReactCalendar from "react-calendar";
import { cn } from "../lib/tailwind";
import "./Calendar.css";

type CalendarProps = React.ComponentProps<typeof ReactCalendar>;

const Calendar = ({ className, ...props }: CalendarProps) => {
  return (
    <ReactCalendar
      className={cn(className, "calendar-custom")}
      calendarType="gregory"
      prev2Label={null}
      next2Label={null}
      minDetail="month"
      maxDetail="month"
      minDate={new Date(2023, 0, 1)}
      {...props}
    />
  );
};

export default Calendar;
