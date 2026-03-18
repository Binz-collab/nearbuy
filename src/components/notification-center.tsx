"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MapPin, Clock, Check, Trash2 } from "lucide-react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearNotification,
  onClearAll 
}: NotificationCenterProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-foreground" />
                  <h2 className="font-semibold text-foreground">알림 센터</h2>
                  {notifications.length > 0 && (
                    <span className="text-xs font-medium text-primary-foreground bg-primary px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      모두 삭제
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bell className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">새로운 알림이 없습니다</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification: any, index: number) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card rounded-xl border border-border p-3 relative group"
                      >
                        <button
                          onClick={() => onClearNotification(notification.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>

                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            notification.type === "enter" 
                              ? "bg-primary/10" 
                              : notification.type === "purchased"
                                ? "bg-green-500/10"
                                : "bg-muted"
                          }`}>
                            {notification.type === "purchased" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <MapPin className={`w-4 h-4 ${
                                notification.type === "enter" ? "text-primary" : "text-muted-foreground"
                              }`} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
