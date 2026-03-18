"use client";

import { motion } from "framer-motion";
import { Home, Map, User, Users, Plus } from "lucide-react";

interface BottomTabBarProps {
  activeTab: any;
  onTabChange: (tab: any) => void;
  onAddClick: () => void;
}

export function BottomTabBar({ activeTab, onTabChange, onAddClick }: BottomTabBarProps) {
  const tabs = [
    { id: "home", icon: Home, label: "홈" },
    { id: "map", icon: Map, label: "지도" },
    { id: "add", icon: Plus, label: "추가", isCenter: true },
    { id: "group", icon: Users, label: "그룹" },
    { id: "profile", icon: User, label: "마이" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Center FAB button
          if (tab.isCenter) {
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={onAddClick}
                className="relative -mt-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </motion.button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-0.5"
              >
                <Icon
                  className={`w-[18px] h-[18px] transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[9px] font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
