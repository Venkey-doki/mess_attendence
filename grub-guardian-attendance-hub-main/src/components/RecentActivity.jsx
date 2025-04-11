
import { Scroll, CalendarCheck, Clock } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Scroll className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Scroll className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="max-h-[300px] overflow-y-auto">
          <ul className="divide-y">
            {activities.map((activity, index) => (
              <li key={index} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full mr-3 ${
                    activity.mealMarked === 'lunch' ? 'bg-mess-secondary' : 'bg-mess-accent'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.name} ({activity.rollNumber})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Year {activity.year} • {activity.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarCheck className="h-3 w-3 mr-1" />
                      <span className="capitalize">{activity.mealMarked}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(new Date(activity.timestamp))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
