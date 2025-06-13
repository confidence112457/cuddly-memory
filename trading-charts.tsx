import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

export default function TradingCharts() {
  const [currentPrice, setCurrentPrice] = useState(104754);
  const [priceChange, setPriceChange] = useState(2.3);
  const [chartData, setChartData] = useState<{time: string, price: number}[]>([]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 1000;
      const newPrice = Math.max(100000, currentPrice + change);
      const newChange = ((newPrice - 104754) / 104754) * 100;
      
      setCurrentPrice(newPrice);
      setPriceChange(newChange);
      
      setChartData(prevData => {
        const newData = [...prevData, {
          time: new Date().toLocaleTimeString(),
          price: newPrice,
        }];
        return newData.slice(-20); // Keep last 20 data points
      });
    }, 2000);

    // Initialize with some data
    const initData = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(Date.now() - i * 2000);
      initData.push({
        time: time.toLocaleTimeString(),
        price: 104754 + (Math.random() - 0.5) * 2000,
      });
    }
    setChartData(initData);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const tradingFeatures = [
    {
      icon: "fas fa-chart-pie",
      title: "UNIQUE TRADING BOT",
      description: "Advanced AI algorithms analyze market trends and execute trades automatically for optimal returns.",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "fas fa-shield-alt",
      title: "STABLE AND AUTOMATED",
      description: "Secure, reliable trading platform with automated risk management and portfolio optimization.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section id="trading" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            BEST GENIUS TRADING PLATFORM TRADERS
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The best cryptocurrency developers work in our company. They have a wealth of experience and understanding of the crypto market behind them. They brought Genius Trading Platform to the world level of development.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <i className="fab fa-bitcoin text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Bitcoin BTC</h3>
                    <p className="text-3xl font-bold text-green-500">
                      ${currentPrice.toLocaleString()} <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-500">
                    AVG. BTCUSD
                  </Button>
                  <Button size="sm" variant="secondary">
                    Log
                  </Button>
                  <Button size="sm" variant="secondary">
                    OHLC
                  </Button>
                </div>
              </div>

              <div className="h-64 mb-4 relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={['dataMin - 500', 'dataMax + 500']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'BTC Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray={chartData.length > 0 ? "0" : "5 5"}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center">
                <Button className="bg-green-500 hover:bg-green-600">
                  <i className="fas fa-chart-area mr-2" />
                  Avg. BTCUSD
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {tradingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glassmorphism h-full">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className={`${feature.icon} text-3xl text-white`} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
