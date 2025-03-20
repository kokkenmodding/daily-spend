
import React from "react";

const CalculatorHeader: React.FC = () => {
  return (
    <div className="w-full mb-10 animate-fade-up">
      <div className="mb-4">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full">
          AD BUDGET CALCULATOR
        </div>
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
          Daily Ad Spend
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Calculate your optimal daily ad spend based on your campaign duration and total budget.
        </p>
      </div>
    </div>
  );
};

export default CalculatorHeader;
