import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UtensilsCrossed } from 'lucide-react';
import { getCurrentMealTime } from '@/utils/timeUtils';

const MealSelection = ({ onSubmit, isProcessing, studentName }) => {
  const [mealType, setMealType] = useState(getCurrentMealTime() || 'lunch');
  const [foodPreference, setFoodPreference] = useState('veg');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mealType, foodPreference);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex items-start mb-4">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold">Meal Selection</h2>
          {studentName ? (
            <p className="text-lg text-green-600">Student: {studentName}</p>
          ) : (
            <p className="text-sm text-gray-500">Select meal type and preference</p>
          )}
        </div>
        <div className="w-10 h-10 bg-mess-light rounded-full flex items-center justify-center">
          <UtensilsCrossed className="h-5 w-5 " />
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Meal Type</h3>
            <RadioGroup 
              value={mealType} 
              onValueChange={setMealType} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lunch" id="lunch" />
                <Label htmlFor="lunch">Lunch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dinner" id="dinner" />
                <Label htmlFor="dinner">Dinner</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Food Preference</h3>
            <RadioGroup 
              value={foodPreference} 
              onValueChange={setFoodPreference} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veg" id="veg" />
                <Label htmlFor="veg">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-veg" id="non-veg" />
                <Label htmlFor="non-veg">Non-Vegetarian</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4"
          disabled={isProcessing || !studentName}
        >
          {isProcessing ? "Processing..." : "Mark Attendance"}
        </Button>
      </form>
    </div>
  );
};

export default MealSelection;
