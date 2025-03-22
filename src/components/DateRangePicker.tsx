
import React from "react";
import { format, endOfMonth, startOfMonth, addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/utils/dateUtils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  intermediateDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onIntermediateDateChange: (date: Date | null) => void;
  showIntermediate: boolean;
  onToggleIntermediate: (value: boolean) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  intermediateDate,
  onStartDateChange,
  onEndDateChange,
  onIntermediateDateChange,
  showIntermediate,
  onToggleIntermediate,
}) => {
  // Quick selection handlers for start date
  const handleSelectFirstOfMonth = () => {
    onStartDateChange(startOfMonth(new Date()));
  };

  const handleSelectFirstOfNextMonth = () => {
    onStartDateChange(startOfMonth(addMonths(new Date(), 1)));
  };
  
  const handleSelectToday = () => {
    onStartDateChange(new Date());
  };

  // Quick selection handlers for end date
  const handleSelectEndOfMonth = () => {
    onEndDateChange(endOfMonth(new Date()));
  };

  const handleSelectEndOfNextMonth = () => {
    onEndDateChange(endOfMonth(addMonths(new Date(), 1)));
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "50ms" }}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="start-date" className="block text-sm font-medium text-muted-foreground">
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all-200 border-input bg-background hover:bg-accent",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {startDate ? formatDate(startDate) : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={onStartDateChange}
                initialFocus
                disabled={(date) => {
                  if (intermediateDate && date > intermediateDate) return true;
                  if (endDate && date > endDate) return true;
                  return false;
                }}
                className={cn("p-3 pointer-events-auto rounded-md border border-input bg-card shadow-md")}
              />
            </PopoverContent>
          </Popover>
          
          {/* Quick selection buttons for start date */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectFirstOfMonth}
              className="text-xs"
            >
              First of month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectFirstOfNextMonth}
              className="text-xs"
            >
              First of next month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectToday}
              className="text-xs"
            >
              Today
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="end-date" className="block text-sm font-medium text-muted-foreground">
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all-200 border-input bg-background hover:bg-accent",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {endDate ? formatDate(endDate) : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={onEndDateChange}
                initialFocus
                disabled={(date) => startDate ? date < startDate : false}
                className={cn("p-3 pointer-events-auto rounded-md border border-input bg-card shadow-md")}
              />
            </PopoverContent>
          </Popover>
          
          {/* Quick selection buttons for end date */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectEndOfMonth}
              className="text-xs"
            >
              End of month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectEndOfNextMonth}
              className="text-xs"
            >
              End of next month
            </Button>
          </div>
        </div>
      </div>

      {/* Intermediate date section with toggle */}
      <div className="mt-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="intermediate-toggle" 
              checked={showIntermediate}
              onCheckedChange={onToggleIntermediate}
            />
            <label htmlFor="intermediate-toggle" className="text-sm font-medium">
              Track current progress
            </label>
          </div>
          <Separator className="grow mx-4" />
        </div>

        {showIntermediate && (
          <div className="space-y-2 pl-2 border-l-2 border-muted/40 py-2">
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
                  onSelect={onIntermediateDateChange}
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
      </div>
    </div>
  );
};

export default DateRangePicker;
