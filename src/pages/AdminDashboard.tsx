import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWeeklyPlan, updateDayPlan, DayPlan } from "@/data/weeklyPlanData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, LogOut, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editedPlan, setEditedPlan] = useState<DayPlan | null>(null);

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = localStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin-18xn9-secret");
      return;
    }

    // Load weekly plan data
    setWeeklyPlan(getWeeklyPlan());
  }, [navigate]);

  const handleEdit = (day: string) => {
    const plan = weeklyPlan.find(p => p.day === day);
    if (plan) {
      setEditingDay(day);
      setEditedPlan({ ...plan });
    }
  };

  const handleSave = () => {
    if (editedPlan && editingDay) {
      updateDayPlan(editingDay, editedPlan);
      setWeeklyPlan(getWeeklyPlan());
      setEditingDay(null);
      setEditedPlan(null);
      toast({
        title: "Success",
        description: `${editingDay} plan updated successfully!`,
      });
    }
  };

  const handleCancel = () => {
    setEditingDay(null);
    setEditedPlan(null);
  };

  const handleAddFruit = () => {
    if (editedPlan) {
      setEditedPlan({
        ...editedPlan,
        fruits: [...editedPlan.fruits, ""],
      });
    }
  };

  const handleRemoveFruit = (index: number) => {
    if (editedPlan) {
      setEditedPlan({
        ...editedPlan,
        fruits: editedPlan.fruits.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddVegetable = () => {
    if (editedPlan) {
      setEditedPlan({
        ...editedPlan,
        vegetables: [...editedPlan.vegetables, ""],
      });
    }
  };

  const handleRemoveVegetable = (index: number) => {
    if (editedPlan) {
      setEditedPlan({
        ...editedPlan,
        vegetables: editedPlan.vegetables.filter((_, i) => i !== index),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin-18xn9-secret");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Edit Weekly Fruit Bowl Plan</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Weekly Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyPlan.map((plan) => (
            <div
              key={plan.day}
              className={`p-6 rounded-xl shadow-lg border-b-4 ${plan.bgColor} bg-white`}
            >
              {editingDay === plan.day && editedPlan ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.day}</h3>

                  {/* Fruits */}
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      4 Fruits:
                    </label>
                    <div className="space-y-2">
                      {editedPlan.fruits.map((fruit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={fruit}
                            onChange={(e) => {
                              const newFruits = [...editedPlan.fruits];
                              newFruits[index] = e.target.value;
                              setEditedPlan({ ...editedPlan, fruits: newFruits });
                            }}
                            placeholder={`Fruit ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFruit(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFruit}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Fruit
                      </Button>
                    </div>
                  </div>

                  {/* Vegetables */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo-700 mb-2">
                      2 Veggies:
                    </label>
                    <div className="space-y-2">
                      {editedPlan.vegetables.map((veg, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={veg}
                            onChange={(e) => {
                              const newVeggies = [...editedPlan.vegetables];
                              newVeggies[index] = e.target.value;
                              setEditedPlan({ ...editedPlan, vegetables: newVeggies });
                            }}
                            placeholder={`Vegetable ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVegetable(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddVegetable}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Vegetable
                      </Button>
                    </div>
                  </div>

                  {/* Sprouts */}
                  <div>
                    <label className="block text-sm font-semibold text-amber-700 mb-2">
                      Sprouts:
                    </label>
                    <Input
                      value={editedPlan.sprouts}
                      onChange={(e) =>
                        setEditedPlan({ ...editedPlan, sprouts: e.target.value })
                      }
                      placeholder="Sprouts message"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{plan.day}</h3>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-green-700 mb-1">4 Fruits:</p>
                    <p className="text-gray-600 text-sm">{plan.fruits.join(", ")}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-indigo-700 mb-1">2 Veggies:</p>
                    <p className="text-gray-600 text-sm">{plan.vegetables.join(", ")}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Sprouts:</p>
                    <p className="text-gray-600 text-sm">{plan.sprouts}</p>
                  </div>
                  <Button onClick={() => handleEdit(plan.day)} className="w-full">
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Note:</p>
          <p>Changes are saved to localStorage and will reflect on the Dates page immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

