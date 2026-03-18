"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation } from "lucide-react";

interface PushNotificationProps {
  notification: any;
  onClose: () => void;
  onNavigate: () => void;
}

export function PushNotification({ notification, onClose, onNavigate }: PushNotificationProps) {
  if (!notification) return null;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-xl border border-border p-4 backdrop-blur-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                    {notification.status === "enter" && "매장 근처"}
                    {notification.status === "dwell" && "매장 앞"}
                    {notification.status === "exit" && "지나침"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notification.distance}
                  </span>
                </div>
                <h4 className="font-semibold text-card-foreground text-sm">
                  {notification.itemName}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {notification.storeName}에서 구매 가능
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-sm font-medium text-muted-foreground bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                나중에
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNavigate}
                className="flex-1 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                길찾기
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
