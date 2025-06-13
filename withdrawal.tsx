import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bitcoin");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const withdrawalMutation = useMutation({
    mutationFn: async (data: { 
      amount: number; 
      type: string; 
      paymentMethod: string; 
      walletAddress: string;
      currency: string;
    }) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Withdrawal failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully!",
      });
      setAmount("");
      setAddress("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Withdrawal failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const currentBalance = user?.balance || 0;
    
    if (amountInCents < 1000) {
      toast({
        title: "Error",
        description: "Minimum withdrawal amount is $10.00",
        variant: "destructive",
      });
      return;
    }
    
    if (amountInCents > currentBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }
    
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid withdrawal address",
        variant: "destructive",
      });
      return;
    }
    
    withdrawalMutation.mutate({ 
      amount: amountInCents, 
      type: "withdrawal",
      paymentMethod: selectedMethod,
      walletAddress: address,
      currency: "USD"
    });
  };

  const withdrawalMethods = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      icon: "fab fa-bitcoin",
      fee: "0.001 BTC",
      time: "10-30 min",
      minAmount: "$10"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: "fab fa-ethereum",
      fee: "0.005 ETH",
      time: "5-15 min",
      minAmount: "$10"
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      icon: "fas fa-dollar-sign",
      fee: "1 USDT",
      time: "5-10 min",
      minAmount: "$10"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "fas fa-university",
      fee: "2%",
      time: "2-5 days",
      minAmount: "$50"
    }
  ];

  const selectedWithdrawalMethod = withdrawalMethods.find(m => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Withdraw Funds</h1>
            <p className="text-muted-foreground">Withdraw your earnings securely</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                <p className="text-3xl font-bold text-green-500">
                  ${((user?.balance || 0) / 100).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="10"
                      step="0.01"
                      max={((user?.balance || 0) / 100).toString()}
                      required
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Available: ${((user?.balance || 0) / 100).toFixed(2)} • Min: $10.00
                    </p>
                  </div>

                  <div>
                    <Label>Withdrawal Method</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {withdrawalMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 border rounded-lg text-left transition-colors ${
                            selectedMethod === method.id
                              ? "border-green-500 bg-green-500/10"
                              : "border-border hover:border-green-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <i className={`${method.icon} text-lg`} />
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Fee: {method.fee} • {method.time}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Min: {method.minAmount}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">
                      {selectedWithdrawalMethod?.name} Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder={`Enter your ${selectedWithdrawalMethod?.name} address`}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Double-check your address. Incorrect addresses may result in permanent loss.
                    </p>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Warning:</strong> Withdrawals are irreversible. Please verify your 
                      address carefully before submitting.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={withdrawalMutation.isPending}
                  >
                    {withdrawalMutation.isPending ? "Processing..." : "Submit Withdrawal Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Withdrawal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Processing Times</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cryptocurrency:</span>
                      <span className="text-muted-foreground">5-30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank Transfer:</span>
                      <span className="text-muted-foreground">2-5 business days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Withdrawal Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Minimum:</span>
                      <span className="text-muted-foreground">$10.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Limit:</span>
                      <span className="text-muted-foreground">$10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Limit:</span>
                      <span className="text-muted-foreground">$100,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Important Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All withdrawals are reviewed for security</li>
                    <li>Processing may take longer during high volume</li>
                    <li>Network fees are deducted from withdrawal amount</li>
                    <li>Withdrawals to new addresses may require additional verification</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Security:</strong> For your protection, large withdrawals may require 
                    additional verification. Contact support if you need assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}