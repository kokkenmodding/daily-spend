
import React from "react";
import { 
  calculateDaysBetween, 
  calculateDailyBudget, 
  calculateAdjustedDailyBudget,
  formatCurrency 
} from "@/utils/dateUtils";
import { CalendarDays, Calendar, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  
  // Calculate days elapsed
  const daysElapsed = (isDataComplete && intermediateDate) 
    ? calculateDaysBetween(startDate, intermediateDate) 
    : 0;
    
  // Calculate days remaining - from the day AFTER intermediate date to end date
  const daysRemaining = (isDataComplete && intermediateDate) 
    ? calculateDaysBetween(new Date(intermediateDate.getTime() + 86400000), endDate) 
    : days;

  // Calculate pacing metrics
  const calculatePacing = () => {
    if (!isDataComplete || !hasIntermediateData || !intermediateDate) return null;

    // Calculate ideal spend based on days elapsed
    const timeRatio = daysElapsed / days;
    const idealSpend = totalBudget * timeRatio;
    
    // Calculate actual spend ratio
    const spendRatio = spentAmount / totalBudget;
    
    // Calculate pacing percentage (how actual spend compares to ideal spend)
    // 100% means perfect pacing, >100% means overspending, <100% means underspending
    const pacingPercentage = (spendRatio / timeRatio) * 100;
    
    // Determine status based on how far off perfect pacing (100%)
    let status = "on-track";
    let statusColor = "bg-emerald-500";
    let textColor = "text-emerald-700";
    
    const pacingDifference = Math.abs(100 - pacingPercentage);
    
    if (pacingDifference > 10) {
      status = pacingPercentage > 100 ? "overspending" : "underspending";
      statusColor = "bg-red-500";
      textColor = "text-red-700";
    } else if (pacingDifference > 5) {
      status = pacingPercentage > 100 ? "slightly overspending" : "slightly underspending";
      statusColor = "bg-amber-500";
      textColor = "text-amber-700";
    }
    
    return {
      idealSpend,
      pacingPercentage,
      status,
      statusColor,
      textColor,
      timeRatio,
      spendRatio
    };
  };
  
  const pacing = calculatePacing();

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
        
        {/* Pacing Graph */}
        {isDataComplete && hasIntermediateData && pacing && (
          <div className="mt-6 p-4 bg-accent/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                <span className="text-sm font-medium">Campaign Pacing</span>
              </div>
              <Badge 
                className={`${pacing.textColor.replace('text-', 'bg-').replace('-700', '-100')} ${pacing.textColor}`}
              >
                {Math.round(pacing.pacingPercentage)}% of ideal
              </Badge>
            </div>
            
            <div className="mt-3 space-y-2">
              {/* Pacing visualization - Updated to make 100% pacing fill to 50% of the bar */}
              <div className="relative h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                {/* Middle marker for 100% pacing */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 z-10"></div>
                
                {/* Progress bar for pacing - Adjusted to make 100% equal to 50% of graph width */}
                <div 
                  className={`h-full transition-all ${pacing.statusColor}`}
                  style={{ width: `${Math.min(Math.max(pacing.pacingPercentage / 2, 0), 100)}%` }}
                ></div>
                
                {/* Indicator positions - Adjusted for new scale */}
                <div className="absolute top-0 bottom-0 left-[40%] w-px bg-gray-300 z-10 h-2"></div>
                <div className="absolute top-0 bottom-0 left-[45%] w-px bg-gray-300 z-10 h-2"></div>
                <div className="absolute top-0 bottom-0 left-[55%] w-px bg-gray-300 z-10 h-2"></div>
                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-gray-300 z-10 h-2"></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Underspending</span>
                <span>On Track</span>
                <span>Overspending</span>
              </div>
              
              <div className="pt-2 text-sm">
                <div className="flex justify-between">
                  <span>Time elapsed:</span>
                  <span>{Math.round(pacing.timeRatio * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget spent:</span>
                  <span>{Math.round(pacing.spendRatio * 100)}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Ideal spend to date:</span>
                  <span>{formatCurrency(pacing.idealSpend)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual spend to date:</span>
                  <span>{formatCurrency(spentAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
