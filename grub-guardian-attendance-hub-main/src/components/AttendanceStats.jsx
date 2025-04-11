
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { UsersRound, UserCheck, UserX, UtensilsCrossed, Salad } from 'lucide-react';

const AttendanceStats = ({ stats }) => {
  const [currentTab, setCurrentTab] = useState('overall');

  if (!stats) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  // Calculate percentages
  const presentPercentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
  const absentPercentage = stats.total > 0 ? (stats.absent / stats.total) * 100 : 0;
  
  const lunchPresent = stats.byMeal?.lunch?.present || 0;
  const lunchPercentage = stats.total > 0 ? (lunchPresent / stats.total) * 100 : 0;
  
  const dinnerPresent = stats.byMeal?.dinner?.present || 0;
  const dinnerPercentage = stats.total > 0 ? (dinnerPresent / stats.total) * 100 : 0;
  
  const vegTotal = (stats.byMeal?.lunch?.veg || 0) + (stats.byMeal?.dinner?.veg || 0);
  const nonVegTotal = (stats.byMeal?.lunch?.nonVeg || 0) + (stats.byMeal?.dinner?.nonVeg || 0);
  const vegPercentage = stats.present > 0 ? (vegTotal / stats.present) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Student Attendence</CardTitle>
      </CardHeader>   
      <CardContent>
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="meal">By Meal</TabsTrigger>
            <TabsTrigger value="year">By Year</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="mt-4 space-y-4">
            {/* Overall Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center bg-mess-light rounded-lg p-3">
                <UsersRound className="h-5 w-5 text-mess-primary mb-1" />
                <span className="text-xl font-bold">{stats.total}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 rounded-lg p-3">
                <UserCheck className="h-5 w-5 text-green-600 mb-1" />
                <span className="text-xl font-bold">{stats.present}</span>
                <span className="text-xs text-gray-500">Present</span>
              </div>
              <div className="flex flex-col items-center bg-red-50 rounded-lg p-3">
                <UserX className="h-5 w-5 text-red-500 mb-1" />
                <span className="text-xl font-bold">{stats.absent}</span>
                <span className="text-xs text-gray-500">Absent</span>
              </div>
            </div>
            
            {/* Progress bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Present</span>
                  <span>{presentPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={presentPercentage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Absent</span>
                  <span>{absentPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={absentPercentage} className="h-2 bg-gray-100" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meal" className="mt-4 space-y-4">
            {/* Meal Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-mess-light rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-mess-secondary rounded-full"></div>
                    <span className="font-medium">Lunch</span>
                  </div>
                  <span className="text-sm text-gray-500">{lunchPercentage.toFixed(0)}%</span>
                </div>
                <div className="text-xl font-bold">{lunchPresent}</div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Veg: {stats.byMeal?.lunch?.veg || 0}</span>
                  <span>Non-veg: {stats.byMeal?.lunch?.nonVeg || 0}</span>
                </div>
              </div>
              <div className="bg-mess-light rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-mess-accent rounded-full"></div>
                    <span className="font-medium">Dinner</span>
                  </div>
                  <span className="text-sm text-gray-500">{dinnerPercentage.toFixed(0)}%</span>
                </div>
                <div className="text-xl font-bold">{dinnerPresent}</div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Veg: {stats.byMeal?.dinner?.veg || 0}</span>
                  <span>Non-veg: {stats.byMeal?.dinner?.nonVeg || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Salad className="h-4 w-4 text-mess-secondary" />
                  <span>Food Preference</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Vegetarian</span>
                    <span>{vegPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={vegPercentage} className="h-2 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Non-vegetarian</span>
                    <span>{(100 - vegPercentage).toFixed(0)}%</span>
                  </div>
                  <Progress value={100 - vegPercentage} className="h-2 bg-gray-100" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="year" className="mt-4">
            {/* Year-wise Stats */}
            <div className="space-y-3">
              {Object.keys(stats.byYear || {}).map((year) => {
                const yearData = stats.byYear[year];
                const yearPercentage = yearData.total > 0 
                  ? (yearData.present / yearData.total) * 100 
                  : 0;
                  
                return (
                  <div key={year} className="bg-mess-light rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Year {year}</span>
                      <span className="text-sm">{yearPercentage.toFixed(0)}% present</span>
                    </div>
                    <Progress value={yearPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Total: {yearData.total}</span>
                      <span>Present: {yearData.present}</span>
                      <span>Absent: {yearData.absent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceStats;
