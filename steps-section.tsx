import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function StepsSection() {
  const steps = [
    {
      number: "#1",
      title: "REGISTRATION",
      description: "Click the Register button. Fill in your details to create a FREE Genius Trading Platform account in seconds",
      color: "bg-green-500",
      icon: "fas fa-user-plus",
    },
    {
      number: "#2",
      title: "CHOOSE INVESTMENT PLAN",
      description: "We offer a variety of investment plans to suit your financial goals. After trading, make a deposit",
      color: "bg-teal-500",
      icon: "fas fa-chart-pie",
    },
    {
      number: "After 1 Deposit",
      title: "START EARNING",
      description: "Begin receiving daily returns on your investment through our automated trading systems",
      color: "bg-blue-500",
      icon: "fas fa-coins",
    },
  ];

  const companyStats = [
    { value: "2163", label: "Days in Work", color: "text-green-500" },
    { value: "338403569 USD", label: "Total Invested", color: "text-teal-500" },
    { value: "101683885 USD", label: "Total Paid", color: "text-blue-500" },
  ];

  return (
    <>
      {/* 3 Steps Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              3 STEPS TO START
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="glassmorphism h-full relative">
                  <div className={`absolute -top-4 left-4 px-3 py-1 ${step.color} rounded-full text-xs font-bold text-white`}>
                    {step.number}
                  </div>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="mb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <i className={`${step.icon} text-2xl text-white`} />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4 text-green-500">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Registration Section */}
      <section className="py-20 bg-card/50 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-2 border border-green-500 rounded-full text-green-500 mb-6">
              INVEST WITH US AND GET STABLE INCOME
            </div>
            <h2 className="text-4xl font-bold mb-4">OFFICIALLY REGISTERED COMPANY</h2>
            <p className="text-2xl text-green-500 font-bold">#13699699</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glassmorphism max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">OFFICIAL LICENSE</h3>
                <p className="text-muted-foreground mb-8">
                  Genius Trading Platform is registered and has official permission for investment and trading activities.
                  The services of our company are available to every investor from anywhere in the world.
                </p>

                <div className="flex justify-center mb-8">
                  <motion.div
                    className="w-64 h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <i className="fas fa-certificate text-6xl text-green-500/50 mb-2" />
                      <p className="text-muted-foreground text-sm">Official Certificate</p>
                    </div>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {companyStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="glassmorphism">
                        <CardContent className="p-4">
                          <div className={`${stat.color} text-2xl font-bold mb-2`}>
                            {stat.value}
                          </div>
                          <p className="text-muted-foreground text-sm">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-sm font-medium mb-4">
              PROGRAM 2% - 1%
            </div>
            <p className="text-muted-foreground mb-2">Get extra profit when people in your</p>
            <p className="text-muted-foreground mb-6">structure invite new investors to the company</p>
            <div className="flex items-center justify-center space-x-2">
              <i className="fab fa-bitcoin text-orange-400" />
              <span className="text-green-500 text-sm">
                Earning Great Profits UAUSLAMMA has just earned $9699!
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glassmorphism max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold mb-8">VIDEO PRESENTATION</h3>
                <motion.div
                  className="bg-background rounded-lg p-8 mb-8 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-play text-3xl text-white" />
                  </div>
                  <p className="text-muted-foreground">Click to watch our investment presentation</p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-6 text-center">
                  {[
                    { icon: "fas fa-clock", text: "ROBOT TRADING WITHOUT WEEKENDS AND HOLIDAYS", color: "text-green-500" },
                    { icon: "fas fa-exchange-alt", text: "WITHDRAWAL 24/7", color: "text-teal-500" },
                    { icon: "fas fa-credit-card", text: "BIG NUMBER OF PAYMENT SYSTEMS", color: "text-blue-500" },
                    { icon: "fas fa-shield-alt", text: "100% SAFE TRANSPARENT WORK GUARANTEED", color: "text-green-500" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="glassmorphism">
                        <CardContent className="p-4">
                          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`${item.icon} ${item.color}`} />
                          </div>
                          <p className="text-xs text-muted-foreground">{item.text}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}
