import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bitcoin");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: depositAddresses = [] } = useQuery<{id: number, method: string, address: string}[]>({
    queryKey: ["/api/deposit-addresses"],
    retry: false,
  });

  const depositMutation = useMutation({
    mutationFn: async (data: { amount: number; type: string; paymentMethod: string; currency: string }) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Deposit failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Deposit request submitted successfully!",
      });
      setAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Deposit failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (amountInCents < 100) {
      toast({
        title: "Error",
        description: "Minimum deposit amount is $1.00",
        variant: "destructive",
      });
      return;
    }
    depositMutation.mutate({ 
      amount: amountInCents, 
      type: "deposit",
      paymentMethod: selectedMethod,
      currency: "USD"
    });
  };

  const paymentMethods = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      icon: "fab fa-bitcoin",
      fee: "0.5%",
      time: "10-30 min"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: "fab fa-ethereum",
      fee: "0.3%",
      time: "5-15 min"
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      icon: "fas fa-dollar-sign",
      fee: "0.1%",
      time: "5-10 min"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "fas fa-university",
      fee: "1%",
      time: "1-3 days"
    }
  ];

  const getSelectedMethodData = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    const addressData = depositAddresses.find(addr => addr.method === selectedMethod);
    return { ...method, address: addressData?.address || "Address not configured" };
  };

  const selectedPaymentMethod = getSelectedMethodData();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Make a Deposit</h1>
            <p className="text-muted-foreground">Add funds to your trading account</p>
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
                <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                <p className="text-3xl font-bold text-green-500">
                  ${((user?.balance || 0) / 100).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Deposit Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Deposit Amount</CardTitle>
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
                      min="1"
                      step="0.01"
                      required
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Minimum deposit: $1.00
                    </p>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {paymentMethods.map((method) => (
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
                          <div className="flex items-center gap-3">
                            <i className={`${method.icon} text-lg`} />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Fee: {method.fee} • {method.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={depositMutation.isPending}
                  >
                    {depositMutation.isPending ? "Processing..." : "Submit Deposit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedPaymentMethod && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <i className={`${selectedPaymentMethod.icon} text-2xl text-green-500`} />
                      <div>
                        <p className="font-semibold">{selectedPaymentMethod.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Fee: {selectedPaymentMethod.fee}</span>
                          <span>Time: {selectedPaymentMethod.time}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Payment Address/Details</Label>
                      <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                        {selectedPaymentMethod.address}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPaymentMethod.address);
                          toast({
                            title: "Copied",
                            description: "Address copied to clipboard",
                          });
                        }}
                      >
                        Copy Address
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Send the exact amount to the address above</li>
                        <li>Submit the deposit request with the same amount</li>
                        <li>Wait for network confirmation</li>
                        <li>Your balance will be updated automatically</li>
                      </ol>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Important:</strong> Make sure to send the exact amount specified. 
                        Deposits may take up to {selectedPaymentMethod.time} to process.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}