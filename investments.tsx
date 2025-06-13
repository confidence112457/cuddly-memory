import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, Shield, Clock, DollarSign, CheckCircle, Star, ArrowRight } from "lucide-react";
import InvestmentCalculator from "@/components/investment-calculator";

const investmentPlans = [
  {
    name: "starter",
    title: "Starter Plan",
    description: "Perfect for beginners looking to start their investment journey",
    dailyReturn: 2.5,
    duration: 30,
    minDeposit: 10000, // $100
    maxDeposit: 100000, // $1000
    features: [
      "2.5% daily returns",
      "30-day investment period",
      "24/7 customer support",
      "Real-time portfolio tracking"
    ],
    color: "from-green-400 to-green-600",
    popular: false
  },
  {
    name: "professional",
    title: "Professional Plan",
    description: "Ideal for experienced investors seeking higher returns",
    dailyReturn: 4.0,
    duration: 60,
    minDeposit: 100000, // $1000
    maxDeposit: 500000, // $5000
    features: [
      "4.0% daily returns",
      "60-day investment period",
      "Priority customer support",
      "Advanced analytics dashboard",
      "Dedicated account manager"
    ],
    color: "from-blue-400 to-blue-600",
    popular: true
  },
  {
    name: "premium",
    title: "Premium Plan",
    description: "Maximum returns for high-value investors",
    dailyReturn: 6.0,
    duration: 90,
    minDeposit: 500000, // $5000
    maxDeposit: 2000000, // $20000
    features: [
      "6.0% daily returns",
      "90-day investment period",
      "VIP customer support",
      "Custom investment strategies",
      "Personal investment advisor",
      "Exclusive market insights"
    ],
    color: "from-purple-400 to-purple-600",
    popular: false
  }
];

export default function InvestmentPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showCalculator, setShowCalculator] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const calculateTotalReturn = (plan: any) => {
    const dailyReturn = plan.dailyReturn / 100;
    const totalReturn = plan.minDeposit * dailyReturn * plan.duration;
    return totalReturn;
  };

  const handleInvestNow = (planName: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = "/#login";
      return;
    }
    
    if (user.kycStatus !== "approved") {
      // Redirect to KYC
      window.location.href = "/kyc";
      return;
    }
    
    setSelectedPlan(planName);
    setShowCalculator(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Investment Plans
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Choose from our carefully crafted investment plans designed to maximize your returns while minimizing risk.
          </motion.p>
        </div>

        {/* Investment Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {investmentPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
                plan.popular ? 'border-blue-400 shadow-lg shadow-blue-400/20' : 'border-border'
              } hover:shadow-2xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5`} />
                
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{plan.description}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${plan.color} bg-opacity-20`}>
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Returns */}
                  <div className="text-center">
                    <div className={`text-4xl font-extrabold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.dailyReturn}%
                    </div>
                    <p className="text-sm text-muted-foreground">Daily Returns</p>
                  </div>

                  {/* Investment Range */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Investment Range</span>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(plan.minDeposit)} - {formatCurrency(plan.maxDeposit)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {plan.duration} days duration
                    </div>
                  </div>

                  {/* Projected Returns */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Projected Total Return</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculateTotalReturn(plan))}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Based on minimum investment
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-300 text-white font-semibold py-3 text-lg`}
                    onClick={() => handleInvestNow(plan.name)}
                  >
                    Invest Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted/50 p-8 rounded-xl text-center"
        >
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Secure & Regulated</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All investments are secured with industry-leading encryption and are fully regulated. 
            Your funds are protected by comprehensive insurance coverage.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">
                View Dashboard
              </Button>
            </Link>
            {!user && (
              <Link href="/#login">
                <Button>
                  Sign Up to Invest
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Investment Calculator Modal */}
      <InvestmentCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}