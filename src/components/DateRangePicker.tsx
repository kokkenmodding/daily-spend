
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
  onSetDateRange: (startDate: Date, endDate: Date) => void;
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
  onSetDateRange,
}) => {
  // Quick selection handlers for combined date ranges
  const handleSelectThisMonth = () => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    onSetDateRange(start, end);
  };

  const handleSelectNextMonth = () => {
    const nextMonth = addMonths(new Date(), 1);
    const start = startOfMonth(nextMonth);
    const end = endOfMonth(nextMonth);
    onSetDateRange(start, end);
  };

  const handleSelectTodayToEOM = () => {
    const today = new Date();
    const end = endOfMonth(today);
    onSetDateRange(today, end);
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
        </div>
      </div>

      {/* Quick range selection buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSelectThisMonth}
          className="text-xs bg-blue-100 text-primary hover:bg-blue-200 border-0"
        >
          This month
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSelectNextMonth}
          className="text-xs bg-blue-100 text-primary hover:bg-blue-200 border-0"
        >
          Next month
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSelectTodayToEOM}
          className="text-xs bg-blue-100 text-primary hover:bg-blue-200 border-0"
        >
          Today to EOM
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
