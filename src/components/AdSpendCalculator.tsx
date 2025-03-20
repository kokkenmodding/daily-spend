
import React, { useState, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import BudgetInput from "./BudgetInput";
import SpentAmountInput from "./SpentAmountInput";
import ResultDisplay from "./ResultDisplay";
import CalculatorHeader from "./CalculatorHeader";
import { addDays } from "date-fns";

const AdSpendCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 7));
  const [intermediateDate, setIntermediateDate] = useState<Date | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(1000);
  const [spentAmount, setSpentAmount] = useState<number>(0);

  // Reset spent amount when intermediate date is removed
  useEffect(() => {
    if (!intermediateDate) {
      setSpentAmount(0);
    }
  }, [intermediateDate]);

  // Ensure spent amount doesn't exceed total budget
  useEffect(() => {
    if (spentAmount > totalBudget) {
      setSpentAmount(totalBudget);
    }
  }, [spentAmount, totalBudget]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    
    // If end date is before start date, update end date
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
    
    // If intermediate date is before start date, update intermediate date
    if (date && intermediateDate && date > intermediateDate) {
      setIntermediateDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    
    // If start date is after end date, update start date
    if (date && startDate && startDate > date) {
      setStartDate(date);
    }
    
    // If intermediate date is after end date, update intermediate date
    if (date && intermediateDate && intermediateDate > date) {
      setIntermediateDate(date);
    }
  };

  const handleIntermediateDateChange = (date: Date | null) => {
    setIntermediateDate(date);
    
    // Reset spent amount when intermediate date changes
    if (date !== intermediateDate) {
      setSpentAmount(0);
    }
  };

  const handleBudgetChange = (value: number) => {
    setTotalBudget(value);
  };

  const handleSpentAmountChange = (value: number) => {
    setSpentAmount(value);
  };

  return (
    <div className="w-full max-w-3xl p-6 mx-auto">
      <CalculatorHeader />
      
      <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-8">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          intermediateDate={intermediateDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onIntermediateDateChange={handleIntermediateDateChange}
        />
        
        <BudgetInput 
          value={totalBudget} 
          onChange={handleBudgetChange} 
        />
        
        <SpentAmountInput 
          value={spentAmount}
          onChange={handleSpentAmountChange}
          isDisabled={!intermediateDate}
        />
        
        <ResultDisplay
          totalBudget={totalBudget}
          startDate={startDate}
          endDate={endDate}
          intermediateDate={intermediateDate}
          spentAmount={spentAmount}
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "200ms" }}>
        <p>Adjust your campaign dates, budget, and track your spending to optimize your daily ad spend.</p>
      </div>
    </div>
  );
};

export default AdSpendCalculator;
