import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface InvestmentPlan {
  name: string;
  dailyReturn: number;
  duration: number;
  minDeposit: number;
  maxDeposit: number;
}

const investmentPlans: InvestmentPlan[] = [
  {
    name: "starter",
    dailyReturn: 2.5,
    duration: 30,
    minDeposit: 10000, // $100
    maxDeposit: 100000 // $1000
  },
  {
    name: "professional",
    dailyReturn: 4.0,
    duration: 60,
    minDeposit: 100000, // $1000
    maxDeposit: 500000 // $5000
  },
  {
    name: "premium",
    dailyReturn: 6.0,
    duration: 90,
    minDeposit: 500000, // $5000
    maxDeposit: 2000000 // $20000
  }
];

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

export default function InvestmentCalculator({ isOpen, onClose, selectedPlan }: CalculatorProps) {
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(selectedPlan || "starter");
  const [results, setResults] = useState<{
    dailyProfit: number;
    totalProfit: number;
    totalReturn: number;
  } | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createInvestmentMutation = useMutation({
    mutationFn: async (data: { planType: string; amount: number; dailyReturn: number; duration: number }) => {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Investment creation failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Investment Created",
        description: "Your investment has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      onClose();
      setAmount("");
      setResults(null);
    },
    onError: (error) => {
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "Failed to create investment",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      setPlan(selectedPlan);
    }
  }, [selectedPlan]);

  const calculateProfit = () => {
    const investmentAmount = parseFloat(amount);
    if (!investmentAmount || investmentAmount <= 0) return;

    const selectedPlanData = investmentPlans.find(p => p.name === plan);
    if (!selectedPlanData) return;

    // Convert user input (dollars) to cents for comparison
    const amountInCents = investmentAmount * 100;
    if (amountInCents < selectedPlanData.minDeposit || amountInCents > selectedPlanData.maxDeposit) {
      return;
    }

    const dailyProfit = (investmentAmount * selectedPlanData.dailyReturn) / 100;
    const totalProfit = dailyProfit * selectedPlanData.duration;
    const totalReturn = investmentAmount + totalProfit;

    setResults({
      dailyProfit,
      totalProfit,
      totalReturn
    });
  };

  const handleInvestment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make an investment",
        variant: "destructive",
      });
      return;
    }

    if (user.kycStatus !== "approved" && user.role !== "admin") {
      toast({
        title: "KYC Required", 
        description: "Please complete KYC verification before investing",
        variant: "destructive",
      });
      return;
    }

    const investmentAmount = parseFloat(amount);
    const selectedPlanData = investmentPlans.find(p => p.name === plan);
    
    if (!selectedPlanData || !investmentAmount) {
      toast({
        title: "Invalid Investment",
        description: "Please enter a valid amount and select a plan",
        variant: "destructive",
      });
      return;
    }

    // Check if user has sufficient balance
    const userBalance = user.balance || 0;
    const amountInCents = Math.round(investmentAmount * 100);
    
    if (userBalance < amountInCents) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit funds before making an investment",
        variant: "destructive",
      });
      return;
    }

    // Calculate daily return in cents
    const dailyReturnInCents = Math.round((selectedPlanData.dailyReturn * amountInCents) / 100);

    createInvestmentMutation.mutate({
      planType: plan,
      amount: amountInCents,
      dailyReturn: dailyReturnInCents,
      duration: selectedPlanData.duration,
    });
  };

  const selectedPlanData = investmentPlans.find(p => p.name === plan);
  const investmentAmount = parseFloat(amount);
  const amountInCents = investmentAmount * 100;
  const isValidAmount = amountInCents >= (selectedPlanData?.minDeposit || 0) && 
                       amountInCents <= (selectedPlanData?.maxDeposit || Infinity);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glassmorphism">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle>Investment Calculator</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="plan">Investment Plan</Label>
                    <Select value={plan} onValueChange={setPlan}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentPlans.map((planOption) => (
                          <SelectItem key={planOption.name} value={planOption.name}>
                            {planOption.name} ({planOption.dailyReturn}% daily)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Investment Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                    {selectedPlanData && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Range: ${(selectedPlanData.minDeposit / 100).toLocaleString()} - ${(selectedPlanData.maxDeposit / 100).toLocaleString()}
                      </p>
                    )}
                    {amount && !isValidAmount && selectedPlanData && (
                      <p className="text-xs text-red-500 mt-1">
                        Amount must be between ${(selectedPlanData.minDeposit / 100).toLocaleString()} and ${(selectedPlanData.maxDeposit / 100).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={calculateProfit}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500"
                    disabled={!amount || !isValidAmount}
                  >
                    Calculate Profit
                  </Button>
                </div>

                <AnimatePresence>
                  {results && selectedPlanData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <h3 className="font-semibold text-center">Profit Calculation</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="bg-muted/50 rounded-lg p-3 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Daily Profit</p>
                          <p className="font-semibold text-green-500">
                            ${results.dailyProfit.toFixed(2)}
                          </p>
                        </motion.div>
                        
                        <motion.div
                          className="bg-muted/50 rounded-lg p-3 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold text-blue-500">
                            {selectedPlanData.duration} days
                          </p>
                        </motion.div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
                        <p className="text-2xl font-bold text-green-500">
                          ${results.totalProfit.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total Return: ${results.totalReturn.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="text-center text-xs text-muted-foreground mb-4">
                        <p>* Calculations are estimates based on current rates</p>
                        <p>* Actual returns may vary based on market conditions</p>
                      </div>
                      
                      <Button
                        onClick={handleInvestment}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        disabled={createInvestmentMutation.isPending}
                      >
                        {createInvestmentMutation.isPending ? "Creating Investment..." : "Invest Now"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}