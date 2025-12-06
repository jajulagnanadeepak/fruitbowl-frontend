// Shared weekly plan data that can be edited by admin
export interface DayPlan {
  day: string;
  fruits: string[];
  vegetables: string[];
  sprouts: string;
  bgColor: string;
}

// Default weekly plan data
let weeklyPlanData: DayPlan[] = [
  {
    day: 'Monday',
    fruits: ['Apple', 'Banana', 'Orange', 'Grapes'],
    vegetables: ['Spinach', 'Cucumber'],
    sprouts: 'Eat Well',
    bgColor: 'bg-green-100/90 border-green-400',
  },
  {
    day: 'Tuesday',
    fruits: ['Mango', 'Pineapple', 'Kiwi', 'Berries'],
    vegetables: ['Carrots', 'Bell Pepper'],
    sprouts: 'Eat Well',
    bgColor: 'bg-orange-100/90 border-orange-400',
  },
  {
    day: 'Wednesday',
    fruits: ['Peach', 'Plum', 'Melon', 'Cherry'],
    vegetables: ['Kale', 'Tomato'],
    sprouts: 'Eat Well',
    bgColor: 'bg-red-100/90 border-red-400',
  },
  {
    day: 'Thursday',
    fruits: ['Watermelon', 'Papaya', 'Lime', 'Lychee'],
    vegetables: ['Broccoli', 'Zucchini'],
    sprouts: 'Eat Well',
    bgColor: 'bg-blue-100/90 border-blue-400',
  },
  {
    day: 'Friday',
    fruits: ['Pear', 'Strawberry', 'Blueberry', 'Fig'],
    vegetables: ['Cabbage', 'Cauliflower'],
    sprouts: 'Eat Well',
    bgColor: 'bg-purple-100/90 border-purple-400',
  },
  {
    day: 'Saturday',
    fruits: ['Dates', 'Apricot', 'Avocado', 'Coconut'],
    vegetables: ['Sweet Potato', 'Radish'],
    sprouts: 'Eat Well',
    bgColor: 'bg-yellow-100/90 border-yellow-400',
  },
  {
    day: 'Sunday',
    fruits: ['Pomegranate', 'Grapefruit', 'Persimmon', 'Dragon Fruit'],
    vegetables: ['Asparagus', 'Mushroom'],
    sprouts: 'Eat Well',
    bgColor: 'bg-teal-100/90 border-teal-400',
  },
];

// Load from localStorage if available
const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('weekly_plan_data');
    if (stored) {
      try {
        weeklyPlanData = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load weekly plan from storage', e);
      }
    }
  }
};

// Save to localStorage
const saveToStorage = (data: DayPlan[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('weekly_plan_data', JSON.stringify(data));
  }
};

// Initialize on load
loadFromStorage();

// Export functions to get and update data
export const getWeeklyPlan = (): DayPlan[] => {
  return weeklyPlanData;
};

export const updateWeeklyPlan = (data: DayPlan[]): void => {
  weeklyPlanData = data;
  saveToStorage(data);
};

export const updateDayPlan = (day: string, plan: DayPlan): void => {
  const index = weeklyPlanData.findIndex(p => p.day === day);
  if (index !== -1) {
    weeklyPlanData[index] = plan;
    saveToStorage(weeklyPlanData);
  }
};

