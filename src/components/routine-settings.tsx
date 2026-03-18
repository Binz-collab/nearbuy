"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Plus, Trash2, Route, Home, Building2 } from "lucide-react";
import { useState } from "react";

interface RoutineSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  routines: any[];
  onSaveRoutines: (routines: any[]) => void;
}

export function RoutineSettings({ isOpen, onClose, routines, onSaveRoutines }: RoutineSettingsProps) {
  const [localRoutines, setLocalRoutines] = useState<any[]>(routines);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRoutine, setNewRoutine] = useState<any>({
    name: "",
    startLocation: "",
    endLocation: "",
    startTime: "09:00",
    days: [],
  });

  const weekDays = [
    { id: "mon", label: "월" },
    { id: "tue", label: "화" },
    { id: "wed", label: "수" },
    { id: "thu", label: "목" },
    { id: "fri", label: "금" },
    { id: "sat", label: "토" },
    { id: "sun", label: "일" },
  ];

  const handleAddRoutine = () => {
    if (!newRoutine.name || !newRoutine.startLocation || !newRoutine.endLocation) return;
    
    const routine = {
      ...newRoutine,
      id: Date.now().toString(),
    };
    
    setLocalRoutines([...localRoutines, routine]);
    setNewRoutine({
      name: "",
      startLocation: "",
      endLocation: "",
      startTime: "09:00",
      days: [],
    });
    setIsAddingNew(false);
  };

  const handleDeleteRoutine = (id: string) => {
    setLocalRoutines(localRoutines.filter((r: any) => r.id !== id));
  };

  const handleSave = () => {
    onSaveRoutines(localRoutines);
    onClose();
  };

  const toggleDay = (dayId: string) => {
    setNewRoutine((prev: any) => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter((d: string) => d !== dayId)
        : [...prev.days, dayId],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">고정 루틴 설정</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    자주 가는 동선을 등록하고 경로 추천을 받으세요
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Existing Routines */}
              <div className="space-y-3 mb-6">
                {localRoutines.map((routine: any) => (
                  <motion.div
                    key={routine.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-secondary rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Route className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-secondary-foreground">
                            {routine.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            <span>{routine.startLocation}</span>
                          </div>
                          <span>→</span>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{routine.endLocation}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{routine.startTime}</span>
                          <div className="flex gap-1 ml-2">
                            {routine.days.map((day: string) => (
                              <span
                                key={day}
                                className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                              >
                                {weekDays.find((d) => d.id === day)?.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRoutine(routine.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {localRoutines.length === 0 && !isAddingNew && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Route className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>등록된 루틴이 없습니다</p>
                    <p className="text-sm">출퇴근 등 자주 가는 경로를 추가해보세요</p>
                  </div>
                )}
              </div>

              {/* Add New Routine Form */}
              <AnimatePresence>
                {isAddingNew && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-primary/5 rounded-xl p-4 mb-4 space-y-4"
                  >
                    <input
                      type="text"
                      value={newRoutine.name}
                      onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                      placeholder="루틴 이름 (예: 출근길)"
                      className="w-full px-4 py-3 bg-card rounded-xl border-0 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">출발지</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={newRoutine.startLocation}
                            onChange={(e) => setNewRoutine({ ...newRoutine, startLocation: e.target.value })}
                            placeholder="집"
                            className="w-full pl-9 pr-3 py-2.5 bg-card rounded-xl border-0 text-sm text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">도착지</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={newRoutine.endLocation}
                            onChange={(e) => setNewRoutine({ ...newRoutine, endLocation: e.target.value })}
                            placeholder="회사"
                            className="w-full pl-9 pr-3 py-2.5 bg-card rounded-xl border-0 text-sm text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">출발 시간</label>
                      <input
                        type="time"
                        value={newRoutine.startTime}
                        onChange={(e) => setNewRoutine({ ...newRoutine, startTime: e.target.value })}
                        className="px-4 py-2.5 bg-card rounded-xl border-0 text-card-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">반복 요일</label>
                      <div className="flex gap-2">
                        {weekDays.map((day) => (
                          <motion.button
                            key={day.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleDay(day.id)}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                              newRoutine.days.includes(day.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-card-foreground hover:bg-secondary"
                            }`}
                          >
                            {day.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddingNew(false)}
                        className="flex-1 py-3 bg-card text-card-foreground font-medium rounded-xl"
                      >
                        취소
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddRoutine}
                        disabled={!newRoutine.name || !newRoutine.startLocation || !newRoutine.endLocation}
                        className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-xl disabled:opacity-50"
                      >
                        추가
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isAddingNew && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingNew(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                    새 루틴 추가
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl"
                >
                  저장하기
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
