import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import InvestmentCalculator from "./investment-calculator";

export default function InvestmentPlans() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const plans = [
    {
      name: "BEGINNER",
      percentage: "50%",
      period: "DAILY",
      deposit: "$1000 - $4999",
      duration: "2 MONTHS",
      color: "from-green-500 to-teal-500",
      textColor: "text-green-500",
    },
    {
      name: "BASIC PLAN",
      percentage: "50%",
      period: "DAILY",
      deposit: "$5000 - $9999",
      duration: "3 MONTHS",
      color: "from-teal-500 to-blue-500",
      textColor: "text-teal-500",
      featured: true,
    },
    {
      name: "PRO",
      percentage: "100%",
      period: "DAILY",
      deposit: "$10000 - $19999",
      duration: "4 MONTHS",
      color: "from-blue-500 to-green-500",
      textColor: "text-blue-500",
    },
  ];

  return (
    <section id="investment" className="py-20 bg-card/50 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            INVESTMENT PROPOSALS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Genius Trading Platform employees ensure that every investor in our company can earn money
          </p>
          <div className="flex items-center justify-center space-x-2">
            <i className="fab fa-bitcoin text-orange-400 text-xl" />
            <span className="text-green-500 font-medium">
              Earning Great Profits UAE has just earned $9999.
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={plan.featured ? "transform scale-105" : ""}
            >
              <div className="gradient-border">
                <Card className="gradient-border-content text-center h-full">
                  <CardContent className="p-6">
                    <motion.div
                      className={`text-6xl font-bold mb-4 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plan.percentage}
                    </motion.div>
                    <h3 className={`text-xl font-semibold mb-2 ${plan.textColor}`}>
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{plan.period}</p>
                    <div className="mb-6">
                      <p className="text-muted-foreground">DEPOSIT</p>
                      <p className="text-2xl font-bold text-foreground">{plan.deposit}</p>
                    </div>
                    <p className={`${plan.textColor} font-semibold mb-6`}>{plan.duration}</p>
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all`}
                      onClick={() => {
                        setSelectedPlan(plan.name);
                        setCalculatorOpen(true);
                      }}
                    >
                      CALCULATE PROFIT
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glassmorphism">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-minus text-green-500 mr-2" />
                    COMPANY COMMISSION
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    0.5% from the received profit by the robot. This commission shows the earnings of the entire Genius Trading Platform structure, namely, each employee.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-minus text-teal-500 mr-2" />
                    ADMINISTRATIVE COMMISSION
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    0.5% for technical support of the robot and the company as a whole. This commission includes the development and marketing costs of the company.
                  </p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-teal-500">GENERAL COMMISSIONS</h3>
                <p className="text-muted-foreground">
                  These commissions are charged by Genius Trading Platform for the platform to work. They are not related to the profit received by our investors.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <InvestmentCalculator 
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
}
