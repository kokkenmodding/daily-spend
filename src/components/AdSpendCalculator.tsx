
import React, { useState, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import BudgetInput from "./BudgetInput";
import SpentAmountInput from "./SpentAmountInput";
import ResultDisplay from "./ResultDisplay";
import CalculatorHeader from "./CalculatorHeader";
import GoogleAdsIntegration from "./GoogleAdsIntegration";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateUtils";

const AdSpendCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));
  const [intermediateDate, setIntermediateDate] = useState<Date | null>(subDays(new Date(), 1));
  const [totalBudget, setTotalBudget] = useState<number>(1000);
  const [spentAmount, setSpentAmount] = useState<number>(0);
  const [showIntermediate, setShowIntermediate] = useState<boolean>(false);
  const [showGoogleAdsIntegration, setShowGoogleAdsIntegration] = useState<boolean>(false);

  // Reset spent amount when intermediate date is removed
  useEffect(() => {
    if (!intermediateDate || !showIntermediate) {
      setSpentAmount(0);
    }
  }, [intermediateDate, showIntermediate]);

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

  const handleSetDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    
    // If intermediate date is outside the new range, reset it
    if (intermediateDate && (intermediateDate < start || intermediateDate > end)) {
      setIntermediateDate(null);
      setSpentAmount(0);
    }
  };

  const handleBudgetChange = (value: number) => {
    setTotalBudget(value);
  };

  const handleSpentAmountChange = (value: number) => {
    setSpentAmount(value);
  };

  const handleToggleIntermediate = (value: boolean) => {
    setShowIntermediate(value);
    if (!value) {
      setIntermediateDate(null);
      setShowGoogleAdsIntegration(false);
    } else {
      // Set default intermediate date to yesterday when toggle is turned on
      const yesterday = subDays(new Date(), 1);
      if (!intermediateDate || 
          (startDate && yesterday < startDate) ||
          (endDate && yesterday > endDate)) {
        // If yesterday is outside the selected date range, use the start date
        setIntermediateDate(startDate);
      } else {
        setIntermediateDate(yesterday);
      }
    }
  };

  const handleToggleGoogleAds = (value: boolean) => {
    setShowGoogleAdsIntegration(value);
  };

  const handleGoogleAdsCostFetched = (cost: number) => {
    setSpentAmount(cost);
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
          showIntermediate={showIntermediate}
          onToggleIntermediate={handleToggleIntermediate}
          onSetDateRange={handleSetDateRange}
        />
        
        <BudgetInput 
          value={totalBudget} 
          onChange={handleBudgetChange} 
        />
        
        {/* Intermediate date toggle and section */}
        <div className="mt-6">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="intermediate-toggle" 
                checked={showIntermediate}
                onCheckedChange={handleToggleIntermediate}
              />
              <label htmlFor="intermediate-toggle" className="text-sm font-medium">
                Track current progress
              </label>
            </div>
            <Separator className="w-full mt-2" />
          </div>

          {showIntermediate && (
            <div className="space-y-2 mt-4">
              <label htmlFor="intermediate-date" className="block text-sm font-medium text-muted-foreground">
                Intermediate Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="intermediate-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all-200 border-input bg-background hover:bg-accent",
                      !intermediateDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {intermediateDate ? formatDate(intermediateDate) : "Select intermediate date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={intermediateDate || undefined}
                    onSelect={handleIntermediateDateChange}
                    initialFocus
                    disabled={(date) => {
                      if (startDate && date < startDate) return true;
                      if (endDate && date > endDate) return true;
                      return false;
                    }}
                    className={cn("p-3 pointer-events-auto rounded-md border border-input bg-card shadow-md")}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-xs text-muted-foreground">
                Select a date to indicate your current progress in the campaign
              </div>
            </div>
          )}
          
          {showIntermediate && (
            <>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="google-ads-toggle" 
                    checked={showGoogleAdsIntegration}
                    onCheckedChange={handleToggleGoogleAds}
                  />
                  <label htmlFor="google-ads-toggle" className="text-sm font-medium">
                    Fetch from Google Ads
                  </label>
                </div>
              </div>
              
              {showGoogleAdsIntegration ? (
                <div className="mt-4">
                  <GoogleAdsIntegration 
                    startDate={startDate}
                    intermediateDate={intermediateDate}
                    onCostFetched={handleGoogleAdsCostFetched}
                    isEnabled={showGoogleAdsIntegration}
                  />
                </div>
              ) : (
                <SpentAmountInput 
                  value={spentAmount}
                  onChange={handleSpentAmountChange}
                  isDisabled={!intermediateDate}
                />
              )}
            </>
          )}
        </div>
        
        <ResultDisplay
          totalBudget={totalBudget}
          startDate={startDate}
          endDate={endDate}
          intermediateDate={showIntermediate ? intermediateDate : null}
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
