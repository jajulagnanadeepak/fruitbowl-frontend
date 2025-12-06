import * as React from "react";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isBefore, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Anchor + utils for 7-day feedback interval
const ANCHOR_DATE = new Date(2025, 0, 1); // Jan 1, 2025
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isFeedbackDay = (date: Date): boolean => {
  const daysDiff = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate())) / MS_PER_DAY);
  return ((daysDiff % 7) + 7) % 7 === 0; // every 7 days
};

const WeekdayHeader: React.FC = () => (
  <>
    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
      <div key={d} className="text-xs font-medium text-muted-foreground">{d}</div>
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
  const isPast = isBefore(date, today) && !isSameDay(date, today);
  const isCurrentWeek = isSameDay(date, today) || (isAfter(date, addDays(today, -3)) && isBefore(date, addDays(today, 3)));
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
    feedback ? "hover:border-primary/80" : "hover:bg-muted/50"
  ].filter(Boolean).join(" ");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={classes} onClick={() => onSelect(date)}>
            <div className="font-semibold">{format(date, 'd')}</div>
            <div className="text-xs text-muted-foreground">{format(date, 'MMM')}</div>

            {feedback && (
              <div className="mt-2 flex items-center justify-center">
                {/* Mobile compact FD button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const iso = date.toISOString().slice(0,10);
                    navigate(`/dates?date=${iso}`);
                  }}
                  className="md:hidden inline-flex items-center justify-center w-8 h-6 text-xs font-semibold text-primary bg-primary/10 rounded-md"
                >
                  FD
                </button>

                {/* Desktop full badge */}
                <span className="hidden md:inline-block mt-2 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Feedback Day
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {feedback ? "Feedback day! Click to provide feedback" : `Next feedback: ${format(getNextFeedbackDate(date), 'MMMM d')}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  // simple auth redirect preserved from original code
  const loggedIn = typeof window !== 'undefined' && !!localStorage.getItem('sd_logged_in');
  if (!loggedIn) {
    navigate('/login');
    return null;
  }

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
    if (isFeedbackDay(date)) {
      const iso = date.toISOString().slice(0, 10);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      // Only allow feedback on today's date
      if (!isSameDay(date, today)) {
        if (isBefore(date, today)) {
          toast({ title: "Past Date", description: "Cannot submit feedback for past dates." });
        } else {
          toast({ title: "Future Date", description: "Cannot submit feedback for future dates. Only today's feedback is allowed." });
        }
        return;
      }

      // Check if feedback already submitted
      const submittedDates = JSON.parse(localStorage.getItem('sd_feedback_submitted_dates') || '[]');
      if (submittedDates.includes(iso)) {
        toast({ title: "Already Submitted", description: "Feedback for this date has already been submitted." });
        return;
      }

      navigate(`/feedback?date=${iso}`);
    }
  };

  return (
    <div className="p-6 bg-background rounded-lg relative">
      {/* Back button inside header area */}
      <div className="absolute left-4 top-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            toast({ title: "Already logged in", description: "You're already authenticated." });
            navigate('/home');
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      <h2 className="text-lg font-semibold mb-4 text-center">Your Calendar & Feedback</h2>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        <WeekdayHeader />
        {calendar.map((date) => (
          <DayCell key={date.toISOString()} date={date} today={today} onSelect={handleDaySelect} />
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm">Selected: {selectedDate ? format(selectedDate, 'PPP') : 'None'}</p>
      </div>
    </div>
  );
};

export default Calendar;
