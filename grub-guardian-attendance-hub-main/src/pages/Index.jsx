
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import {
  verifyStudent,
  markAttendance,
  getAttendanceStats,
  getWeeklyStats,
  generateReport,
  getCurrentDate,
  getStartOfWeek,
  getEndOfWeek
} from '@/services/api';
import { getCurrentMealTime } from '@/utils/timeUtils';

import Header from '@/components/Header';
import ScannerInput from '@/components/ScannerInput';
import MealSelection from '@/components/MealSelection';
import AttendanceStats from '@/components/AttendanceStats';
import AttendanceCharts from '@/components/AttendanceCharts';
import RecentActivity from '@/components/RecentActivity';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch stats when the date changes
  useEffect(() => {
    fetchStats();
  }, [currentDate]);

  // Fetch weekly stats on component mount
  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await getAttendanceStats(currentDate);
      setAttendanceStats(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load attendance statistics");
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const startDate = getStartOfWeek();
      const endDate = getEndOfWeek();
      const stats = await getWeeklyStats(startDate, endDate);
      setWeeklyStats(stats);
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      toast.error("Failed to load weekly statistics");
    }
  };

  const handleScan = async (rollNumber) => {
    setIsVerifying(true);
    try {
      const exists = await verifyStudent(rollNumber);
      if (exists) {
        setVerifiedStudent(rollNumber);
        toast.success("Student verified");
      } else {
        setVerifiedStudent(null);
        toast.error("Student not found in the database");
      }
    } catch (error) {
      console.error("Error verifying student:", error);
      toast.error("Failed to verify student");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAttendanceSubmit = async (mealType, foodPreference) => {
    if (!verifiedStudent) {
      toast.error("Please scan a valid student ID first");
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await markAttendance(verifiedStudent, mealType, foodPreference);
      
      if (response.success) {
        toast.success("Attendance marked successfully");
        
        // Update student name for display
        setStudentName(response.student.name);
        
        // Add to recent activities
        setRecentActivities(prev => [response.student, ...prev].slice(0, 10));
        
        // Reset verification after successful marking
        setTimeout(() => {
          setVerifiedStudent(null);
          setStudentName("");
        }, 3000);
        
        // Refresh stats
        fetchStats();
      } else {
        toast.error(response.message || "Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleGenerateReport = async (date) => {
    toast.info("Generating attendance report...");
    try {
      const response = await generateReport(date);
      
      if (response.success) {
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = response.reportUrl;
        link.setAttribute('download', `attendance_report_${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Report downloaded successfully");
      } else {
        toast.error(response.message || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate attendance report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onGenerateReport={handleGenerateReport}
        onDateChange={handleDateChange}
        currentDate={currentDate}
      />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Student check-in and meal selection */}
          <div className="lg:col-span-1 space-y-6">
            <ScannerInput 
              onScan={handleScan} 
              isVerifying={isVerifying} 
              isProcessing={isProcessing}
            />
            <MealSelection 
              onSubmit={handleAttendanceSubmit}
              isProcessing={isProcessing}
              studentName={studentName || (verifiedStudent ? "Student Verified" : "")}
            />
          </div>
          
          {/* Right column - Stats and charts */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceStats stats={attendanceStats} />
            <AttendanceCharts 
              dailyStats={attendanceStats} 
              weeklyStats={weeklyStats} 
            />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Grub Guardian - Food Mess Attendance System
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
