"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  UserPlus, Users, Calendar, ShoppingCart, ChevronRight, Clock, MapPin, 
  Plus, Bell, Settings, Link, MessageCircle, X, Check, Copy, Crown, Trash2,
  CalendarPlus, Repeat, Edit3, ChevronDown, Activity, LogOut, AlertTriangle
} from "lucide-react";
import { ShoppingItemCard } from "@/components/shopping-item-card";
import { useState, useRef, useEffect } from "react";

interface GroupScreenProps {
  groups: any[];
  selectedGroup: any;
  items: any[];
  onSelectGroup: (group: any) => void;
  onOpenGroupManagement: () => void;
  onOpenGroupCreate?: () => void;
  onOpenInvite: (group: any) => void;
  onCompleteItem: (item: any) => void;
  onNavigate: (item: any) => void;
  onUpdateItem?: (item: any) => void;
}

// Dummy group schedules with more details
const groupSchedules: any[] = [
  {
    id: "gs1",
    groupId: "home",
    title: "주간 장보기",
    description: "이번 주 필요한 물품들 구매",
    date: "매주 토요일",
    time: "14:00",
    location: "이마트 역삼점",
    participants: [
      { id: "m1", name: "민지", color: "#FF6B6B" },
      { id: "m2", name: "철수", color: "#4ECDC4" },
    ],
    isRecurring: true,
    linkedItems: ["세탁세제", "우유", "계란"],
    createdBy: { id: "m1", name: "민지", color: "#FF6B6B" },
  },
  {
    id: "gs2",
    groupId: "home",
    title: "집들이 파티 준비",
    description: "파티 음식 및 장식 구매",
    date: "2026-03-20",
    time: "19:00",
    location: "집",
    participants: [
      { id: "m1", name: "민지", color: "#FF6B6B" },
      { id: "m2", name: "철수", color: "#4ECDC4" },
      { id: "m3", name: "영희", color: "#9B59B6" },
    ],
    isRecurring: false,
    linkedItems: ["케이크", "풍선", "음료"],
    createdBy: { id: "m2", name: "철수", color: "#4ECDC4" },
  },
  {
    id: "gs3",
    groupId: "club",
    title: "동아리 정기 모임",
    description: "월례 회의 및 간식 구매",
    date: "매월 첫째 토요일",
    time: "15:00",
    location: "스터디 카페",
    participants: [
      { id: "c1", name: "회장", color: "#FF6B6B" },
      { id: "c2", name: "부회장", color: "#4ECDC4" },
    ],
    isRecurring: true,
    linkedItems: ["커피", "다과"],
    createdBy: { id: "c1", name: "회장", color: "#FF6B6B" },
  },
];

// Dummy members per group
const groupMembers: any = {
  home: [
    { id: "m1", name: "민지", color: "#FF6B6B", isOwner: true, role: "그룹장" },
    { id: "m2", name: "철수", color: "#4ECDC4", role: "멤버" },
    { id: "m3", name: "영희", color: "#9B59B6", role: "멤버" },
  ],
  club: [
    { id: "c1", name: "회장", color: "#FF6B6B", isOwner: true, role: "회장" },
    { id: "c2", name: "부회장", color: "#4ECDC4", role: "부회장" },
    { id: "c3", name: "총무", color: "#9B59B6", role: "총무" },
    { id: "c4", name: "회원1", color: "#F39C12", role: "회원" },
    { id: "c5", name: "회원2", color: "#3498DB", role: "회원" },
  ],
};

// Activity log for groups
const activityLogs: any = {
  home: [
    { id: "a1", user: "민지", userColor: "#FF6B6B", action: "add", item: "세탁세제", time: "방금 전" },
    { id: "a2", user: "철수", userColor: "#4ECDC4", action: "complete", item: "우유", time: "5분 전" },
    { id: "a3", user: "영희", userColor: "#9B59B6", action: "add", item: "휴지", time: "10분 전" },
    { id: "a4", user: "민지", userColor: "#FF6B6B", action: "add", item: "계란 30구", time: "30분 전" },
    { id: "a5", user: "철수", userColor: "#4ECDC4", action: "add", item: "라면", time: "1시간 전" },
  ],
  club: [
    { id: "b1", user: "회장", userColor: "#FF6B6B", action: "add", item: "간식 (과자류)", time: "방금 전" },
    { id: "b2", user: "부회장", userColor: "#4ECDC4", action: "add", item: "음료수", time: "15분 전" },
    { id: "b3", user: "총무", userColor: "#9B59B6", action: "complete", item: "문구류", time: "1시간 전" },
  ],
};

export function GroupScreen({
  groups,
  selectedGroup,
  items,
  onSelectGroup,
  onOpenGroupManagement,
  onOpenGroupCreate,
  onOpenInvite,
  onCompleteItem,
  onNavigate,
  onUpdateItem,
}: GroupScreenProps) {
  const [activeSection, setActiveSection] = useState<"schedule" | "cart">("cart");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const constraintsRef = useRef(null);

  const handleDragEnd = (modalSetter: (value: boolean) => void) => (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsFullScreen(true);
    } else if (info.offset.y > 50 && isFullScreen) {
      setIsFullScreen(false);
    } else if (info.offset.y > 100 && !isFullScreen) {
      modalSetter(false);
      setIsFullScreen(false);
    }
  };

  const closeModal = (setter: (value: boolean) => void) => {
    setter(false);
    setIsFullScreen(false);
  };

  // Filter groups (exclude personal)
  const sharedGroups = groups.filter((g: any) => g.id !== "personal");
  const currentGroup = sharedGroups.find((g: any) => g.id === selectedGroup?.id) || sharedGroups[0];
  
  // Get items for current group - ensure currentGroup exists
  const groupItems = currentGroup ? items.filter((i: any) => i.groupId === currentGroup.id) : [];
  
  // Get schedules for current group - ensure we always get the schedules
  const currentSchedules = currentGroup ? groupSchedules.filter((s: any) => s.groupId === currentGroup.id) : [];
  
  // Get members for current group
  const currentMembers = currentGroup ? (groupMembers[currentGroup.id] || []) : [];
  
  // Get activity logs for current group
  const currentActivityLogs = currentGroup ? (activityLogs[currentGroup.id] || []) : [];

  const inviteLink = `https://nearbuy.app/invite/${currentGroup?.id || "abc123"}`;

  // Auto-rotate activity log like a ticker
  useEffect(() => {
    if (currentActivityLogs.length > 0 && !isActivityExpanded) {
      const interval = setInterval(() => {
        setCurrentActivityIndex((prev) => (prev + 1) % currentActivityLogs.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentActivityLogs.length, isActivityExpanded]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareKakao = () => {
    alert("카카오톡으로 초대 링크를 공유합니다.");
    setShowInviteModal(false);
  };

  if (sharedGroups.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4"
        >
          <h1 className="text-xl font-bold text-foreground">그룹</h1>
        </motion.header>

        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4"
          >
            <Users className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-lg font-semibold text-foreground mb-2">아직 그룹이 없어요</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            가족, 친구, 동료와 함께<br />장바구니를 공유해보세요
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenGroupManagement}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            그룹 만들기
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowInviteModal)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.div
              ref={constraintsRef}
              initial={{ y: "100%" }}
              animate={{ y: 0, height: isFullScreen ? "100vh" : "auto" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 z-50 bg-card ${isFullScreen ? "rounded-none" : "rounded-t-3xl"} overflow-hidden`}
              style={{ maxHeight: isFullScreen ? "100vh" : "90vh" }}
            >
              {/* Drag Handle */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd(setShowInviteModal)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">멤버 초대하기</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowInviteModal)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="text-center py-4 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground">{currentGroup?.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentMembers.length}명 참여 중</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    초대 링크
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm text-muted-foreground truncate">
                      {inviteLink}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyLink}
                      className={`p-3 rounded-xl transition-colors ${
                        linkCopied ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium"
                  >
                    <Link className="w-5 h-5" />
                    링크 복사
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShareKakao}
                    className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] text-[#000000] rounded-xl font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡
                  </motion.button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeModal(setShowInviteModal);
                    setShowMembersModal(true);
                  }}
                  className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-medium"
                >
                  현재 멤버 보기
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowMembersModal)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.div
              ref={constraintsRef}
              initial={{ y: "100%" }}
              animate={{ y: 0, height: isFullScreen ? "100vh" : "auto" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 z-50 bg-card ${isFullScreen ? "rounded-none" : "rounded-t-3xl"} overflow-hidden`}
              style={{ maxHeight: isFullScreen ? "100vh" : "80vh" }}
            >
              {/* Drag Handle */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd(setShowMembersModal)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(80vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">멤버 목록</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowMembersModal)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {currentMembers.length}명의 멤버가 {currentGroup?.name}에 참여 중입니다.
                </p>

                <div className="space-y-2 mb-6">
                  {currentMembers.map((member: any, index: number) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-secondary rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-secondary-foreground">
                              {member.name}
                            </span>
                            {member.isOwner && (
                              <Crown className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{member.role}</span>
                        </div>
                      </div>
                      {!member.isOwner && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeModal(setShowMembersModal);
                    setShowInviteModal(true);
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  멤버 초대하기
                </motion.button>

                {/* Leave Group Button */}
                <div className="mt-6 pt-4 border-t border-border">
                  {!showLeaveConfirm ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowLeaveConfirm(true)}
                      className="w-full py-3 bg-destructive/10 text-destructive rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      그룹 나가기
                    </motion.button>
                  ) : (
                    <div className="bg-destructive/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-destructive">정말 나가시겠습니까?</p>
                          <p className="text-sm text-destructive/80 mt-1">
                            그룹에서 나가면 공유된 쇼핑 리스트와 일정을 더 이상 볼 수 없습니다.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowLeaveConfirm(false)}
                          className="flex-1 py-3 bg-card text-card-foreground rounded-xl font-medium"
                        >
                          취소
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            closeModal(setShowMembersModal);
                            setShowLeaveConfirm(false);
                            // Would call onLeaveGroup here
                          }}
                          className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-xl font-medium"
                        >
                          나가기
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Schedule Modal */}
      <AnimatePresence>
        {showAddScheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowAddScheduleModal)}
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
                onDragEnd={handleDragEnd(setShowAddScheduleModal)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(85vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">그룹 일정 추가</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowAddScheduleModal)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">일정 제목</label>
                    <input
                      type="text"
                      placeholder="예: 주간 장보기"
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">설명</label>
                    <textarea
                      placeholder="일정에 대한 설명을 입력하세요"
                      rows={2}
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">날짜</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-secondary rounded-xl text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">시간</label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 bg-secondary rounded-xl text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">장소</label>
                    <input
                      type="text"
                      placeholder="예: 이마트 역삼점"
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Repeat className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">반복 일정</p>
                        <p className="text-xs text-muted-foreground">매주/매월 반복 설정</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">참여 멤버</label>
                    <div className="flex flex-wrap gap-2">
                      {currentMembers.map((member: any) => (
                        <motion.button
                          key={member.id}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ backgroundColor: member.color }}
                          >
                            {member.name.charAt(0)}
                          </div>
                          {member.name}
                          <Check className="w-3 h-3" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => closeModal(setShowAddScheduleModal)}
                    className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl"
                  >
                    일정 추가
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">그룹</h1>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMembersModal(true)}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <Users className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenGroupManagement}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Group Tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {sharedGroups.map((group: any) => (
            <motion.button
              key={group.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectGroup(group)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentGroup?.id === group.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {group.name}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenGroupCreate || onOpenGroupManagement}
            className="flex-shrink-0 px-3 py-2 rounded-full bg-secondary text-muted-foreground"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.header>

      <main className="px-4 pt-4">
        {/* Members & Invite Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">멤버</h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              초대하기
            </motion.button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMembersModal(true)}
            className="w-full flex items-center gap-2"
          >
            {/* Member Avatars */}
            <div className="flex -space-x-2">
              {currentMembers.slice(0, 5).map((member: any, index: number) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative w-10 h-10 rounded-full border-2 border-card flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: member.color, zIndex: currentMembers.length - index }}
                  title={member.name}
                >
                  {member.name.charAt(0)}
                  {member.isOwner && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5 text-amber-900" />
                    </span>
                  )}
                </motion.div>
              ))}
              {currentMembers.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                  +{currentMembers.length - 5}
                </div>
              )}
            </div>
            
            <span className="text-sm text-muted-foreground ml-2">
              {currentMembers.length}명 참여 중
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </motion.button>
        </motion.div>

        {/* Activity Log - Ticker Style */}
        {currentActivityLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsActivityExpanded(!isActivityExpanded)}
              className="w-full flex items-center justify-between py-2.5 px-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                <Activity className="w-4 h-4 text-primary flex-shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentActivityIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1.5 text-sm truncate"
                  >
                    <span className="text-foreground font-medium flex-shrink-0">
                      {currentActivityLogs[currentActivityIndex]?.user}
                    </span>
                    <span 
                      className="font-semibold flex-shrink-0"
                      style={{ 
                        color: currentActivityLogs[currentActivityIndex]?.action === "add" 
                          ? "#10B981" 
                          : "#3B82F6" 
                      }}
                    >
                      {currentActivityLogs[currentActivityIndex]?.action === "add" ? "추가" : "완료"}
                    </span>
                    <span className="text-foreground truncate">
                      {currentActivityLogs[currentActivityIndex]?.item}
                    </span>
                    <span className="text-xs text-muted-foreground/70 flex-shrink-0">
                      {currentActivityLogs[currentActivityIndex]?.time}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <motion.div
                animate={{ rotate: isActivityExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 ml-2"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.button>

            {/* Expanded Activity Log */}
            <AnimatePresence>
              {isActivityExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 space-y-1.5">
                    {currentActivityLogs.map((log: any, index: number) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center gap-2 py-2 px-3 bg-card rounded-lg text-sm"
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                          style={{ backgroundColor: log.userColor }}
                        >
                          {log.user.charAt(0)}
                        </div>
                        <span className="font-medium text-card-foreground">
                          {log.user}
                        </span>
                        <span 
                          className="font-semibold"
                          style={{ color: log.action === "add" ? "#10B981" : "#3B82F6" }}
                        >
                          {log.action === "add" ? "추가" : "완료"}
                        </span>
                        <span className="text-foreground truncate flex-1">{log.item}</span>
                        <span className="text-xs text-muted-foreground/70 flex-shrink-0">{log.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Section Toggle */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-secondary rounded-xl">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection("cart")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "cart"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            공유 장바구니 ({groupItems.filter((i: any) => !i.completed).length})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection("schedule")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "schedule"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            그룹 일정 ({currentSchedules.length})
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {activeSection === "schedule" ? (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {/* Add Schedule Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddScheduleModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:bg-primary/5 transition-colors"
              >
                <CalendarPlus className="w-5 h-5" />
                <span className="font-medium">새 일정 추가</span>
              </motion.button>

              {currentSchedules.length > 0 ? (
                currentSchedules.map((schedule: any, index: number) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-card-foreground">{schedule.title}</h4>
                          {schedule.isRecurring && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full flex items-center gap-1">
                              <Repeat className="w-3 h-3" />
                              반복
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{schedule.description}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-secondary rounded-lg"
                      >
                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>

                    {/* Linked Items */}
                    {schedule.linkedItems && schedule.linkedItems.length > 0 && (
                      <div className="mb-3 p-3 bg-secondary/50 rounded-xl">
                        <p className="text-xs font-medium text-muted-foreground mb-2">연결된 아이템</p>
                        <div className="flex flex-wrap gap-1">
                          {schedule.linkedItems.map((item: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-card text-card-foreground text-xs rounded-md"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {schedule.participants.slice(0, 3).map((p: any, i: number) => (
                            <div
                              key={p.id}
                              className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white font-medium"
                              style={{ backgroundColor: p.color, zIndex: 3 - i }}
                            >
                              {p.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {schedule.participants.length}명 참여
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {schedule.createdBy.name}님이 생성
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                >
                  <Calendar className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">일정이 없습니다</p>
                  <p className="text-sm">그룹 일정을 추가해보세요</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {groupItems.length > 0 ? (
                groupItems.map((item: any) => (
<ShoppingItemCard
  key={item.id}
  item={item}
  onNavigate={onNavigate}
  onComplete={onCompleteItem}
  onUpdateItem={onUpdateItem}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                >
                  <ShoppingCart className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">장바구니가 비어있어요</p>
                  <p className="text-sm">+ 버튼을 눌러 아이템을 추가해보세요</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
