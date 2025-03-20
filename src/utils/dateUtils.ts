
import { format, differenceInDays, addDays } from "date-fns";

/**
 * Calculate the number of days between two dates (inclusive)
 */
export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate) + 1; // Include both start and end dates
};

/**
 * Calculate daily budget based on total budget and date range
 */
export const calculateDailyBudget = (
  totalBudget: number,
  startDate: Date,
  endDate: Date
): number => {
  const days = calculateDaysBetween(startDate, endDate);
  return days > 0 ? totalBudget / days : 0;
};

/**
 * Calculate adjusted daily budget based on intermediate date and spent amount
 */
export const calculateAdjustedDailyBudget = (
  totalBudget: number,
  startDate: Date,
  endDate: Date,
  intermediateDate: Date,
  spentAmount: number
): number => {
  // Calculate the total campaign days
  const totalDays = calculateDaysBetween(startDate, endDate);
  
  // Calculate days elapsed (from start to intermediate date, inclusive)
  const daysElapsed = calculateDaysBetween(startDate, intermediateDate);
  
  // Calculate days remaining (from intermediate date to end date, not double-counting intermediate date)
  const daysRemaining = totalDays - daysElapsed + 1; // +1 to avoid double-counting intermediate date
  
  // Calculate the remaining budget
  const remainingBudget = Math.max(0, totalBudget - spentAmount);
  
  // Calculate the adjusted daily budget for remaining days
  return daysRemaining > 0 ? remainingBudget / daysRemaining : 0;
};

/**
 * Format a date to display format
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return format(date, "MMMM d, yyyy");
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Generate an array of dates between start and end dates
 */
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};
