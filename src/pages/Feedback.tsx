import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { format, isSameDay, isBefore, isAfter } from "date-fns";

// Anchor for 7-day cycle
const ANCHOR_DATE = new Date(2025, 11, 6); // Dec 6, 2025 is feedback day
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isFeedbackDay = (date: Date): boolean => {
  const daysDiff = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(
        ANCHOR_DATE.getFullYear(),
        ANCHOR_DATE.getMonth(),
        ANCHOR_DATE.getDate()
      )) /
    MS_PER_DAY
  );
  return ((daysDiff % 7) + 7) % 7 === 0;
};

// ls functions
const checkIfFeedbackSubmitted = (date: string): boolean => {
  return JSON.parse(localStorage.getItem("sd_feedback_submitted_dates") || "[]").includes(date);
};

const markFeedbackAsSubmitted = (date: string) => {
  const arr = JSON.parse(localStorage.getItem("sd_feedback_submitted_dates") || "[]");
  if (!arr.includes(date)) {
    arr.push(date);
    localStorage.setItem("sd_feedback_submitted_dates", JSON.stringify(arr));
  }
};

const Feedback = () => {
  const [params] = useSearchParams();
  const dateParam = params.get("date");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("Complaints");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  // Validate
  useEffect(() => {
    if (!dateParam) {
      toast({ title: "Invalid Date", description: "No date provided." });
      setTimeout(() => navigate("/calendar"), 20);
      return;
    }

    const feedbackDate = new Date(dateParam);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    feedbackDate.setHours(0, 0, 0, 0);

    if (!isSameDay(feedbackDate, today)) {
      toast({
        title: "Invalid Date",
        description: isBefore(feedbackDate, today)
          ? "Cannot submit feedback for past dates."
          : "Cannot submit feedback for future dates.",
      });
      setTimeout(() => navigate("/calendar"), 20);
      return;
    }

    if (!isFeedbackDay(feedbackDate)) {
      toast({
        title: "Not a Feedback Day",
        description: "Feedback is only allowed on designated days.",
      });
      setTimeout(() => navigate("/calendar"), 20);
      return;
    }

    if (checkIfFeedbackSubmitted(dateParam)) {
      setIsSubmitted(true);
      toast({
        title: "Already Submitted",
        description: "Feedback for this date is already submitted.",
      });
    } else {
      setIsValidDate(true);
    }

    const stored = localStorage.getItem("sd_feedback_demo");
    if (stored) {
      const obj = JSON.parse(stored);
      setFullName(obj.name || "");
      setLocation(obj.location || "");
    }
  }, [dateParam, navigate]);

  const handleSend = async () => {
    if (isSubmitted || !isValidDate || !dateParam) return;

    const payload = {
      date: dateParam,
      fullName,
      location,
      subject,
      rating: Number(rating),
      message,
      createdAt: new Date().toISOString(),
    };

    const apiBase =
      (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
    const endpoint = `${apiBase.replace(/\/$/, "")}/api/feedback`;

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        markFeedbackAsSubmitted(dateParam);
        setIsSubmitted(true);
        toast({ title: "Feedback sent", description: "Thank you!" });
      } else {
        const local = JSON.parse(localStorage.getItem("sd_feedbacks") || "[]");
        local.push(payload);
        localStorage.setItem("sd_feedbacks", JSON.stringify(local));
        toast({
          title: "Server Error",
          description: "Saved locally. Will retry later.",
        });
      }

      setTimeout(() => navigate("/calendar"), 1200);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("sd_feedbacks") || "[]");
      local.push(payload);
      localStorage.setItem("sd_feedbacks", JSON.stringify(local));

      toast({
        title: "Offline Mode",
        description: "Feedback saved locally.",
      });

      setTimeout(() => navigate("/calendar"), 1200);
    } finally {
      setLoading(false);
    }
  };

  // Submitted Message UI
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-2xl bg-card rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600">
            Feedback Already Submitted
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {`Feedback for ${format(new Date(dateParam || ""), "MMMM d, yyyy")}`}
            {" has already been submitted."}
          </p>
          <Button className="mt-4" onClick={() => navigate("/calendar")}>
            Back to Calendar
          </Button>
        </div>
      </div>
    );
  }

  if (!isValidDate) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="w-full max-w-2xl bg-card rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold">Send Feedback</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {`Feedback for ${format(new Date(dateParam || ""), "MMMM d, yyyy")}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subject</label>
            <select
              className="w-full p-2 rounded border"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
            >
              <option>Complaints</option>
              <option>Compliment</option>
              <option>Suggestions</option>
              <option>Enquiry</option>
              <option>General</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={loading}
                  onClick={() => setRating(Number(s))}
                  className={`text-2xl ${
                    s <= rating ? "text-yellow-400" : "text-muted-foreground"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write feedback..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" disabled={loading} onClick={() => navigate("/calendar")}>
            Back
          </Button>
          <Button
            disabled={loading || !fullName || !message}
            onClick={handleSend}
          >
            {loading ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
