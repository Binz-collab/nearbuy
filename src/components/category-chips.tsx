"use client";

import { motion } from "framer-motion";

interface CategoryChipsProps {
  categories: any[];
  selectedCategory: any;
  onSelectCategory: (category: any) => void;
}

export function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-1.5 px-4 py-2">
        {categories.map((category: any) => {
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
