
import React from "react";
import { calculateDaysBetween, calculateDailyBudget, formatCurrency } from "@/utils/dateUtils";
import { CalendarDays, Calendar } from "lucide-react";

interface ResultDisplayProps {
  totalBudget: number;
  startDate: Date | null;
  endDate: Date | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  totalBudget,
  startDate,
  endDate,
}) => {
  const isDataComplete = startDate && endDate && totalBudget > 0;
  
  const days = isDataComplete ? calculateDaysBetween(startDate, endDate) : 0;
  const dailyBudget = isDataComplete ? calculateDailyBudget(totalBudget, startDate, endDate) : 0;

  return (
    <div className="mt-8 overflow-hidden bg-card border border-border rounded-2xl shadow-sm animate-fade-up" style={{ animationDelay: "150ms" }}>
      <div className="p-6">
        <h3 className="text-lg font-medium">Campaign Summary</h3>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <div className="p-4 bg-accent/50 rounded-xl">
            <div className="flex items-center mb-2">
              <CalendarDays className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium">Campaign Duration</span>
            </div>
            <p className="text-3xl font-medium">
              {isDataComplete ? `${days} ${days === 1 ? 'day' : 'days'}` : '—'}
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-xl">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium">Daily Ad Spend</span>
            </div>
            <p className="text-3xl font-medium">
              {isDataComplete ? formatCurrency(dailyBudget) : '—'}
            </p>
          </div>
        </div>
        
        {isDataComplete && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p>With a total budget of {formatCurrency(totalBudget)} over {days} {days === 1 ? 'day' : 'days'}, 
            your optimal daily ad spend should be {formatCurrency(dailyBudget)}.</p>
          </div>
        )}
        
        {!isDataComplete && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Please enter your total budget and select both start and end dates to see your daily ad spend calculation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
