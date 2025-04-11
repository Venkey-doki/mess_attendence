
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatDateShort } from '@/utils/timeUtils';

const COLORS = ['#2563eb', '#10b981', '#f97316', '#ef4444'];

const AttendanceCharts = ({ dailyStats, weeklyStats }) => {
  const [currentTab, setCurrentTab] = useState('daily');

  if (!dailyStats || !weeklyStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for pie chart
  const pieData = [
    { name: 'Present (Lunch)', value: dailyStats.byMeal?.lunch?.present || 0 },
    { name: 'Present (Dinner)', value: dailyStats.byMeal?.dinner?.present || 0 },
    { name: 'Absent', value: dailyStats.absent || 0 },
  ];
  
  // Prepare data for year-wise bar chart
  const yearData = Object.keys(dailyStats.byYear || {}).map(year => ({
    year: `Year ${year}`,
    present: dailyStats.byYear[year].present,
    absent: dailyStats.byYear[year].absent
  }));
  
  // Format weekly data for line chart
  const weeklyLineData = weeklyStats.dates.map((date, index) => ({
    date,
    lunch: weeklyStats.attendance.lunch[index],
    dinner: weeklyStats.attendance.dinner[index],
  }));

  // Format weekly data for stacked bar chart (food preferences)
  const weeklyPreferenceData = weeklyStats.dates.map((date, index) => ({
    date,
    veg: weeklyStats.preferences.veg[index],
    nonVeg: weeklyStats.preferences.nonVeg[index],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Attendance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-4">
            <div className="h-80">
              <Tabs defaultValue="distribution">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  <TabsTrigger value="year">Year-wise</TabsTrigger>
                </TabsList>
                
                <TabsContent value="distribution">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="year">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={yearData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="present" fill="#10b981" name="Present" />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            <div className="h-[350px]">
              <Tabs defaultValue="attendance">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="preference">Food Preference</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attendance">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={weeklyLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatDateShort(value)}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [value, name === 'lunch' ? 'Lunch' : 'Dinner']}
                        labelFormatter={(label) => formatDateShort(label)}
                        content={<CustomTooltip />}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="lunch" 
                        name="Lunch" 
                        stroke="#2563eb" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="dinner" 
                        name="Dinner" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="preference">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={weeklyPreferenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => formatDateShort(value)}
                      />
                      <YAxis />
                      <Tooltip 
                        content={<CustomTooltip />}
                        formatter={(value, name) => [value, name === 'veg' ? 'Vegetarian' : 'Non-Vegetarian']}
                        labelFormatter={(label) => formatDateShort(label)}
                      />
                      <Legend />
                      <Bar dataKey="veg" stackId="a" name="Vegetarian" fill="#10b981" />
                      <Bar dataKey="nonVeg" stackId="a" name="Non-Vegetarian" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceCharts;
