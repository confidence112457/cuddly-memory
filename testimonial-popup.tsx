import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  message: string;
  rating: number;
  avatar?: string;
}

const sampleTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    message: "Genius Trading Platform has completely transformed my investment strategy. I've seen a 340% return in just 6 months!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    message: "The automated trading bot is incredible. It works 24/7 and has generated consistent profits for my portfolio.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    message: "Started with just $500 and now I'm making $200+ daily profit. This platform is absolutely amazing!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Thompson",
    location: "London, UK",
    message: "Professional support team and excellent returns. I've already recommended this to all my friends.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Wang",
    location: "Toronto, Canada",
    message: "The investment plans are perfectly designed. I love how transparent and reliable everything is.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  }
];

export default function TestimonialPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    retry: false,
  });

  useEffect(() => {
    if (testimonials.length === 0) return;

    const showTestimonial = () => {
      const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
      setCurrentTestimonial(randomTestimonial);
      setIsVisible(true);

      // Auto-hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Show first testimonial after 5 seconds
    const initialTimeout = setTimeout(showTestimonial, 5000);

    // Then show random testimonials every 30 seconds
    const interval = setInterval(showTestimonial, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [testimonials]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && currentTestimonial && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <Card className="glassmorphism border-green-500/20 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentTestimonial?.avatar ? (
                      <img 
                        src={currentTestimonial.avatar} 
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {currentTestimonial?.name.charAt(0)}
                      </span>
                    )}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-sm">{currentTestimonial?.name}</h4>
                    <p className="text-xs text-muted-foreground">{currentTestimonial?.location}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(currentTestimonial?.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 hover:bg-red-500/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <motion.p 
                className="text-sm text-foreground mb-3 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{currentTestimonial?.message}"
              </motion.p>
              
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-xs text-green-500 font-medium">✓ Verified User</span>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>•</span>
                  <span>Live testimonial</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}