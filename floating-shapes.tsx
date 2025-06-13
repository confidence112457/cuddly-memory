import { motion } from "framer-motion";

export default function FloatingShapes() {
  const shapes = [
    { id: 1, size: 80, color: "bg-green-500", position: { top: "20%", left: "10%" }, delay: 0 },
    { id: 2, size: 64, color: "bg-teal-500", position: { top: "40%", right: "20%" }, delay: 2 },
    { id: 3, size: 96, color: "bg-blue-500", position: { bottom: "40%", left: "20%" }, delay: 4 },
    { id: 4, size: 48, color: "bg-green-500", position: { top: "60%", left: "50%" }, delay: 1 },
    { id: 5, size: 72, color: "bg-teal-500", position: { bottom: "60%", right: "40%" }, delay: 3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`floating-shape ${shape.color} rounded-full`}
          style={{
            width: shape.size,
            height: shape.size,
            ...shape.position,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
