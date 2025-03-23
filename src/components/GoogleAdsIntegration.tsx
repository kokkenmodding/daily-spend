
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { 
  isGoogleAuthenticated, 
  authenticateWithGoogle,
  logoutFromGoogle,
  fetchGoogleAdsAccounts,
  fetchGoogleAdsCost,
  GoogleAdsAccount
} from "@/utils/googleAdsUtils";

interface GoogleAdsIntegrationProps {
  startDate: Date | null;
  intermediateDate: Date | null;
  onCostFetched: (cost: number) => void;
  isEnabled: boolean;
}

const GoogleAdsIntegration: React.FC<GoogleAdsIntegrationProps> = ({ 
  startDate, 
  intermediateDate, 
  onCostFetched,
  isEnabled
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingCost, setIsFetchingCost] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    setIsAuthenticated(isGoogleAuthenticated());
  }, []);

  // Fetch accounts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
    }
  }, [isAuthenticated]);

  // Handle authentication
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const success = await authenticateWithGoogle();
      if (success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to authenticate with Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnection
  const handleDisconnect = () => {
    logoutFromGoogle();
    setIsAuthenticated(false);
    setAccounts([]);
    setSelectedAccountId("");
  };

  // Fetch Google Ads accounts
  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const accountsData = await fetchGoogleAdsAccounts();
      setAccounts(accountsData);
      if (accountsData.length > 0) {
        setSelectedAccountId(accountsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch Google Ads accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account selection
  const handleAccountChange = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  // Fetch cost data
  const handleFetchCost = async () => {
    if (!startDate || !intermediateDate || !selectedAccountId) return;

    setIsFetchingCost(true);
    try {
      const costData = await fetchGoogleAdsCost(selectedAccountId, startDate, intermediateDate);
      onCostFetched(costData.cost);
    } catch (error) {
      console.error("Failed to fetch Google Ads cost:", error);
    } finally {
      setIsFetchingCost(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
      <h3 className="text-base font-medium">Google Ads Integration</h3>
      
      {!isAuthenticated ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Connect to Google Ads to automatically fetch your campaign costs.
          </p>
          <Button 
            onClick={handleConnect} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect Google Ads
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Connected to Google Ads</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Select Account
            </label>
            <Select 
              value={selectedAccountId} 
              onValueChange={handleAccountChange}
              disabled={isLoading || accounts.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Google Ads account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button 
              onClick={handleFetchCost} 
              className="w-full"
              disabled={isFetchingCost || !startDate || !intermediateDate || !selectedAccountId}
            >
              {isFetchingCost && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFetchingCost ? "Fetching cost..." : "Fetch Cost from Google Ads"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Will fetch cost data from {startDate?.toLocaleDateString()} to {intermediateDate?.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAdsIntegration;
