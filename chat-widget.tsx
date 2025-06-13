import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleChatClick = () => {
    // Mock chat functionality
    alert("Chat support will be available soon!");
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleChatClick}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg hover:shadow-green-500/25 p-0"
          >
            <i className="fas fa-comments text-xl" />
          </Button>
        </motion.div>
        
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-bold text-white">3</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
