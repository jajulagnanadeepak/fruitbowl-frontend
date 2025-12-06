import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { format, isSameDay, isBefore, isAfter } from "date-fns";

// Check if a date is a feedback day (every 7 days from anchor date)
const ANCHOR_DATE = new Date(2025, 0, 1); // Jan 1, 2025
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const isFeedbackDay = (date: Date): boolean => {
  const daysDiff = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate())) / MS_PER_DAY);
  return ((daysDiff % 7) + 7) % 7 === 0; // every 7 days
};

const checkIfFeedbackSubmitted = (date: string): boolean => {
  const submittedDates = JSON.parse(localStorage.getItem('sd_feedback_submitted_dates') || '[]');
  return submittedDates.includes(date);
};

const markFeedbackAsSubmitted = (date: string): void => {
  const submittedDates = JSON.parse(localStorage.getItem('sd_feedback_submitted_dates') || '[]');
  if (!submittedDates.includes(date)) {
    submittedDates.push(date);
    localStorage.setItem('sd_feedback_submitted_dates', JSON.stringify(submittedDates));
  }
};

const Feedback = () => {
  const [params] = useSearchParams();
  const dateParam = params.get('date');
  const navigate = useNavigate();

  // --- CORRECTED STATE VARIABLE NAMES ---
  const [fullName, setFullName] = useState('');     
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('Complaints');
  const [rating, setRating] = useState(5);         
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    // Validate date and check if feedback already submitted
    if (!dateParam) {
      toast({ title: "Invalid Date", description: "No date provided." });
      navigate('/calendar');
      return;
    }

    const feedbackDate = new Date(dateParam);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    feedbackDate.setHours(0, 0, 0, 0);

    // Check if date is today
    if (!isSameDay(feedbackDate, today)) {
      toast({ 
        title: "Invalid Date", 
        description: isBefore(feedbackDate, today) 
          ? "Cannot submit feedback for past dates." 
          : "Cannot submit feedback for future dates. Only today's feedback is allowed." 
      });
      navigate('/calendar');
      return;
    }

    // Check if it's a feedback day
    if (!isFeedbackDay(feedbackDate)) {
      toast({ title: "Not a Feedback Day", description: "Feedback can only be submitted on designated feedback days." });
      navigate('/calendar');
      return;
    }

    // Check if feedback already submitted
    if (checkIfFeedbackSubmitted(dateParam)) {
      setIsSubmitted(true);
      toast({ title: "Already Submitted", description: "Feedback for this date has already been submitted." });
    } else {
      setIsValidDate(true);
    }

    // pre-fill demo data if available
    const stored = localStorage.getItem('sd_feedback_demo');
    if (stored) {
      const obj = JSON.parse(stored);
      setFullName(obj.name || ''); 
      setLocation(obj.location || '');
    }
  }, [dateParam, navigate]);

  const handleSend = async () => {
    // Prevent resubmission
    if (isSubmitted || !isValidDate || !dateParam) {
      return;
    }

    // --- PAYLOAD WITH CORRECT KEYS (fullName and rating) ---
    const payload = { 
      date: dateParam, 
      fullName, 
      location, 
      subject, 
      rating,   
      message, 
      createdAt: new Date().toISOString() 
    };
    
    const apiBase = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
    const endpoint = `${apiBase.replace(/\/$/, "")}/api/feedback`;
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send the corrected payload
      });

      // Mark as submitted immediately to prevent duplicate submissions
      markFeedbackAsSubmitted(dateParam);
      setIsSubmitted(true);

      if (res.ok) {
        toast({ title: "Feedback sent", description: "Thank you for your feedback!" });
      } else {
        // server responded with an error (e.g., 400 Bad Request) - save locally as fallback
        const all = JSON.parse(localStorage.getItem('sd_feedbacks') || '[]');
        all.push(payload);
        localStorage.setItem('sd_feedbacks', JSON.stringify(all));
        // The server error message is now likely due to validation if CORS is fixed
        toast({ title: "Saved locally", description: "Server error — feedback saved locally." }); 
      }
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/calendar');
      }, 1500);
    } catch (err) {
      // Mark as submitted even on error to prevent duplicate attempts
      markFeedbackAsSubmitted(dateParam);
      setIsSubmitted(true);
      
      // network / CORS or other failure — persist locally
      const all = JSON.parse(localStorage.getItem('sd_feedbacks') || '[]');
      all.push(payload);
      localStorage.setItem('sd_feedbacks', JSON.stringify(all));
      toast({ title: "Saved locally", description: "Could not reach server. Feedback saved locally." });
      
      setTimeout(() => {
        navigate('/calendar');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-2xl bg-card rounded-2xl p-8 shadow-lg text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-green-600">Feedback Already Submitted</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {dateParam ? `Feedback for ${format(new Date(dateParam), 'MMMM d, yyyy')} has already been submitted.` : 'Feedback has already been submitted.'}
            </p>
            <p className="text-xs text-muted-foreground mt-4">You can only submit feedback once per feedback day.</p>
          </div>
          <Button onClick={() => navigate('/calendar')} className="mt-4">Back to Calendar</Button>
        </div>
      </div>
    );
  }

  if (!isValidDate) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="w-full max-w-2xl bg-card rounded-2xl p-8 shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Send Feedback</h2>
          <p className="text-sm text-muted-foreground">{dateParam ? `Feedback for ${format(new Date(dateParam), 'MMMM d, yyyy')}` : 'General feedback'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            {/* --- UPDATED JSX for fullName --- */}
            <Input 
              value={fullName} 
              onChange={(e:any)=>setFullName(e.target.value)} 
              placeholder="John Doe" 
              disabled={isSubmitted || loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input 
              value={location} 
              onChange={(e:any)=>setLocation(e.target.value)} 
              placeholder="City, Country" 
              disabled={isSubmitted || loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subject</label>
            <select 
              value={subject} 
              onChange={(e:any)=>setSubject(e.target.value)} 
              className="w-full p-2 rounded border"
              disabled={isSubmitted || loading}
            >
              <option>Complaints</option>
              <option>Compliment</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center gap-2 mt-2">
              {/* --- UPDATED JSX for rating --- */}
              {[1,2,3,4,5].map((s)=> (
                <button 
                  key={s} 
                  type="button" 
                  onClick={()=>!isSubmitted && !loading && setRating(s)} 
                  className={`text-2xl ${s<=rating? 'text-yellow-400':'text-muted-foreground'} ${isSubmitted || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  disabled={isSubmitted || loading}
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
              onChange={(e:any)=>setMessage(e.target.value)} 
              placeholder="Write your feedback here..." 
              disabled={isSubmitted || loading}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={()=>navigate('/calendar')} disabled={loading}>Back</Button>
          <Button onClick={handleSend} disabled={loading || isSubmitted || !fullName || !message}>
            {loading ? "Sending..." : isSubmitted ? "Already Sent" : "Send Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;