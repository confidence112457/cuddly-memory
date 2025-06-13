import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import robotImage from "@assets/IMG_3398_1749816346943.jpeg";

interface HeroSectionProps {
  onLoginClick?: () => void;
}

export default function HeroSection({ onLoginClick }: HeroSectionProps) {
  const features = [
    {
      icon: "fas fa-users",
      title: "Professional Crypto Industry Development Team",
      description: "Expert developers with years of experience in cryptocurrency markets",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "fas fa-robot",
      title: "Unique robot for trading without user intervention",
      description: "AI-powered automated trading systems for optimal performance",
      gradient: "from-teal-500 to-blue-500",
    },
    {
      icon: "fas fa-cogs",
      title: "Manage operations without user intervention",
      description: "Fully automated portfolio management and risk assessment",
      gradient: "from-blue-500 to-green-500",
    },
  ];

  return (
    <section id="home" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={robotImage}
          alt="AI Trading Robot Background"
          className="w-full h-full object-cover opacity-15"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/85" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-500 to-teal-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              SAFE INVESTMENT WITH US
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              GET LIFETIME INCOME ON INVESTMENT - Professional cryptocurrency trading platform with advanced AI-powered algorithms
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={onLoginClick}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg hover:shadow-green-500/25 text-lg px-8 py-4 animate-glow"
              >
                LOGIN/REGISTER
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Featured image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <motion.img
                src={robotImage}
                alt="AI Trading Robot Technology"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl border border-green-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Trading Robot</h3>
                <p className="text-white/80">Advanced artificial intelligence for automated cryptocurrency trading</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
            >
              <Card className="glassmorphism h-full">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className={`${feature.icon} text-2xl text-white`} />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
