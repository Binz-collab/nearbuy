"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, MoreVertical, Check, Clock, Calendar, StickyNote, X, Pencil } from "lucide-react";
import { useState } from "react";

interface ShoppingItemCardProps {
  item: any;
  onNavigate: (item: any) => void;
  onComplete: (item: any) => void;
  onUpdateItem?: (item: any) => void;
}

export function ShoppingItemCard({ item, onNavigate, onComplete, onUpdateItem }: ShoppingItemCardProps) {
  const isBeingPurchased = item.purchasingBy && !item.completed;
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(item.memo || "");
  const [showMenu, setShowMenu] = useState(false);

  const handleSaveMemo = () => {
    if (onUpdateItem) {
      onUpdateItem({ ...item, memo: memoText.trim() || undefined });
    }
    setIsEditingMemo(false);
  };

  const handleDeleteMemo = () => {
    if (onUpdateItem) {
      onUpdateItem({ ...item, memo: undefined });
    }
    setMemoText("");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-card rounded-xl p-3 shadow-sm border transition-colors ${
        isBeingPurchased 
          ? "border-primary/50 bg-primary/5" 
          : "border-border"
      }`}
    >
      {/* Purchasing indicator */}
      {isBeingPurchased && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
          <span className="text-[11px] font-medium text-primary">
            {item.purchasingBy.name}님이 구매 중
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-2.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(item)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${
            item.completed
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 hover:border-primary"
          }`}
        >
          {item.completed && <Check className="w-3 h-3 text-primary-foreground" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3
              className={`font-medium text-sm text-card-foreground ${
                item.completed ? "line-through opacity-50" : ""
              }`}
            >
              {item.name}
            </h3>
            
            {/* Scheduled Badge */}
            {item.isScheduled && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">
                <Calendar className="w-2.5 h-2.5" />
                일정
              </span>
            )}
            
            {/* Shared members avatars */}
            {item.sharedWith && item.sharedWith.length > 0 && (
              <div className="flex items-center -space-x-1">
                {item.sharedWith.slice(0, 3).map((member: any, index: number) => (
                  <div
                    key={member.id}
                    className="w-4 h-4 rounded-full border border-card flex items-center justify-center text-[7px] font-bold"
                    style={{ backgroundColor: member.color }}
                    title={member.name}
                  >
                    <span className="text-white">{member.name[0]}</span>
                  </div>
                ))}
                {item.sharedWith.length > 3 && (
                  <div className="w-4 h-4 rounded-full bg-muted border border-card flex items-center justify-center">
                    <span className="text-[7px] font-medium text-muted-foreground">
                      +{item.sharedWith.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs truncate">{item.location}</span>
          </div>
          
          {/* Schedule Time */}
          {item.isScheduled && item.scheduleTime && (
            <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {item.scheduleDate} {item.scheduleTime}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-block px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-full">
              {item.category}
            </span>
            {item.addedBy && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold"
                  style={{ backgroundColor: item.addedBy.color || "#888" }}
                  title={`${item.addedBy.name}님이 추가`}
                >
                  <span className="text-white">{item.addedBy.name[0]}</span>
                </div>
                {item.addedBy.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate(item)}
            className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
          </motion.button>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          
          {/* Context Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-8 right-0 z-10 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]"
              >
                <button
                  onClick={() => {
                    setIsEditingMemo(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary transition-colors"
                >
                  <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-card-foreground">{item.memo ? "메모 수정" : "메모 추가"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Memo Display */}
      {item.memo && !isEditingMemo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 pt-2 border-t border-border"
        >
          <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
            <StickyNote className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-card-foreground flex-1">{item.memo}</p>
            <button
              onClick={() => setIsEditingMemo(true)}
              className="p-1 hover:bg-amber-500/20 rounded transition-colors"
            >
              <Pencil className="w-3 h-3 text-amber-600" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Memo Edit */}
      <AnimatePresence>
        {isEditingMemo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-border"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-card-foreground">메모</span>
              </div>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="메모를 입력하세요..."
                rows={2}
                className="w-full px-2.5 py-2 bg-secondary rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                autoFocus
              />
              <div className="flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMemoText(item.memo || "");
                    setIsEditingMemo(false);
                  }}
                  className="flex-1 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium"
                >
                  취소
                </motion.button>
                {item.memo && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteMemo}
                    className="py-1.5 px-3 bg-destructive/10 text-destructive rounded-lg text-xs font-medium"
                  >
                    삭제
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveMemo}
                  className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                >
                  저장
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
