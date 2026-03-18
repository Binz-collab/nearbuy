"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface MapMarkerProps {
  item: any;
  isSelected: boolean;
  isNearby?: boolean;
  onClick: () => void;
  style?: any;
}

export function MapMarker({ item, isSelected, isNearby, onClick, style }: MapMarkerProps) {
  return (
    <motion.button
      initial={{ scale: 0, y: -20 }}
      animate={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={style}
      className="absolute"
    >
      {/* Pulsing effect for nearby stores */}
      {isNearby && (
        <>
          <motion.div
            animate={{
              scale: [1, 2, 2.5],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 bg-primary rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 2],
              opacity: [0.4, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="absolute inset-0 bg-primary rounded-full"
          />
        </>
      )}

      <motion.div
        animate={{
          scale: isSelected ? 1.2 : isNearby ? [1, 1.1, 1] : 1,
        }}
        transition={isNearby ? { duration: 1, repeat: Infinity } : undefined}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
          isSelected 
            ? "bg-primary" 
            : isNearby 
              ? "bg-primary ring-4 ring-primary/30" 
              : "bg-card"
        }`}
      >
        <ShoppingBag
          className={`w-5 h-5 ${
            isSelected || isNearby ? "text-primary-foreground" : "text-primary"
          }`}
        />
        <div
          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
            isSelected || isNearby ? "border-t-primary" : "border-t-card"
          }`}
        />
      </motion.div>

      {/* Distance badge for nearby */}
      {isNearby && !isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full whitespace-nowrap"
        >
          50m
        </motion.div>
      )}

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap"
        >
          {item.name}
        </motion.div>
      )}
    </motion.button>
  );
}
