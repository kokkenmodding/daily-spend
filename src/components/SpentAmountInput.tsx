
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface SpentAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  isDisabled: boolean;
}

const SpentAmountInput: React.FC<SpentAmountInputProps> = ({ value, onChange, isDisabled }) => {
  const [inputValue, setInputValue] = useState<string>(value > 0 ? value.toString() : "");

  // Update the input value when the prop changes
  useEffect(() => {
    setInputValue(value > 0 ? value.toString() : "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Only allow numbers and decimal points
    if (rawValue === "" || /^[0-9]*\.?[0-9]*$/.test(rawValue)) {
      setInputValue(rawValue);
      
      // Update the parent component with the numeric value
      const numericValue = parseFloat(rawValue);
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      } else {
        onChange(0);
      }
    }
  };

  return (
    <div className="space-y-2 animate-fade-up" style={{ animationDelay: "125ms" }}>
      <label htmlFor="spent-amount" className="block text-sm font-medium text-muted-foreground">
        Amount Spent So Far
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <DollarSign className="w-5 h-5 text-muted-foreground" />
        </div>
        <Input
          id="spent-amount"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter amount spent so far"
          className="pl-10 border-input bg-background transition-all-200 focus-visible:ring-1 focus-visible:ring-primary"
          disabled={isDisabled}
        />
      </div>
      {isDisabled && (
        <p className="text-xs text-muted-foreground">
          Select an intermediate date to track your spending
        </p>
      )}
    </div>
  );
};

export default SpentAmountInput;
