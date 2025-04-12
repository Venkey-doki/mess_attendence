
import { useState, useEffect } from 'react';
import { Bell, Calendar, Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentMealTime } from '@/utils/timeUtils';
import { getCurrentDate, formatDate } from '@/services/api';

const Header = ({ onGenerateReport, onDateChange, currentDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mealTime, setMealTime] = useState(getCurrentMealTime());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMealTime(getCurrentMealTime());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleDateChange = (e) => {
    onDateChange(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">Mess Dashboard</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-lg font-medium">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="date-select" className="sr-only">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="date-select"
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mess-primary focus:border-transparent"
                />
              </div>
            </div>

            {mealTime && (
              <div className="flex items-center px-4 py-1.5 bg-mess-light rounded-full">
                <div className={`h-2 w-2 rounded-full animate-pulse mr-2 ${
                  mealTime === 'lunch' ? 'bg-mess-secondary' : 'bg-mess-accent'
                }`}></div>
                <span className="font-medium capitalize">{mealTime} Time</span>
              </div>
            )}

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => onGenerateReport(currentDate)}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Report</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu (Expandable) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-base font-medium">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              
              {mealTime && (
                <div className="flex items-center px-3 py-1 bg-mess-light rounded-full">
                  <div className={`h-2 w-2 rounded-full animate-pulse mr-2 ${
                    mealTime === 'lunch' ? 'bg-mess-secondary' : 'bg-mess-accent'
                  }`}></div>
                  <span className="font-medium text-sm capitalize">{mealTime}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mess-primary focus:border-transparent"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => onGenerateReport(currentDate)}
              >
                <Download size={14} />
                Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
