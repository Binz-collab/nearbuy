"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, User, Home, Sparkles, Plus } from "lucide-react";
import { useState } from "react";

interface GroupSwitcherProps {
  groups: any[];
  selectedGroup: any;
  onSelectGroup: (group: any) => void;
  onCreateGroup: () => void;
}

const groupIcons: any = {
  personal: User,
  home: Home,
  club: Sparkles,
  default: Users,
};

export function GroupSwitcher({ groups, selectedGroup, onSelectGroup, onCreateGroup }: GroupSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const SelectedIcon = groupIcons[selectedGroup?.type] || groupIcons.default;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
      >
        <SelectedIcon className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground text-sm">{selectedGroup?.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
            >
              <div className="p-2">
                {groups.map((group: any) => {
                  const Icon = groupIcons[group.type] || groupIcons.default;
                  const isSelected = selectedGroup?.id === group.id;
                  return (
                    <motion.button
                      key={group.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectGroup(group);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isSelected ? "bg-primary/10 text-primary" : "hover:bg-secondary text-card-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.memberCount}명 참여 중
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="selectedIndicator"
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="border-t border-border p-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onCreateGroup();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium text-sm">새 그룹 만들기</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
