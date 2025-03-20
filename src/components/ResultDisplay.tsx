
import React from "react";
import { 
  calculateDaysBetween, 
  calculateDailyBudget, 
  calculateAdjustedDailyBudget,
  formatCurrency 
} from "@/utils/dateUtils";
import { CalendarDays, Calendar, TrendingUp } from "lucide-react";

interface ResultDisplayProps {
  totalBudget: number;
  startDate: Date | null;
  endDate: Date | null;
  intermediateDate: Date | null;
  spentAmount: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  totalBudget,
  startDate,
  endDate,
  intermediateDate,
  spentAmount,
}) => {
  const isDataComplete = startDate && endDate && totalBudget > 0;
  const hasIntermediateData = intermediateDate && spentAmount > 0;
  
  const days = isDataComplete ? calculateDaysBetween(startDate, endDate) : 0;
  const dailyBudget = isDataComplete ? calculateDailyBudget(totalBudget, startDate, endDate) : 0;
  
  // Calculate adjusted daily budget if intermediate date is provided
  const adjustedDailyBudget = (isDataComplete && hasIntermediateData && intermediateDate) 
    ? calculateAdjustedDailyBudget(totalBudget, startDate, endDate, intermediateDate, spentAmount)
    : 0;

  // Calculate remaining budget
  const remainingBudget = hasIntermediateData ? totalBudget - spentAmount : totalBudget;
  
  // Calculate days elapsed and remaining
  const daysElapsed = (isDataComplete && intermediateDate) 
    ? calculateDaysBetween(startDate, intermediateDate) 
    : 0;
  const daysRemaining = (isDataComplete && intermediateDate) 
    ? days - daysElapsed + 1 // +1 because intermediate date is counted in both elapsed and remaining
    : days;

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
            {hasIntermediateData && (
              <div className="mt-2 text-sm">
                <div>{daysElapsed} days elapsed</div>
                <div>{daysRemaining} days remaining</div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-primary/10 rounded-xl">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium">
                {hasIntermediateData ? "Adjusted Daily Ad Spend" : "Daily Ad Spend"}
              </span>
            </div>
            <p className="text-3xl font-medium">
              {isDataComplete 
                ? hasIntermediateData 
                  ? formatCurrency(adjustedDailyBudget)
                  : formatCurrency(dailyBudget) 
                : '—'
              }
            </p>
            {hasIntermediateData && (
              <div className="mt-2 text-sm">
                <div>Original: {formatCurrency(dailyBudget)}</div>
                <div>Remaining budget: {formatCurrency(remainingBudget)}</div>
              </div>
            )}
          </div>
        </div>
        
        {isDataComplete && !hasIntermediateData && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p>With a total budget of {formatCurrency(totalBudget)} over {days} {days === 1 ? 'day' : 'days'}, 
            your optimal daily ad spend should be {formatCurrency(dailyBudget)}.</p>
          </div>
        )}
        
        {isDataComplete && hasIntermediateData && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p>You've spent {formatCurrency(spentAmount)} over the first {daysElapsed} {daysElapsed === 1 ? 'day' : 'days'}. 
            With {formatCurrency(remainingBudget)} remaining for the next {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}, 
            your adjusted daily ad spend should be {formatCurrency(adjustedDailyBudget)}.</p>
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
