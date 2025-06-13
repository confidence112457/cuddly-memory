import { motion } from "framer-motion";

interface PriceTickerProps {
  reverse?: boolean;
}

export default function PriceTicker({ reverse = false }: PriceTickerProps) {
  const prices = [
    { symbol: "BTC/USD", price: "$104,754", change: "+2.3%", positive: true, icon: "fab fa-bitcoin", color: "text-orange-400" },
    { symbol: "ETH/USD", price: "$2,533", change: "-1.2%", positive: false, icon: "fab fa-ethereum", color: "text-blue-400" },
    { symbol: "SPX500USD", price: "$6,081.5", change: "+0.8%", positive: true },
    { symbol: "NASDAQ", price: "$21,625.9", change: "+1.5%", positive: true },
    { symbol: "DOW 30", price: "$42,801.8", change: "-0.3%", positive: false },
    { symbol: "LTC/USD", price: "$105.67", change: "+3.2%", positive: true, icon: "fas fa-coins", color: "text-yellow-400" },
  ];

  return (
    <div className="bg-card border-b border-border py-2 relative z-10">
      <div className="overflow-hidden whitespace-nowrap">
        <motion.div
          className={reverse ? "ticker-content-reverse" : "ticker-content"}
          animate={{
            x: reverse ? [0, -2000] : [-2000, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="inline-flex">
              {prices.map((item, idx) => (
                <span key={idx} className="inline-block mx-6 text-sm">
                  {item.icon && <i className={`${item.icon} ${item.color} mr-1`} />}
                  <span className="text-muted-foreground">{item.symbol}</span>{" "}
                  <span className={item.positive ? "text-green-500" : "text-red-500"}>
                    {item.price} {item.change}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
