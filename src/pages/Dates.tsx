import React, { useState, useEffect } from 'react';
import { Utensils, Zap, Leaf, ArrowLeft } from 'lucide-react'; // Using lucide-react for icons
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getWeeklyPlan, DayPlan } from '@/data/weeklyPlanData';

// 3. Daily Card Component
const DailyPlanCard: React.FC<{ plan: DayPlan }> = ({ plan }) => (
  <div
    className={`p-6 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl h-full border-b-4 ${plan.bgColor}`}
  >
    {/* Day Title */}
    <h3 className="text-2xl font-extrabold mb-3 text-gray-800 border-b pb-2 border-gray-300">
      {plan.day}
    </h3>

    {/* Fruits Section */}
    <div className="mb-4">
      <div className="flex items-center text-lg font-semibold text-green-700 mb-1">
        <Utensils className="w-5 h-5 mr-2 text-green-600" />
        4 Fruits:
      </div>
      <p className="text-gray-600 ml-7">{plan.fruits.join(', ')}</p>
    </div>

    {/* Vegetables Section */}
    <div className="mb-4">
      <div className="flex items-center text-lg font-semibold text-indigo-700 mb-1">
        <Zap className="w-5 h-5 mr-2 text-indigo-600" />
        2 Veggies:
      </div>
      <p className="text-gray-600 ml-7">{plan.vegetables.join(', ')}</p>
    </div>

    {/* Sprouts Section */}
    <div>
      <div className="flex items-center text-lg font-semibold text-amber-700 mb-1">
        <Leaf className="w-5 h-5 mr-2 text-amber-600" />
        Sprouts:
      </div>
      <p className="text-gray-600 ml-7">{plan.sprouts}</p>
    </div>
  </div>
);

// 4. Main App Component
const App: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);

  useEffect(() => {
    // Load weekly plan data
    setWeeklyPlan(getWeeklyPlan());
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      setWeeklyPlan(getWeeklyPlan());
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for changes (since same-tab updates don't trigger storage event)
    const interval = setInterval(() => {
      setWeeklyPlan(getWeeklyPlan());
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 sm:p-8 font-sans">
      
      {/* Header */}
      <header className="relative text-center mb-10 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
        {/* Back Button for mobile (placed above heading) */}
        <div className="md:hidden flex justify-start mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Back Button for desktop (absolute, left center) */}
        <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-gray-800 tracking-tight mt-4 md:mt-0">
          Your Weekly Fruit Bowl Plan
        </h1>
        <p className="text-xl mt-2 text-gray-500">
          4 Fruits, 2 Veggies, and Sprouts for a healthy week!
        </p>
      </header>

      {/* Daily Plan Grid */}
      {/* Responsive Grid: 1 column on mobile, 2 on medium, 3 on large */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {weeklyPlan.map((plan) => (
          <DailyPlanCard key={plan.day} plan={plan} />
        ))}
      </main>
      
      {/* Footer / Note */}
      <footer className="text-center mt-12 text-gray-500 text-sm italic">
          <p>
              Remember to hydrate! This plan is a guideline; adjust portions based on Season of Fresh Fruits .
          </p>
      </footer>
    </div>
  );
};

export default App;
