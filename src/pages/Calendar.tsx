import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isBefore, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Anchor date for 7-day pattern
const ANCHOR_DATE = new Date(2025, 0, 1);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isFeedbackDay = (date: Date): boolean => {
  const daysDiff = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate())) /
      MS_PER_DAY
  );
  return ((daysDiff % 7) + 7) % 7 === 0;
};

const WeekdayHeader: React.FC = () => (
  <>
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
      <div key={d} className="text-xs font-medium text-muted-foreground">
        {d}
      </div>
    ))}
  </>
);

const getNextFeedbackDate = (date: Date): Date => {
  let next = addDays(date, 1);
  while (!isFeedbackDay(next) || !isAfter(next, date)) {
    next = addDays(next, 1);
  }
  return next;
};

// Day cell
interface DayCellProps {
  date: Date;
  today: Date;
  onSelect: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, today, onSelect }) => {
  const navigate = useNavigate();
  const isToday = isSameDay(date, today);
  const isPast = isBefore(date, today) && !isToday;
  const isCurrentWeek =
    isToday || (isAfter(date, addDays(today, -3)) && isBefore(date, addDays(today, 3)));

  const feedback = isFeedbackDay(date);

  const classes = [
    "p-3 md:p-4",
    "rounded-lg",
    "cursor-pointer",
    "min-h-[56px] md:min-h-[80px]",
    "relative",
    "transition-all",
    isToday ? "bg-yellow-200" : "",
    isPast ? "bg-red-100" : "",
    isCurrentWeek && !isToday ? "bg-green-100" : "",
    feedback ? "border-2 border-primary shadow-md hover:shadow-lg" : "",
    feedback && !isPast ? "scale-[1.02] hover:scale-[1.03]" : "",
    feedback ? "hover:border-primary/80" : "hover:bg-muted/50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={classes} onClick={() => onSelect(date)}>
            <div className="font-semibold">{format(date, "d")}</div>
            <div className="text-xs text-muted-foreground">{format(date, "MMM")}</div>

            {feedback && (
              <div className="mt-2 flex items-center justify-center">
                {/* Mobile FD Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const iso = date.toISOString().slice(0, 10);
                    navigate(`/dates?date=${iso}`);
                  }}
                  className="md:hidden inline-flex items-center justify-center w-8 h-6 text-xs font-semibold text-primary bg-primary/10 rounded-md"
                >
                  FD
                </button>

                {/* Desktop Badge */}
                <span className="hidden md:inline-block mt-2 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Feedback Day
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {feedback
              ? "Feedback day! Click to provide feedback"
              : `Next feedback: ${format(getNextFeedbackDate(date), "MMMM d")}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Calendar: React.FC = () => {
  const navigate = useNavigate();

  // ✅ FIXED AUTH CHECK — Vercel-safe, no blank page
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setTimeout(() => navigate("/login"), 20); // small delay avoids Vercel crash
    }
  }, [navigate]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const today = new Date();

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const calendar = useMemo(() => {
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    const days: Date[] = [];

    let d = start;
    while (isBefore(d, end) || isSameDay(d, end)) {
      days.push(new Date(d));
      d = addDays(d, 1);
    }

    return days;
  }, [monthStart, monthEnd]);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);

    // Only allow feedback days
    if (isFeedbackDay(date)) {
      const iso = date.toISOString().slice(0, 10);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      // Only today's feedback allowed
      if (!isSameDay(date, today)) {
        toast({
          title: isBefore(date, today) ? "Past Date" : "Future Date",
          description:
            isBefore(date, today)
              ? "Cannot submit feedback for past dates."
              : "Cannot submit feedback for future dates.",
        });
        return;
      }

      // Prevent duplicate submissions
      const submittedDates = JSON.parse(
        localStorage.getItem("sd_feedback_submitted_dates") || "[]"
      );
      if (submittedDates.includes(iso)) {
        toast({
          title: "Already Submitted",
          description: "Feedback for this date has already been submitted.",
        });
        return;
      }

      navigate(`/feedback?date=${iso}`);
    }
  };

  return (
    <div className="p-6 bg-background rounded-lg relative">
      <div className="absolute left-4 top-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-center">
        Your Calendar & Feedback
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        <WeekdayHeader />
        {calendar.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            today={today}
            onSelect={handleDaySelect}
          />
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm">
          Selected: {selectedDate ? format(selectedDate, "PPP") : "None"}
        </p>
      </div>
    </div>
  );
};

export default Calendar;
