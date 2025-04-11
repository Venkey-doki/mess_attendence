const extractYearFromRoll = (rollNumber) => {
  const joiningYear = parseInt("20" + rollNumber.slice(0, 2), 10); // '22' -> 2022
  const code = rollNumber.slice(4, 6); // '5A' is lateral
  const currentYear = new Date().getFullYear();

  const isLateral = code.toUpperCase() === "5A";

  // +1 for academic year offset, +1 more if lateral
  const academicYear = currentYear - joiningYear  + (isLateral ? 1 : 0);

  return academicYear;
};

export { extractYearFromRoll };