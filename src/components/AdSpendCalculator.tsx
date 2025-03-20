
import React, { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import BudgetInput from "./BudgetInput";
import ResultDisplay from "./ResultDisplay";
import CalculatorHeader from "./CalculatorHeader";
import { addDays } from "date-fns";

const AdSpendCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 7));
  const [totalBudget, setTotalBudget] = useState<number>(1000);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    
    // If end date is before start date, update end date
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    
    // If start date is after end date, update start date
    if (date && startDate && startDate > date) {
      setStartDate(date);
    }
  };

  const handleBudgetChange = (value: number) => {
    setTotalBudget(value);
  };

  return (
    <div className="w-full max-w-3xl p-6 mx-auto">
      <CalculatorHeader />
      
      <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-8">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        
        <BudgetInput 
          value={totalBudget} 
          onChange={handleBudgetChange} 
        />
        
        <ResultDisplay
          totalBudget={totalBudget}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "200ms" }}>
        <p>Adjust your campaign dates and budget to see the calculated daily ad spend.</p>
      </div>
    </div>
  );
};

export default AdSpendCalculator;
