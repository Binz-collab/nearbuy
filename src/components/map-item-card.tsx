"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin, Navigation, X, ChevronDown, ChevronUp, Clock, ShoppingBag, Calendar, StickyNote, Check, Trash2, Share2 } from "lucide-react";
import { useState } from "react";

interface MapItemCardProps {
  item: any;
  onClose: () => void;
  onNavigate: (mapService?: string) => void;
  preferredMapService?: string;
  onUpdateItem?: (item: any) => void;
}

// Map services for navigation
const mapServices = [
  { id: "naver", name: "네이버 지도", icon: "N", color: "#03C75A", scheme: "nmap://place?lat={lat}&lng={lng}&name={name}" },
  { id: "kakao", name: "카카오맵", icon: "K", color: "#FEE500", textColor: "#000", scheme: "kakaomap://look?p={lat},{lng}" },
  { id: "google", name: "Google Maps", icon: "G", color: "#4285F4", scheme: "comgooglemaps://?q={lat},{lng}" },
  { id: "apple", name: "Apple Maps", icon: "A", color: "#000000", scheme: "maps://?ll={lat},{lng}&q={name}" },
];

export function MapItemCard({ item, onClose, onNavigate, preferredMapService = "naver", onUpdateItem }: MapItemCardProps) {
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [showMemoInput, setShowMemoInput] = useState(false);
  const [memo, setMemo] = useState(item?.memo || "");
  const [scheduleDate, setScheduleDate] = useState(item?.scheduleDate || "");
  const [scheduleTime, setScheduleTime] = useState(item?.scheduleTime || "");
  
  const handleNavigate = (serviceId: string) => {
    onNavigate(serviceId);
    setShowMapOptions(false);
  };

  const handleSaveSchedule = () => {
    if (onUpdateItem && scheduleDate && scheduleTime) {
      onUpdateItem({ ...item, isScheduled: true, scheduleDate, scheduleTime });
    }
    setShowSchedulePicker(false);
  };

  const handleSaveMemo = () => {
    if (onUpdateItem) {
      onUpdateItem({ ...item, memo: memo.trim() || undefined });
    }
    setShowMemoInput(false);
  };

  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = () => {
    const shareText = `${item.name} @ ${item.location}${item.memo ? `\n메모: ${item.memo}` : ""}`;
    const fullText = `${shareText}\n${window.location.href}`;
    
    // Always try clipboard first for immediate feedback
    fallbackCopyToClipboard(fullText);
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setShareStatus("복사됨!");
      setTimeout(() => setShareStatus(null), 2000);
    } catch {
      setShareStatus("복사 실패");
      setTimeout(() => setShareStatus(null), 2000);
    }
    textArea.remove();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsExpanded(true);
    } else if (info.offset.y > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose();
      }
    }
  };

  const preferredService = mapServices.find(s => s.id === preferredMapService) || mapServices[0];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            height: isExpanded ? "70vh" : "auto"
          }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute bottom-4 left-4 right-4 bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          {/* Drag handle indicator */}
          <div className="flex flex-col items-center py-2 bg-secondary/30 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mb-1" />
            <motion.div
              animate={{ y: isExpanded ? 2 : -2 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
              )}
            </motion.div>
          </div>

          <div className="p-4 pt-2 overflow-y-auto" style={{ maxHeight: isExpanded ? "calc(70vh - 50px)" : "none" }}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary transition-colors z-10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="pr-8">
              <h3 className="font-bold text-lg text-card-foreground">{item.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                  {item.category}
                </span>
                {item.isScheduled && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    <Calendar className="w-3 h-3" />
                    {item.scheduleDate} {item.scheduleTime}
                  </span>
                )}
              </div>
              
              {/* Memo Display - visible without expansion */}
              {item.memo && (
                <div className="mt-2 p-2 bg-amber-500/10 rounded-lg">
                  <div className="flex items-start gap-2">
                    <StickyNote className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-card-foreground">{item.memo}</p>
                  </div>
                </div>
              )}
            </div>

          <div className="mt-3 space-y-2">
            {/* Main Navigate Button */}
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigate(preferredMapService)}
                className="flex-1 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <Navigation className="w-4 h-4" />
                {preferredService.name}으로 길찾기
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMapOptions(!showMapOptions)}
                className="px-2.5 py-2.5 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: showMapOptions ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </div>

            {/* Map Options */}
            <AnimatePresence>
              {showMapOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                    {mapServices.filter(s => s.id !== preferredMapService).map((service) => (
                      <motion.button
                        key={service.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigate(service.id)}
                        className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs font-medium"
                      >
                        <div 
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: service.color, color: service.textColor || "#fff" }}
                        >
                          {service.icon}
                        </div>
                        <span className="text-secondary-foreground truncate">{service.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border space-y-4"
                >
                  {/* Item Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">상세 정보</h4>
                    
                    {item.isScheduled && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-card-foreground">
                          {item.scheduleDate} {item.scheduleTime}에 구매 예정
                        </span>
                      </div>
                    )}
                    
                    {item.addedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-medium"
                          style={{ backgroundColor: item.addedBy.color }}
                        >
                          {item.addedBy.name.charAt(0)}
                        </div>
                        <span className="text-muted-foreground">
                          {item.addedBy.name}님이 추가
                        </span>
                      </div>
                    )}
                    
                    {item.sharedWith && item.sharedWith.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {item.sharedWith.length}명과 공유 중
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-xs text-muted-foreground">빠른 작업</h4>
                    
                    {/* Schedule Picker */}
                    {showSchedulePicker ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-secondary/50 rounded-xl space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs font-medium text-card-foreground">일정 설정</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSchedulePicker(false)}
                            className="flex-1 py-1.5 bg-card text-card-foreground rounded-lg text-xs font-medium"
                          >
                            취소
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveSchedule}
                            className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            저장
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : showMemoInput ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-secondary/50 rounded-xl space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-card-foreground">메모 추가</span>
                        </div>
                        <textarea
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                          placeholder="메모를 입력하세요..."
                          rows={2}
                          className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowMemoInput(false)}
                            className="flex-1 py-1.5 bg-card text-card-foreground rounded-lg text-xs font-medium"
                          >
                            취소
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveMemo}
                            className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            저장
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSchedulePicker(true)}
                          className="py-2 px-3 bg-secondary rounded-xl text-xs font-medium text-secondary-foreground flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          일정 변경
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowMemoInput(true)}
                          className="py-2 px-3 bg-secondary rounded-xl text-xs font-medium text-secondary-foreground flex items-center justify-center gap-1.5"
                        >
                          <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                          메모 추가
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShare}
                          className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 ${
                            shareStatus ? "bg-green-500/20 text-green-600" : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {shareStatus ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              {shareStatus}
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-blue-500" />
                              공유하기
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="py-2 px-3 bg-destructive/10 rounded-xl text-xs font-medium text-destructive flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          삭제
                        </motion.button>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
