"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Users, MessageCircle, CheckCircle, Edit3, ArrowRight } from "lucide-react";
import { useState } from "react";

interface InviteLandingScreenProps {
  groupName: string;
  inviterName: string;
  onAcceptInvite: (nickname?: string) => void;
}

export function InviteLandingScreen({ groupName, inviterName, onAcceptInvite }: InviteLandingScreenProps) {
  const [step, setStep] = useState<"welcome" | "nickname">("welcome");
  const [nickname, setNickname] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const features = [
    "실시간 쇼핑 리스트 공유",
    "위치 기반 스마트 알림",
    "누가 뭘 사는지 한눈에 확인",
  ];

  const handleLogin = (method: "kakao" | "google") => {
    setIsLoggingIn(true);
    // Simulate login, then move to nickname step
    setTimeout(() => {
      setIsLoggingIn(false);
      setStep("nickname");
    }, 500);
  };

  const handleSetNickname = () => {
    onAcceptInvite(nickname.trim() || undefined);
  };

  const handleSkipNickname = () => {
    onAcceptInvite(undefined);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              >
                <ShoppingBag className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              {/* Invite Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {inviterName}님이 초대했어요
                </h1>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{groupName} 그룹에 참여하세요</span>
                </div>
              </motion.div>

              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border mb-8"
              >
                <h3 className="font-semibold text-card-foreground mb-4">NearBuy와 함께하면</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Login Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-full space-y-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLogin("kakao")}
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#FEE500] text-[#000000] font-medium rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isLoggingIn ? "로그인 중..." : "카카오로 가입하고 참여하기"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLogin("google")}
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-card border border-border text-card-foreground font-medium rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLoggingIn ? "로그인 중..." : "구글로 가입하고 참여하기"}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="nickname"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              >
                <Edit3 className="w-8 h-8 text-primary" />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center mb-6"
              >
                <h1 className="text-xl font-bold text-foreground mb-1">
                  닉네임을 설정하세요
                </h1>
                <p className="text-sm text-muted-foreground">
                  {groupName} 그룹에서 사용할 이름이에요
                </p>
              </motion.div>

              {/* Nickname Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-full mb-5"
              >
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 엄마, 민지, 회장"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none text-center"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground text-center mt-1.5">
                  비워두면 기본 닉네임으로 참여합니다
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full space-y-2"
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetNickname}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  그룹 참여하기
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkipNickname}
                  className="w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm"
                >
                  건너뛰기
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-xs text-muted-foreground text-center pb-8"
      >
        가입 시 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
      </motion.p>
    </div>
  );
}
