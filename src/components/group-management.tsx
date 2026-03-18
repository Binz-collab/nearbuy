"use client";

import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { X, Users, Link, MessageCircle, Copy, Check, UserPlus, Trash2, Crown, Edit3, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";

interface GroupManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: any) => void;
  mode?: "create" | "settings";
  currentGroup?: any;
  isAdmin?: boolean;
  onDeleteGroup?: (groupId: string) => void;
  onLeaveGroup?: (groupId: string) => void;
  onUpdateNickname?: (nickname: string) => void;
}

type Step = "create" | "nickname" | "invite";

export function GroupManagement({ 
  isOpen, 
  onClose, 
  onCreateGroup, 
  mode = "create",
  currentGroup,
  isAdmin = false,
  onDeleteGroup,
  onLeaveGroup,
  onUpdateNickname
}: GroupManagementProps) {
  const [step, setStep] = useState<Step>("create");
  const [groupName, setGroupName] = useState("");
  const [nickname, setNickname] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [settingsNickname, setSettingsNickname] = useState(currentGroup?.myNickname || "");
  const constraintsRef = useRef(null);

  const inviteLink = "https://nearbuy.app/invite/abc123";

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      type: "default",
      memberCount: 1,
    };
    setCreatedGroup(newGroup);
    setStep("nickname");
  };

  const handleSetNickname = () => {
    const finalNickname = nickname.trim() || "나";
    const newGroup = {
      ...createdGroup,
      myNickname: finalNickname,
    };
    setCreatedGroup(newGroup);
    setStep("invite");
  };

  const handleSkipNickname = () => {
    const newGroup = {
      ...createdGroup,
      myNickname: "나",
    };
    setCreatedGroup(newGroup);
    setStep("invite");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareKakao = () => {
    alert("카카오톡으로 초대 링크를 공유합니다.");
  };

  const handleComplete = () => {
    if (createdGroup) {
      onCreateGroup(createdGroup);
    }
    handleClose();
  };

  const handleClose = () => {
    setStep("create");
    setGroupName("");
    setNickname("");
    setCreatedGroup(null);
    setIsFullScreen(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDeleteGroup = () => {
    if (onDeleteGroup && currentGroup) {
      onDeleteGroup(currentGroup.id);
    }
    handleClose();
  };

  const handleLeaveGroup = () => {
    if (onLeaveGroup && currentGroup) {
      onLeaveGroup(currentGroup.id);
    }
    handleClose();
  };

  const handleSaveNickname = () => {
    if (onUpdateNickname && settingsNickname.trim()) {
      onUpdateNickname(settingsNickname.trim());
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsFullScreen(true);
    } else if (info.offset.y > 50 && isFullScreen) {
      setIsFullScreen(false);
    } else if (info.offset.y > 100 && !isFullScreen) {
      handleClose();
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Settings mode UI
  if (mode === "settings" && currentGroup) {
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
              style={{ maxHeight: isFullScreen ? "100vh" : "90vh" }}
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

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">그룹 설정</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* My Settings Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">내 설정</h3>
                    
                    {/* Nickname Setting */}
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <label className="block text-xs font-medium text-card-foreground mb-1.5">
                        그룹 내 닉네임
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settingsNickname}
                          onChange={(e) => setSettingsNickname(e.target.value)}
                          placeholder="그룹에서 사용할 닉네임"
                          className="flex-1 px-3 py-2 bg-card rounded-xl border-0 text-sm text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveNickname}
                          className="px-3 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
                        >
                          저장
                        </motion.button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        이 닉네임은 이 그룹에서만 사용됩니다.
                      </p>
                    </div>
                  </div>

                  {/* Admin Settings Section */}
                  {isAdmin && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">관리자 설정</h3>
                      
                      {/* Group Name */}
                      <div className="bg-secondary/50 rounded-xl p-3">
                        <label className="block text-xs font-medium text-card-foreground mb-1.5">
                          그룹 이름
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={currentGroup.name}
                            placeholder="그룹 이름"
                            className="flex-1 px-3 py-2 bg-card rounded-xl border-0 text-sm text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-primary text-primary-foreground rounded-xl"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-destructive uppercase tracking-wider">위험 구역</h3>
                    
                    {isAdmin ? (
                      <>
                        {!showDeleteConfirm ? (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/10 text-destructive rounded-xl font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            그룹 삭제하기
                          </motion.button>
                        ) : (
                          <div className="bg-destructive/10 rounded-xl p-3 space-y-2.5">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-destructive text-sm">정말 삭제하시겠습니까?</p>
                                <p className="text-xs text-destructive/80 mt-0.5">
                                  이 작업은 되돌릴 수 없습니다. 모든 그룹 데이터가 삭제됩니다.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 bg-card text-card-foreground rounded-xl font-medium text-sm"
                              >
                                취소
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDeleteGroup}
                                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-xl font-medium text-sm"
                              >
                                삭제
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLeaveGroup}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/10 text-destructive rounded-xl font-medium text-sm"
                      >
                        <X className="w-4 h-4" />
                        그룹 나가기
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

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
            style={{ maxHeight: isFullScreen ? "100vh" : "90vh" }}
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

            <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-card-foreground">
                  {step === "create" && "새 그룹 만들기"}
                  {step === "nickname" && "닉네임 설정"}
                  {step === "invite" && "멤버 초대하기"}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-8">
                {["create", "nickname", "invite"].map((s, idx) => {
                  const isActive = ["create", "nickname", "invite"].indexOf(step) >= idx;
                  return (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                          isActive ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span className={isActive ? "text-primary-foreground" : "text-muted-foreground"}>
                          {idx + 1}
                        </span>
                      </div>
                      {idx < 2 && (
                        <div className={`w-8 h-0.5 transition-colors duration-300 ${["create", "nickname", "invite"].indexOf(step) > idx ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {step === "create" && (
                  <motion.div
                    key="create"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        그룹 이름
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="예: 우리 집, 동아리, 룸메이트"
                        className="w-full px-4 py-3 bg-secondary rounded-xl border-0 text-secondary-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">공유 장바구니</p>
                        <p className="text-sm text-muted-foreground">
                          그룹원들과 쇼핑 리스트를 실시간으로 공유하세요
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateGroup}
                      disabled={!groupName.trim()}
                      className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      다음
                    </motion.button>
                  </motion.div>
                )}

                {step === "nickname" && (
                  <motion.div
                    key="nickname"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit3 className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-card-foreground mb-1">
                        닉네임을 설정하세요
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {createdGroup?.name || groupName} 그룹에서 사용할 이름이에요
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        닉네임
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="예: 엄마, 아빠, 회장"
                        className="w-full px-4 py-3 bg-secondary rounded-xl border-0 text-secondary-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        비워두면 기본 닉네임인 &quot;나&quot;로 설정됩니다.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSkipNickname}
                        className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm"
                      >
                        건너뛰기
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSetNickname}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-sm"
                      >
                        다음
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === "invite" && (
                  <motion.div
                    key="invite"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-card-foreground mb-1">
                        {createdGroup?.name || groupName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        그룹이 생성되었습니다! 멤버를 초대해보세요.
                      </p>
                    </div>

                    <div>
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

                    <div className="grid grid-cols-2 gap-3">
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

                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        className="flex-1 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl"
                      >
                        취소
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        className="flex-1 py-4 bg-primary text-primary-foreground font-semibold rounded-xl"
                      >
                        완료
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
