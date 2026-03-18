"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, MapPin, ChevronRight, Clock, Calendar } from "lucide-react";
import { useState, useRef } from "react";

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
  categories: any[];
  currentGroup: any;
}

export function AddItemDrawer({ isOpen, onClose, onAdd, categories, currentGroup }: AddItemDrawerProps) {
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsFullScreen(true);
    } else if (info.offset.y > 50 && isFullScreen) {
      setIsFullScreen(false);
    } else if (info.offset.y > 100 && !isFullScreen) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsFullScreen(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!itemName || !selectedCategory) return;

    const newItem: any = {
      id: Date.now().toString(),
      name: itemName,
      category: selectedCategory,
      location: selectedLocation || "위치 미지정",
      completed: false,
      isScheduled: hasSchedule,
      scheduleDate: hasSchedule ? scheduleDate : null,
      scheduleTime: hasSchedule ? scheduleTime : null,
      groupId: currentGroup?.id,
    };

    onAdd(newItem);

    setItemName("");
    setSelectedCategory(null);
    setSelectedLocation(null);
    setHasSchedule(false);
    setScheduleDate("");
    setScheduleTime("");
    setIsFullScreen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            ref={constraintsRef}
            initial={{ y: "100%" }}
            animate={{ y: 0, height: isFullScreen ? "100vh" : "auto" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-card ${isFullScreen ? "rounded-none" : "rounded-t-3xl"} overflow-hidden`}
            style={{ maxHeight: isFullScreen ? "100vh" : "85vh" }}
          >
            {/* Drag Handle */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing py-3"
            >
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
            </motion.div>

            <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(85vh - 40px)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">새 아이템 추가</h2>
                  {currentGroup && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {currentGroup.name} 리스트에 추가됩니다
                    </p>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* Item Name */}
                <div>
                  <label className="block text-xs font-medium text-card-foreground mb-1.5">
                    품목 이름
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="구매할 품목을 입력하세요"
                    className="w-full px-3 py-2.5 bg-secondary rounded-xl border-0 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-card-foreground mb-1.5">
                    카테고리
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.slice(1).map((category: any) => (
                      <motion.button
                        key={category.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === category.label
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {category.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-card-foreground mb-1.5">
                    위치
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLocation("강남역 다이소")}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-secondary rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-secondary-foreground text-sm">
                        {selectedLocation || "위치 선택하기"}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>

                {/* Schedule Toggle */}
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground text-sm">시간 설정</p>
                        <p className="text-[11px] text-muted-foreground">
                          {hasSchedule ? "일정형 리스트에 추가됩니다" : "일반 장바구니에 추가됩니다"}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setHasSchedule(!hasSchedule)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                        hasSchedule ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <motion.div
                        animate={{ x: hasSchedule ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-5 h-5 bg-white rounded-full shadow"
                      />
                    </motion.button>
                  </div>

                  {/* Schedule Details */}
                  <AnimatePresence>
                    {hasSchedule && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              날짜
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-card rounded-xl border-0 text-sm text-card-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              시간
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-card rounded-xl border-0 text-sm text-card-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!itemName || !selectedCategory}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm"
                >
                  추가하기
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
