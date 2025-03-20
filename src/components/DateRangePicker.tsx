
import React from "react";
import { format } from "date-fns";
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

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-fade-up" style={{ animationDelay: "50ms" }}>
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
              disabled={(date) => endDate ? date > endDate : false}
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
  );
};

export default DateRangePicker;
