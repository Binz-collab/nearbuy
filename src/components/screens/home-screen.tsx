"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, List, Clock, ChevronDown, X, HelpCircle, ShoppingBag, MapPin, Users, StickyNote, Navigation, Sparkles } from "lucide-react";
import { CategoryChips } from "@/components/category-chips";
import { ShoppingItemCard } from "@/components/shopping-item-card";
import { ScheduleTimeline } from "@/components/schedule-timeline";
import { useState } from "react";

interface HomeScreenProps {
  items: any[];
  schedules: any[];
  onCompleteItem: (item: any) => void;
  onNavigate: (item: any) => void;
  onUpdateItem?: (item: any) => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

const categories = [
  { id: "all", label: "전체" },
  { id: "daiso", label: "다이소" },
  { id: "mart", label: "마트" },
  { id: "convenience", label: "편의점" },
  { id: "pharmacy", label: "약국" },
  { id: "bakery", label: "베이커리" },
];

export function HomeScreen({ 
  items, 
  schedules,
  onCompleteItem, 
  onNavigate,
  onUpdateItem,
  onOpenNotifications,
  notificationCount
}: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<any>("all");
  const [showReminder, setShowReminder] = useState(true);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [listView, setListView] = useState<"all" | "scheduled" | "general">("all");
  const [showGuide, setShowGuide] = useState(false);

  // Get personal items only (no groupId or personal groupId)
  const personalItems = items.filter((i: any) => !i.groupId || i.groupId === "personal");

  // Filter by category
  const categoryFilteredItems =
    selectedCategory === "all"
      ? personalItems
      : personalItems.filter((item: any) => {
          const categoryMap: any = {
            daiso: "다이소",
            mart: "마트",
            convenience: "편의점",
            pharmacy: "약국",
            bakery: "베이커리",
          };
          return item.category === categoryMap[selectedCategory];
        });

  // Filter by list view (scheduled vs general)
  const filteredItems = listView === "all" 
    ? categoryFilteredItems
    : listView === "scheduled"
      ? categoryFilteredItems.filter((i: any) => i.isScheduled)
      : categoryFilteredItems.filter((i: any) => !i.isScheduled);

  const handleRecommendationClick = (item: any) => {
    onNavigate(item);
  };

  const scheduledCount = categoryFilteredItems.filter((i: any) => i.isScheduled && !i.completed).length;
  const generalCount = categoryFilteredItems.filter((i: any) => !i.isScheduled && !i.completed).length;
  const todayScheduleCount = schedules.filter((s: any) => !s.isPast).length;

  const handleDismissReminder = () => {
    setShowReminder(false);
    // Show the collapsible button after dismissing reminder
  };

  const handleReminderClick = () => {
    setShowReminder(false);
    setIsScheduleExpanded(true);
  };

  const handleToggleSchedule = () => {
    setIsScheduleExpanded(!isScheduleExpanded);
  };

  // Guide content
  const guideSteps = [
    {
      icon: ShoppingBag,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      title: "아이템 추가하기",
      description: "하단의 + 버튼을 눌러 구매할 품목을 추가하세요. 카테고리, 위치, 일정을 설정할 수 있습니다."
    },
    {
      icon: MapPin,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
      title: "위치 기반 알림",
      description: "설정한 장소 근처에 가면 자동으로 알림을 받습니다. 지나치기 쉬운 장보기를 놓치지 마세요!"
    },
    {
      icon: Navigation,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      title: "길찾기",
      description: "아이템의 화살표 버튼을 누르면 네이버, 카카오, 구글 지도로 바로 길찾기가 가능합니다."
    },
    {
      icon: Users,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
      title: "그룹 공유",
      description: "가족, 룸메이트와 장보기 리스트를 공유하세요. 누가 무엇을 구매 중인지 실시간으로 확인됩니다."
    },
    {
      icon: StickyNote,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      title: "메모 기능",
      description: "아이템에 메모를 추가하세요. '무염버터로', '대용량으로' 같은 세부 정보를 기록할 수 있습니다."
    },
    {
      icon: Calendar,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      title: "일정 연동",
      description: "구글, 삼성 캘린더와 연동하여 외출 일정에 맞춰 장보기를 추천받으세요."
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Usage Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-card-foreground">사용 가이드</h2>
                    <p className="text-[10px] text-muted-foreground">NearBuy 시작하기</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {guideSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 p-3 bg-secondary/50 rounded-xl"
                    >
                      <div className={`w-9 h-9 ${step.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4.5 h-4.5 ${step.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-card-foreground mb-0.5">{step.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Example Card */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-card-foreground mb-2">아이템 예시</p>
                  <div className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm text-card-foreground line-through opacity-50">세탁세제</span>
                          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            일정
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">강남역 다이소</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-full">다이소</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                        <StickyNote className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-card-foreground">무향 제품으로 구매하기</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowGuide(false)}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-sm"
                >
                  시작하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">NearBuy</h1>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowGuide(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <HelpCircle className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Bell className="w-4.5 h-4.5 text-foreground" />
              {notificationCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5"
                >
                  {notificationCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </motion.header>

      <main className="px-4 pt-4">
        {/* Reminder Card - Dismissable, shown once */}
        <AnimatePresence>
          {schedules.length > 0 && showReminder && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="mb-3"
            >
              <div className="relative bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  onClick={handleReminderClick}
                  className="w-full flex items-center justify-between py-3 px-4 group hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        오늘 {todayScheduleCount}개의 일정이 있어요
                      </p>
                      <p className="text-xs text-primary/70 truncate">
                        탭해서 일정을 확인하세요
                      </p>
                    </div>
                  </div>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismissReminder();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="w-4 h-4 text-primary/50" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Toggle Button - Shown after reminder is dismissed */}
        <AnimatePresence>
          {schedules.length > 0 && !showReminder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3"
            >
              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={handleToggleSchedule}
                className="w-full flex items-center justify-between py-2.5 px-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    캘린더 ({todayScheduleCount})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isScheduleExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Schedule Timeline */}
        <AnimatePresence>
          {isScheduleExpanded && !showReminder && schedules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <ScheduleTimeline 
                schedules={schedules}
                recommendations={[]}
                onRecommendationClick={handleRecommendationClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* List View Tabs */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-secondary rounded-xl">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setListView("all")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              listView === "all" 
                ? "bg-card text-card-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" />
            전체
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setListView("scheduled")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              listView === "scheduled" 
                ? "bg-card text-card-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            예정 ({scheduledCount})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setListView("general")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              listView === "general" 
                ? "bg-card text-card-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" />
            일반 ({generalCount})
          </motion.button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredItems.filter((i: any) => !i.completed).length}개의 아이템
          </p>
        </div>

        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any) => (
              <ShoppingItemCard
                key={item.id}
                item={item}
                onNavigate={onNavigate}
                onComplete={onCompleteItem}
                onUpdateItem={onUpdateItem}
              />
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            >
              <p className="text-lg font-medium mb-1">아이템이 없습니다</p>
              <p className="text-sm">+ 버튼을 눌러 새 아이템을 추가해보세요</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
