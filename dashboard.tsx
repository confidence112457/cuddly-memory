import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { TrendingUp, Wallet, Shield, CreditCard, AlertCircle, CheckCircle, Clock, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Investment {
  id: string;
  userId: string;
  planType: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
    retry: false,
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { data: kycData } = useQuery({
    queryKey: ["/api/kyc"],
    retry: false,
  });

  const totalInvested = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
  const totalReturns = transactions
    .filter((t: any) => t.type === 'profit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  // Animate number counters
  useEffect(() => {
    const balanceTarget = (user?.balance || 0) / 100;
    const profitTarget = totalReturns / 100;
    
    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        setter(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    animateValue(animatedBalance, balanceTarget, setAnimatedBalance);
    animateValue(animatedProfit, profitTarget, setAnimatedProfit);
  }, [user?.balance, totalReturns]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getKycStatusMessage = () => {
    if (!user) return null;
    
    switch (user.kycStatus) {
      case "pending":
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          message: "KYC verification in progress",
          action: "View Status",
          href: "/kyc"
        };
      case "rejected":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          message: "KYC verification rejected",
          action: "Resubmit",
          href: "/kyc"
        };
      case "approved":
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          message: "KYC verification completed",
          action: null,
          href: null
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
          message: "Complete KYC verification",
          action: "Start Verification",
          href: "/kyc"
        };
    }
  };

  const kycStatus = getKycStatusMessage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg font-medium mt-2">Welcome back, {user?.firstName || user?.username}</p>
          </div>
          <div className="flex gap-4">
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="secondary">
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link href="/deposit">
              <Button className="bg-green-500 hover:bg-green-600">
                Deposit
              </Button>
            </Link>
            <Link href="/withdrawal">
              <Button variant="outline">
                Withdraw
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>

        {/* KYC Status Banner */}
        {kycStatus && kycStatus.action && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {kycStatus.icon}
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">
                        {kycStatus.message}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        Complete your identity verification to access all platform features
                      </p>
                    </div>
                  </div>
                  <Link href={kycStatus.href!}>
                    <Button 
                      variant="outline" 
                      className="border-orange-500 text-orange-700 hover:bg-orange-500 hover:text-white"
                    >
                      {kycStatus.action}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Wallet className="w-4 h-4 text-green-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ${animatedBalance.toFixed(2)}
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                  Available funds
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Invested
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totalInvested / 100).toFixed(2)}
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <BarChart3 className="w-3 h-3 mr-1 text-blue-500" />
                  Active investments
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Returns
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DollarSign className="w-4 h-4 text-teal-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-500">
                  ${animatedProfit.toFixed(2)}
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 mr-1 text-teal-500" />
                  Profit earned
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Investments
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className="w-4 h-4 text-purple-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  {investments.length}
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 mr-1 text-purple-500" />
                  Running plans
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Investments */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Active Investments</CardTitle>
              </CardHeader>
              <CardContent>
                {investments.length > 0 ? (
                  <div className="space-y-4">
                    {investments.map((investment: any) => (
                      <div key={investment.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold capitalize">{investment.planType} Plan</p>
                          <p className="text-sm text-muted-foreground">
                            ${(investment.amount / 100).toFixed(2)} • {investment.duration} months
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                            {investment.status}
                          </Badge>
                          <p className="text-sm text-green-500 mt-1">
                            +${(investment.dailyReturn / 100).toFixed(2)}/day
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active investments</p>
                    <Link href="/investments">
                      <Button variant="outline">Browse Investment Plans</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction: any) => (
                      <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold capitalize">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'deposit' || transaction.type === 'profit' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {transaction.type === 'withdrawal' ? '-' : '+'}${(transaction.amount / 100).toFixed(2)}
                          </p>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}