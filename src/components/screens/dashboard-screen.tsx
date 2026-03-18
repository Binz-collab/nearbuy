"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  ArrowLeft, Calendar, ShoppingBag, CheckCircle, MapPin, TrendingUp, TrendingDown,
  PieChart, BarChart3, Clock, Tag, Store, ChevronDown, ChevronRight, X,
  Wallet, CreditCard, Receipt
} from "lucide-react";
import { useState, useRef } from "react";

interface DashboardScreenProps {
  onBack: () => void;
  stats: any;
  items: any[];
  connectedCalendars?: string[];
}

// Mock spending data
const monthlySpending = [
  { month: "1월", amount: 245000 },
  { month: "2월", amount: 312000 },
  { month: "3월", amount: 189000 },
  { month: "4월", amount: 276000 },
  { month: "5월", amount: 198000 },
  { month: "6월", amount: 324000 },
];

const categorySpending = [
  { name: "식료품", amount: 156000, color: "#FF6B6B", percentage: 42 },
  { name: "생활용품", amount: 89000, color: "#4ECDC4", percentage: 24 },
  { name: "의류", amount: 67000, color: "#9B59B6", percentage: 18 },
  { name: "기타", amount: 60000, color: "#F39C12", percentage: 16 },
];

const recentPurchases = [
  { id: 1, name: "홈플러스 - 식료품", date: "오늘", amount: 45000, items: 8 },
  { id: 2, name: "다이소 - 생활용품", date: "어제", amount: 12000, items: 5 },
  { id: 3, name: "이마트 - 식료품", date: "3일 전", amount: 78000, items: 12 },
  { id: 4, name: "쿠팡 - 온라인", date: "5일 전", amount: 34000, items: 3 },
];

const frequentStores = [
  { name: "홈플러스 강남점", visits: 12, lastVisit: "오늘" },
  { name: "이마트 역삼점", visits: 8, lastVisit: "3일 전" },
  { name: "GS25 테헤란로점", visits: 24, lastVisit: "어제" },
  { name: "올리브영 강남역점", visits: 5, lastVisit: "1주일 전" },
];

export function DashboardScreen({ onBack, stats, items, connectedCalendars = [] }: DashboardScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState<"category" | "store" | "purchase">("category");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const constraintsRef = useRef(null);

  const totalThisMonth = categorySpending.reduce((sum, cat) => sum + cat.amount, 0);
  const lastMonthTotal = 312000;
  const spendingChange = ((totalThisMonth - lastMonthTotal) / lastMonthTotal) * 100;

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsFullScreen(true);
    } else if (info.offset.y > 50 && isFullScreen) {
      setIsFullScreen(false);
    } else if (info.offset.y > 100 && !isFullScreen) {
      setShowDetailModal(false);
      setIsFullScreen(false);
    }
  };

  const openDetail = (type: "category" | "store" | "purchase") => {
    setDetailType(type);
    setShowDetailModal(true);
  };

  const maxSpending = Math.max(...monthlySpending.map(m => m.amount));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDetailModal(false);
                setIsFullScreen(false);
              }}
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
                  <h2 className="text-xl font-bold text-card-foreground">
                    {detailType === "category" && "카테고리별 지출"}
                    {detailType === "store" && "자주 가는 매장"}
                    {detailType === "purchase" && "최근 구매 내역"}
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowDetailModal(false);
                      setIsFullScreen(false);
                    }}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                {detailType === "category" && (
                  <div className="space-y-4">
                    {categorySpending.map((cat, index) => (
                      <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-secondary/50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-medium text-card-foreground">{cat.name}</span>
                          </div>
                          <span className="font-bold text-card-foreground">
                            {cat.amount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percentage}%` }}
                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{cat.percentage}%</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {detailType === "store" && (
                  <div className="space-y-3">
                    {frequentStores.map((store, index) => (
                      <motion.div
                        key={store.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Store className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground truncate">{store.name}</p>
                          <p className="text-xs text-muted-foreground">마지막 방문: {store.lastVisit}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary">{store.visits}회</p>
                          <p className="text-xs text-muted-foreground">방문</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {detailType === "purchase" && (
                  <div className="space-y-3">
                    {recentPurchases.map((purchase, index) => (
                      <motion.div
                        key={purchase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Receipt className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground truncate">{purchase.name}</p>
                          <p className="text-xs text-muted-foreground">{purchase.date} - {purchase.items}개 아이템</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-card-foreground">{purchase.amount.toLocaleString()}원</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 pt-6 pb-4 flex items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">소비 리포트</h1>
      </motion.header>

      <div className="px-4 space-y-4">
        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 p-1 bg-secondary rounded-xl"
        >
          {[
            { value: "week", label: "주간" },
            { value: "month", label: "월간" },
            { value: "year", label: "연간" },
          ].map((period) => (
            <motion.button
              key={period.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period.value as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {period.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">이번 달 총 지출</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">
                {totalThisMonth.toLocaleString()}원
              </p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
              spendingChange > 0 
                ? "bg-destructive/10 text-destructive" 
                : "bg-green-500/10 text-green-500"
            }`}>
              {spendingChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(spendingChange).toFixed(1)}%
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            지난 달 대비 {spendingChange > 0 ? "증가" : "감소"}했어요
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xl font-bold text-card-foreground">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">총 아이템</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="w-10 h-10 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xl font-bold text-card-foreground">{stats.completed}</p>
            <p className="text-[10px] text-muted-foreground">완료</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="w-10 h-10 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-card-foreground">{stats.locations}</p>
            <p className="text-[10px] text-muted-foreground">방문 장소</p>
          </div>
        </motion.div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              월별 지출 추이
            </h3>
          </div>

          <div className="flex items-end justify-between gap-2 h-32">
            {monthlySpending.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.amount / maxSpending) * 100}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${
                    index === monthlySpending.length - 1 ? "bg-primary" : "bg-primary/30"
                  }`}
                  style={{ minHeight: "8px" }}
                />
                <span className="text-[10px] text-muted-foreground">{month.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => openDetail("category")}
          className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              카테고리별 지출
            </h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex gap-4 items-center">
            {/* Simple pie representation */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                {categorySpending.reduce((acc, cat, index) => {
                  const prevPercentage = categorySpending
                    .slice(0, index)
                    .reduce((sum, c) => sum + c.percentage, 0);
                  const strokeDasharray = `${cat.percentage * 2.51} ${251 - cat.percentage * 2.51}`;
                  const strokeDashoffset = -prevPercentage * 2.51;
                  
                  return [
                    ...acc,
                    <circle
                      key={cat.name}
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke={cat.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  ];
                }, [] as JSX.Element[])}
              </svg>
            </div>

            <div className="flex-1 space-y-1.5">
              {categorySpending.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-card-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {cat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.button>

        {/* Frequent Stores */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => openDetail("store")}
          className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              자주 가는 매장
            </h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            {frequentStores.slice(0, 3).map((store, index) => (
              <div key={store.name} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-card-foreground truncate">{store.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{store.visits}회</span>
              </div>
            ))}
          </div>
        </motion.button>

        {/* Recent Purchases */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => openDetail("purchase")}
          className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              최근 구매 내역
            </h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {recentPurchases.slice(0, 3).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-card-foreground truncate">{purchase.name}</p>
                  <p className="text-xs text-muted-foreground">{purchase.date}</p>
                </div>
                <span className="text-sm font-medium text-card-foreground flex-shrink-0 ml-3">
                  {purchase.amount.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </motion.button>

        {/* Calendar Connected Info */}
        {connectedCalendars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary">캘린더 연동됨</p>
                <p className="text-xs text-primary/70 mt-1">
                  일정에 따라 쇼핑 추천을 받아보세요. 이동 경로에 있는 매장을 자동으로 추천해드립니다.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
