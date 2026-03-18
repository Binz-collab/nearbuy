"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ShoppingBag, ChevronRight, Route } from "lucide-react";

interface ScheduleTimelineProps {
  schedules: any[];
  recommendations: any[];
  onRecommendationClick: (item: any) => void;
}

// Calendar source badges
const calendarBadges: Record<string, { label: string; color: string; textColor?: string }> = {
  google: { label: "Google", color: "#4285F4" },
  samsung: { label: "Samsung", color: "#1428A0" },
  apple: { label: "Apple", color: "#000000" },
  outlook: { label: "Outlook", color: "#0078D4" },
  local: { label: "로컬", color: "#6B7280" },
  routine: { label: "루틴", color: "#10B981" },
};

export function ScheduleTimeline({ schedules, recommendations, onRecommendationClick }: ScheduleTimelineProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">연동된 일정</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {schedules.map((schedule: any, index: number) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              {/* Timeline dot */}
              <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 ${
                schedule.isPast 
                  ? "bg-muted border-muted-foreground/30" 
                  : schedule.isCurrent 
                    ? "bg-primary border-primary animate-pulse" 
                    : "bg-card border-border"
              }`} />

              <div className={`${schedule.isPast ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  {schedule.isRoutine ? (
                    <Route className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span>{schedule.time}</span>
                  {schedule.calendarSource && calendarBadges[schedule.calendarSource] && (
                    <span 
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                      style={{ backgroundColor: calendarBadges[schedule.calendarSource].color }}
                    >
                      {calendarBadges[schedule.calendarSource].label}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-card-foreground">{schedule.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  {schedule.isRoutine ? (
                    <Route className="w-3 h-3" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                  <span>{schedule.location}</span>
                </div>
              </div>

              {/* Recommendation tooltip */}
              {schedule.recommendation && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  onClick={() => onRecommendationClick(schedule.recommendation)}
                  className="mt-2 flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl text-xs group hover:bg-primary/10 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-medium">
                    지나가는 길에 들르세요
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
