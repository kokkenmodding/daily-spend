
import React, { useEffect } from "react";
import AdSpendCalculator from "@/components/AdSpendCalculator";

const Index: React.FC = () => {
  // Add a fade-in animation to the entire page
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-2 sm:py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <AdSpendCalculator />
      </div>
    </div>
  );
};

export default Index;
