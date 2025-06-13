import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentMethods() {
  const paymentMethods = [
    { name: "Bitcoin", icon: "fab fa-bitcoin", color: "text-orange-400" },
    { name: "Ethereum", icon: "fab fa-ethereum", color: "text-blue-400" },
    { name: "TRC-20", color: "bg-teal-500" },
    { name: "ERC-20", color: "bg-green-400" },
    { name: "Dogecoin", color: "bg-yellow-400" },
    { name: "TRON", color: "bg-red-400" },
    { name: "Litecoin", icon: "fas fa-coins", color: "text-gray-400" },
    { name: "Perfect Money", color: "bg-blue-500" },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">PAYMENT SYSTEMS</h2>
          <p className="text-muted-foreground mb-8">Genius Trading Platform supports a big number of payment systems</p>
          <p className="text-muted-foreground">
            Our company does not charge commissions for opening a deposit, as well as withdrawing funds from the platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glassmorphism">
            <CardContent className="p-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Button className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg text-lg font-semibold mb-8">
                  INVEST
                </Button>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="glassmorphism">
                      <CardContent className="flex items-center justify-center p-4">
                        {method.icon ? (
                          <i className={`${method.icon} ${method.color} text-2xl mr-2`} />
                        ) : (
                          <div className={`w-6 h-6 ${method.color} rounded-full mr-2`} />
                        )}
                        <span className="text-sm">{method.name}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground mb-4">
                  PAYMENT SYSTEMS - Genius Trading Platform supports a big number of payment systems
                </p>
                <p className="text-muted-foreground">
                  Our company does not charge commissions for opening a deposit, as well as withdrawing funds from the platform
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
