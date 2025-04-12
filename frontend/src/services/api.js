
// API utility functions for interacting with the backend

/**
 * Verify if a student exists in the system
 * @param {string} rollNumber - The student's roll number
 * @returns {Promise<boolean>} - True if student exists, false otherwise
 * 
 * Expected backend response: { exists: boolean }
 */
export const verifyStudent = async (rollNumber) => {
  try {
    // Mock API call - replace with actual endpoint
    const response = await fetch(`/api/student/verify-student/${rollNumber}`);
    console.log(`Verifying student with roll number: ${rollNumber}`, response);
    const data = await response.json();
    console.log(`Verifying student with roll number: ${rollNumber}`, data);    
    return data.exists;
    
    // Mocking the response for now
    // console.log(`Verifying student with roll number: ${rollNumber}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     // Randomly return true/false for testing
    //     resolve(Math.random() > 0.2);
    //   }, 500);
    // });
  } catch (error) {
    console.error("Error verifying student:", error);
    return false;
  }
};

/**
 * Mark student attendance for a meal
 * @param {string} rollNumber - The student's roll number
 * @param {string} mealType - Either "lunch" or "dinner"
 * @param {string} foodPreference - Either "veg" or "non-veg"
 * @returns {Promise<Object>} - Response with status and student data
 * 
 * Expected backend response: 
 * {
 *   success: boolean,
 *   message: string,
 *   student: {
 *     rollNumber: string,
 *     name: string,
 *     year: number,
 *     mealMarked: string,
 *     foodPreference: string,
 *     timestamp: string
 *   }
 * }
 */
export const markAttendance = async (rollNumber, mealType, foodPreference) => {
  try {
    // Mock API call - replace with actual endpoint
    const response = await fetch(`/api/attendance/mark-attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNumber, mealType, foodPreference })
    });
    return await response.json();
    
    // Mocking the response for now
    // console.log(`Marking ${mealType} attendance for ${rollNumber} with ${foodPreference} preference`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     const years = [1, 2, 3, 4];
    //     const names = [
    //       "Rahul Sharma", "Priya Patel", "Amit Singh", 
    //       "Sneha Gupta", "Rajesh Kumar", "Anjali Desai"
    //     ];
        
    //     resolve({
    //       success: true,
    //       message: "Attendance marked successfully",
    //       student: {
    //         rollNumber,
    //         name: names[Math.floor(Math.random() * names.length)],
    //         year: years[Math.floor(Math.random() * years.length)],
    //         mealMarked: mealType,
    //         foodPreference,
    //         timestamp: new Date().toISOString()
    //       }
    //     });
    //   }, 800);
    // });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return {
      success: false,
      message: "Failed to mark attendance",
      error: error.message
    };
  }
};

/**
 * Get attendance statistics
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} [mealType] - Optional meal type filter ("lunch" or "dinner")
 * @returns {Promise<Object>} - Attendance statistics
 * 
 * Expected backend response:
 * {
 *   total: number,
 *   present: number,
 *   absent: number,
 *   byYear: {
 *     1: { total: number, present: number, absent: number },
 *     2: { total: number, present: number, absent: number },
 *     3: { total: number, present: number, absent: number },
 *     4: { total: number, present: number, absent: number }
 *   },
 *   byMeal: {
 *     lunch: { total: number, present: number, absent: number, veg: number, nonVeg: number },
 *     dinner: { total: number, present: number, absent: number, veg: number, nonVeg: number }
 *   }
 * }
 */
export const getAttendanceStats = async (date, mealType) => {
  try {
    // Mock API call - replace with actual endpoint
    let url = `/api/attendance/attendance-stats?date=${date}`;
    if (mealType) url += `&mealType=${mealType}`;
    const response = await fetch(url);
    return await response.json();
    
    // Mocking the response for now
    // console.log(`Getting attendance stats for ${date}${mealType ? ` - ${mealType}` : ''}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     // Generate mock data for testing
    //     const total = 500;
    //     const present = Math.floor(Math.random() * (total - 100) + 100);
    //     const absent = total - present;
        
    //     const lunchPresent = mealType === "dinner" ? 0 : Math.floor(present * 0.6);
    //     const dinnerPresent = mealType === "lunch" ? 0 : present - lunchPresent;
        
    //     const vegLunch = Math.floor(lunchPresent * 0.7);
    //     const nonVegLunch = lunchPresent - vegLunch;
        
    //     const vegDinner = Math.floor(dinnerPresent * 0.6);
    //     const nonVegDinner = dinnerPresent - vegDinner;
        
    //     resolve({
    //       total,
    //       present,
    //       absent,
    //       byYear: {
    //         1: { total: 125, present: Math.floor(present * 0.25), absent: 125 - Math.floor(present * 0.25) },
    //         2: { total: 125, present: Math.floor(present * 0.30), absent: 125 - Math.floor(present * 0.30) },
    //         3: { total: 125, present: Math.floor(present * 0.20), absent: 125 - Math.floor(present * 0.20) },
    //         4: { total: 125, present: Math.floor(present * 0.25), absent: 125 - Math.floor(present * 0.25) }
    //       },
    //       byMeal: {
    //         lunch: { 
    //           total, 
    //           present: lunchPresent, 
    //           absent: total - lunchPresent,
    //           veg: vegLunch,
    //           nonVeg: nonVegLunch
    //         },
    //         dinner: { 
    //           total, 
    //           present: dinnerPresent, 
    //           absent: total - dinnerPresent,
    //           veg: vegDinner,
    //           nonVeg: nonVegDinner
    //         }
    //       }
    //     });
    //   }, 800);
    // });
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    return {
      total: 0,
      present: 0,
      absent: 0,
      byYear: {},
      byMeal: {}
    };
  }
};

/**
 * Get weekly attendance statistics
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} - Weekly attendance statistics
 * 
 * Expected backend response:
 * {
 *   dates: string[], // Array of dates in the range
 *   attendance: {
 *     lunch: number[], // Array of lunch attendance counts
 *     dinner: number[] // Array of dinner attendance counts
 *   },
 *   preferences: {
 *     veg: number[], // Array of veg meal counts
 *     nonVeg: number[] // Array of non-veg meal counts
 *   }
 * }
 */
export const getWeeklyStats = async (startDate, endDate) => {
  try {
    // Mock API call - replace with actual endpoint
    const response = await fetch(`/api/attendance/weekly-stats?startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
    
    // Mocking the response for now
    // console.log(`Getting weekly stats from ${startDate} to ${endDate}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     // Generate 7 days of mock data
    //     const dates = [];
    //     const lunchCounts = [];
    //     const dinnerCounts = [];
    //     const vegCounts = [];
    //     const nonVegCounts = [];
        
    //     const currentDate = new Date(startDate);
    //     const end = new Date(endDate);
        
    //     while (currentDate <= end) {
    //       dates.push(currentDate.toISOString().split('T')[0]);
          
    //       const lunchCount = Math.floor(Math.random() * 200) + 200;
    //       const dinnerCount = Math.floor(Math.random() * 180) + 180;
          
    //       lunchCounts.push(lunchCount);
    //       dinnerCounts.push(dinnerCount);
          
    //       const vegCount = Math.floor((lunchCount + dinnerCount) * 0.65);
    //       vegCounts.push(vegCount);
    //       nonVegCounts.push(lunchCount + dinnerCount - vegCount);
          
    //       currentDate.setDate(currentDate.getDate() + 1);
    //     }
        
    //     resolve({
    //       dates,
    //       attendance: {
    //         lunch: lunchCounts,
    //         dinner: dinnerCounts
    //       },
    //       preferences: {
    //         veg: vegCounts,
    //         nonVeg: nonVegCounts
    //       }
    //     });
    //   }, 1000);
    // });
  } catch (error) {
    console.error("Error getting weekly stats:", error);
    return {
      dates: [],
      attendance: { lunch: [], dinner: [] },
      preferences: { veg: [], nonVeg: [] }
    };
  }
};

/**
 * Generate and download attendance report
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} - Status of report generation
 * 
 * Expected backend response:
 * {
 *   success: boolean,
 *   message: string,
 *   reportUrl: string // URL to download the report (or file content in development)
 * }
 */
export const generateReport = async (date) => {
  try {
    // Mock API call - replace with actual endpoint
    const response = await fetch(`/api/report/generate-report?date=${date}`);
    return await response.json();
    
    // Mock report generation
    // console.log(`Generating report for ${date}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       success: true,
    //       message: "Report generated successfully",
    //       reportUrl: `data:text/csv;charset=utf-8,Date,${date}%0ATotal Students,500%0APresent,350%0AAbsent,150%0A%0AYear,Total,Present,Absent%0A1,125,90,35%0A2,125,95,30%0A3,125,80,45%0A4,125,85,40%0A%0AMeal,Total,Present,Absent,Veg,NonVeg%0ALunch,500,200,300,140,60%0ADinner,500,150,350,100,50`
    //     });
    //   }, 1500);
    // });
  } catch (error) {
    console.error("Error generating report:", error);
    return {
      success: false,
      message: "Failed to generate report",
      error: error.message
    };
  }
};

// Helper functions for date operations
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getCurrentDate = () => {
  return formatDate(new Date());
};

export const getStartOfWeek = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return formatDate(monday);
};

export const getEndOfWeek = () => {
  const startOfWeek = new Date(getStartOfWeek());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return formatDate(endOfWeek);
};
