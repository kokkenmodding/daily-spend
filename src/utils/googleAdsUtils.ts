
import { toast } from "@/hooks/use-toast";

// Types for Google Ads API responses
export interface GoogleAdsAccount {
  id: string;
  name: string;
}

export interface GoogleAdsCostData {
  cost: number;
  currency: string;
  startDate: string;
  endDate: string;
}

// Mock Google Ads accounts for demonstration
// In a real implementation, this would come from the Google Ads API
const MOCK_ACCOUNTS: GoogleAdsAccount[] = [
  { id: "1234567890", name: "Main Marketing Account" },
  { id: "2345678901", name: "Brand Awareness Campaign" },
  { id: "3456789012", name: "Performance Marketing" },
  { id: "4567890123", name: "Retargeting Account" },
];

// Check if user is authenticated with Google
export const isGoogleAuthenticated = (): boolean => {
  return localStorage.getItem("google_ads_token") !== null;
};

// Mock authentication with Google
export const authenticateWithGoogle = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate authentication delay
    setTimeout(() => {
      localStorage.setItem("google_ads_token", "mock_token_" + Date.now());
      toast({
        title: "Successfully connected to Google Ads",
        description: "Your Google Ads account is now connected",
      });
      resolve(true);
    }, 1500);
  });
};

// Logout from Google
export const logoutFromGoogle = (): void => {
  localStorage.removeItem("google_ads_token");
  toast({
    title: "Disconnected from Google Ads",
    description: "Your Google Ads account has been disconnected",
  });
};

// Fetch available Google Ads accounts
export const fetchGoogleAdsAccounts = (): Promise<GoogleAdsAccount[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(MOCK_ACCOUNTS);
    }, 800);
  });
};

// Fetch cost data from Google Ads for a specific account and date range
export const fetchGoogleAdsCost = (
  accountId: string,
  startDate: Date,
  endDate: Date
): Promise<GoogleAdsCostData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate a realistic cost based on the date range
      const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const dailyCost = Math.floor(Math.random() * 50) + 30; // Random daily cost between $30-80
      const totalCost = days * dailyCost;
      
      resolve({
        cost: totalCost,
        currency: "USD",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    }, 1200);
  });
};
