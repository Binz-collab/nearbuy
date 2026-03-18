"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  User, Settings, Bell, HelpCircle, LogOut, ChevronRight, ShoppingBag, MapPin, 
  CheckCircle, Route, Plus, Trash2, Clock, Calendar, Link2, Check, X,
  Smartphone, Globe, Moon, Sun, Volume2, VolumeX, Vibrate, Mail, MessageCircle,
  ChevronDown, ExternalLink, BarChart3, TrendingUp, Wallet, PieChart,
  Languages, MapPinned, Shield, FileText, Phone, Navigation, AlertTriangle, UserX,
  Sparkles, StickyNote, Users
} from "lucide-react";
import { useState, useRef } from "react";

interface ProfileScreenProps {
  onLogout: () => void;
  stats: any;
  routines: any[];
  onSaveRoutines: (routines: any[]) => void;
  onOpenDashboard?: () => void;
  userProfile?: { id: string; name: string; nickname: string; color: string };
  onUpdateProfile?: (profile: any) => void;
  }

const dayLabels: any = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

// Calendar services for integration
const calendarServices = [
  {
    id: "google",
    name: "Google Calendar",
    icon: "G",
    color: "#4285F4",
    description: "구글 캘린더와 연동하여 일정을 자동으로 가져옵니다",
  },
  {
    id: "samsung",
    name: "Samsung Calendar",
    icon: "S",
    color: "#1428A0",
    description: "삼성 캘린더와 연동하여 일정을 동기화합니다",
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: "A",
    color: "#000000",
    description: "애플 캘린더와 연동하여 일정을 가져옵니다",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: "O",
    color: "#0078D4",
    description: "마이크로소프트 아웃룩과 연동합니다",
  },
];

// Map services for navigation
const mapServices = [
  {
    id: "naver",
    name: "네이버 지도",
    icon: "N",
    color: "#03C75A",
    scheme: "nmap://",
  },
  {
    id: "kakao",
    name: "카카오맵",
    icon: "K",
    color: "#FEE500",
    textColor: "#000",
    scheme: "kakaomap://",
  },
  {
    id: "google",
    name: "Google Maps",
    icon: "G",
    color: "#4285F4",
    scheme: "comgooglemaps://",
  },
  {
    id: "apple",
    name: "Apple Maps",
    icon: "A",
    color: "#000000",
    scheme: "maps://",
  },
];

// FAQ items
const faqItems = [
  {
    question: "근처 알림은 어떻게 받나요?",
    answer: "위치 권한을 허용하면 설정한 장소 근처에 도착했을 때 자동으로 알림을 받을 수 있어요. 마이페이지 > 앱 설정에서 알림 반경을 조절할 수 있습니다."
  },
  {
    question: "그룹은 어떻게 만들고 초대하나요?",
    answer: "그룹 탭에서 + 버튼을 눌러 새 그룹을 만들 수 있어요. 생성 후 초대 링크를 카카오톡이나 다른 방법으로 공유하면 됩니다."
  },
  {
    question: "캘린더 연동은 어떤 기능인가요?",
    answer: "외부 캘린더(구글, 삼성 등)를 연동하면 일정에 맞춰 쇼핑 알림을 받을 수 있어요. 이동 경로에 있는 매장을 자동으로 추천해드립니다."
  },
  {
    question: "데이터는 안전하게 보관되나요?",
    answer: "네, 모든 데이터는 암호화되어 안전하게 저장됩니다. 위치 정보는 알림 기능에만 사용되며, 제3자에게 공유되지 않습니다."
  },
];

export function ProfileScreen({ onLogout, stats, routines, onSaveRoutines, onOpenDashboard, userProfile, onUpdateProfile }: ProfileScreenProps) {
  const [isEditingRoutines, setIsEditingRoutines] = useState(false);
  const [editedRoutines, setEditedRoutines] = useState<any[]>(routines);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>(["google"]);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState(userProfile?.nickname || "사용자");
  
  // Settings modals
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const constraintsRef = useRef(null);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    nearbyAlert: true,
    groupActivity: true,
    scheduleReminder: true,
    sound: true,
    vibration: true,
  });
  
  // App settings state
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    language: "ko",
    nearbyRadius: 500,
    preferredMapService: "naver",
  });
  
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);

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

  const menuItems = [
    { icon: Bell, label: "알림 설정", action: () => setShowNotificationSettings(true) },
    { icon: Settings, label: "앱 설정", action: () => setShowAppSettings(true) },
    { icon: HelpCircle, label: "도움말", action: () => setShowHelpModal(true) },
  ];

  const handleAddRoutine = () => {
  const newRoutine = {
  id: `r${Date.now()}`,
  name: "",
  startLocation: "",
  endLocation: "",
  startTime: "09:00",
  endTime: "18:00",
  isRoundTrip: true,
  days: ["mon", "tue", "wed", "thu", "fri"],
  };
  setEditedRoutines([...editedRoutines, newRoutine]);
  };

  const handleUpdateRoutine = (id: string, field: string, value: any) => {
    setEditedRoutines(
      editedRoutines.map((r: any) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRoutine = (id: string) => {
    setEditedRoutines(editedRoutines.filter((r: any) => r.id !== id));
  };

  const handleToggleDay = (routineId: string, day: string) => {
    setEditedRoutines(
      editedRoutines.map((r: any) => {
        if (r.id === routineId) {
          const days = r.days.includes(day)
            ? r.days.filter((d: string) => d !== day)
            : [...r.days, day];
          return { ...r, days };
        }
        return r;
      })
    );
  };

  const handleSaveRoutines = () => {
    onSaveRoutines(editedRoutines.filter((r: any) => r.name && r.startLocation && r.endLocation));
    setIsEditingRoutines(false);
  };

  const handleToggleCalendar = (calendarId: string) => {
    setConnectedCalendars((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showNotificationSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowNotificationSettings)}
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
                onDragEnd={handleDragEnd(setShowNotificationSettings)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">알림 설정</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowNotificationSettings)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">푸시 알림</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-card-foreground">알림 받기</p>
                            <p className="text-xs text-muted-foreground">모든 푸시 알림 on/off</p>
                          </div>
                        </div>
                        <ToggleSwitch 
                          enabled={notificationSettings.pushEnabled}
                          onToggle={() => setNotificationSettings(prev => ({ ...prev, pushEnabled: !prev.pushEnabled }))}
                        />
                      </div>

                      {notificationSettings.pushEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3 pl-4 border-l-2 border-primary/20"
                        >
                          <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <MapPinned className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-card-foreground">근처 매장 알림</span>
                            </div>
                            <ToggleSwitch 
                              enabled={notificationSettings.nearbyAlert}
                              onToggle={() => setNotificationSettings(prev => ({ ...prev, nearbyAlert: !prev.nearbyAlert }))}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-card-foreground">그룹 활동 알림</span>
                            </div>
                            <ToggleSwitch 
                              enabled={notificationSettings.groupActivity}
                              onToggle={() => setNotificationSettings(prev => ({ ...prev, groupActivity: !prev.groupActivity }))}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-card-foreground">일정 리마인더</span>
                            </div>
                            <ToggleSwitch 
                              enabled={notificationSettings.scheduleReminder}
                              onToggle={() => setNotificationSettings(prev => ({ ...prev, scheduleReminder: !prev.scheduleReminder }))}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Sound & Vibration */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">소리 및 진동</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          {notificationSettings.sound ? (
                            <Volume2 className="w-5 h-5 text-primary" />
                          ) : (
                            <VolumeX className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium text-card-foreground">알림 소리</span>
                        </div>
                        <ToggleSwitch 
                          enabled={notificationSettings.sound}
                          onToggle={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Vibrate className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-card-foreground">진동</span>
                        </div>
                        <ToggleSwitch 
                          enabled={notificationSettings.vibration}
                          onToggle={() => setNotificationSettings(prev => ({ ...prev, vibration: !prev.vibration }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* App Settings Modal */}
      <AnimatePresence>
        {showAppSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowAppSettings)}
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
                onDragEnd={handleDragEnd(setShowAppSettings)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">앱 설정</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowAppSettings)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Display */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">디스플레이</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {appSettings.darkMode ? (
                          <Moon className="w-5 h-5 text-primary" />
                        ) : (
                          <Sun className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium text-card-foreground">다크 모드</p>
                          <p className="text-xs text-muted-foreground">어두운 테마 사용</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        enabled={appSettings.darkMode}
                        onToggle={() => setAppSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                      />
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">언어</h3>
                    
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Languages className="w-5 h-5 text-primary" />
                        <span className="font-medium text-card-foreground">앱 언어</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { value: "ko", label: "한국어" },
                          { value: "en", label: "English" },
                          { value: "ja", label: "日本語" },
                        ].map((lang) => (
                          <motion.button
                            key={lang.value}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAppSettings(prev => ({ ...prev, language: lang.value }))}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                              appSettings.language === lang.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-card-foreground border border-border"
                            }`}
                          >
                            {lang.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">위치</h3>
                    
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPinned className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-card-foreground">알림 반경</p>
                          <p className="text-xs text-muted-foreground">현재: {appSettings.nearbyRadius}m</p>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={appSettings.nearbyRadius}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, nearbyRadius: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>100m</span>
                        <span>2km</span>
                      </div>
                    </div>
                  </div>

                  {/* Map Service */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">지도 서비스</h3>
                    
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Navigation className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-card-foreground">선호 지도 앱</p>
                          <p className="text-xs text-muted-foreground">길찾기 시 기본으로 열릴 앱</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {mapServices.map((service) => (
                          <motion.button
                            key={service.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAppSettings(prev => ({ ...prev, preferredMapService: service.id }))}
                            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${
                              appSettings.preferredMapService === service.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-card-foreground border border-border"
                            }`}
                          >
                            <div 
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                appSettings.preferredMapService === service.id
                                  ? "bg-primary-foreground/20"
                                  : ""
                              }`}
                              style={{ 
                                backgroundColor: appSettings.preferredMapService !== service.id ? service.color : undefined,
                                color: appSettings.preferredMapService !== service.id ? (service.textColor || "#fff") : undefined
                              }}
                            >
                              {service.icon}
                            </div>
                            <span className="truncate">{service.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">정보</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <span className="text-card-foreground">개인정보 처리방침</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-card-foreground">서비스 이용약관</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                          <span className="text-card-foreground">앱 버전</span>
                        </div>
                        <span className="text-sm text-muted-foreground">1.0.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-destructive uppercase tracking-wider">계정</h3>
                    
                    {!showDeleteAccountConfirm ? (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDeleteAccountConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-destructive/10 text-destructive rounded-xl font-medium"
                      >
                        <UserX className="w-5 h-5" />
                        회원 탈퇴
                      </motion.button>
                    ) : (
                      <div className="bg-destructive/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">정말 탈퇴하시겠습니까?</p>
                            <p className="text-sm text-destructive/80 mt-1">
                              모든 데이터가 삭제되며 복구할 수 없습니다. 소속된 그룹에서도 자동으로 탈퇴됩니다.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowDeleteAccountConfirm(false)}
                            className="flex-1 py-3 bg-card text-card-foreground rounded-xl font-medium"
                          >
                            취소
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              // Would call account deletion API here
                              closeModal(setShowAppSettings);
                              setShowDeleteAccountConfirm(false);
                              onLogout();
                            }}
                            className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-xl font-medium"
                          >
                            탈퇴하기
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeModal(setShowHelpModal)}
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
                onDragEnd={handleDragEnd(setShowHelpModal)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(90vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">도움말</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => closeModal(setShowHelpModal)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* FAQ */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">자주 묻는 질문</h3>
                    
                    <div className="space-y-2">
                      {faqItems.map((faq, index) => (
                        <motion.div
                          key={index}
                          className="bg-secondary/50 rounded-xl overflow-hidden"
                        >
                          <motion.button
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            className="w-full flex items-center justify-between p-4"
                          >
                            <span className="font-medium text-card-foreground text-left">{faq.question}</span>
                            <motion.div
                              animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          </motion.button>
                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pb-4"
                              >
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">문의하기</h3>
                    
                    <div className="space-y-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-4 bg-secondary/50 rounded-xl"
                      >
                        <Mail className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-card-foreground">이메일 문의</p>
                          <p className="text-xs text-muted-foreground">support@nearbuy.app</p>
                        </div>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-4 bg-secondary/50 rounded-xl"
                      >
                        <MessageCircle className="w-5 h-5 text-[#FEE500]" />
                        <div className="text-left">
                          <p className="font-medium text-card-foreground">카카오톡 상담</p>
                          <p className="text-xs text-muted-foreground">@nearbuy</p>
                        </div>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-4 bg-secondary/50 rounded-xl"
                      >
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div className="text-left">
                          <p className="font-medium text-card-foreground">고객센터</p>
                          <p className="text-xs text-muted-foreground">1588-0000 (평일 09:00-18:00)</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Tutorial */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUsageGuide(true)}
                    className="w-full p-4 bg-primary/5 rounded-xl text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-card-foreground">앱 사용 가이드</p>
                        <p className="text-xs text-muted-foreground">NearBuy의 모든 기능을 알아보세요</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Usage Guide Modal */}
      <AnimatePresence>
        {showUsageGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowUsageGuide(false)}
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
                  onClick={() => setShowUsageGuide(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[
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
                ].map((step, index) => {
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
                  onClick={() => setShowUsageGuide(false)}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-sm"
                >
                  확인
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Calendar Integration Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendarModal(false)}
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
                onDragEnd={handleDragEnd(setShowCalendarModal)}
                className="cursor-grab active:cursor-grabbing py-3"
              >
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto" />
              </motion.div>

              <div className="p-6 pt-2 overflow-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 40px)" : "calc(85vh - 40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-card-foreground">캘린더 연동</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCalendarModal(false)}
                    className="p-2 rounded-full hover:bg-secondary"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-1">스마트 일정 연동</h3>
                      <p className="text-sm text-muted-foreground">
                        외부 캘린더�� 연동하면 일정에 맞춰 쇼핑 알림을 받을 수 있어요. 
                        이동 경로에 있는 매장을 자동으로 추천해드립니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {calendarServices.map((service, index) => {
                    const isConnected = connectedCalendars.includes(service.id);
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          isConnected 
                            ? "border-primary bg-primary/5" 
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                              style={{ backgroundColor: service.color }}
                            >
                              {service.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-card-foreground">{service.name}</h4>
                                {isConnected && (
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    연동됨
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleCalendar(service.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                              isConnected
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {isConnected ? "해제" : "연동"}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 pt-6 pb-4"
      >
        <h1 className="text-xl font-bold text-foreground">마이</h1>
      </motion.header>

      <div className="px-4 space-y-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
  <div className="flex items-center gap-4">
  <div 
    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
    style={{ backgroundColor: userProfile?.color || "#6366F1" }}
  >
  {(userProfile?.nickname || "사용자").charAt(0)}
  </div>
  <div className="min-w-0 flex-1">
    {isEditingNickname ? (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedNickname}
          onChange={(e) => setEditedNickname(e.target.value)}
          maxLength={20}
          className="flex-1 min-w-0 px-3 py-1.5 bg-secondary rounded-lg text-card-foreground font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (editedNickname.trim() && onUpdateProfile) {
              onUpdateProfile({ ...userProfile, nickname: editedNickname.trim(), name: editedNickname.trim() });
            }
            setIsEditingNickname(false);
          }}
          className="p-1.5 bg-primary text-primary-foreground rounded-lg"
        >
          <Check className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditedNickname(userProfile?.nickname || "사용자");
            setIsEditingNickname(false);
          }}
          className="p-1.5 bg-secondary text-secondary-foreground rounded-lg"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    ) : (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsEditingNickname(true)}
        className="text-left"
      >
        <h2 className="font-bold text-lg text-card-foreground truncate">{userProfile?.nickname || "사용자"}</h2>
        <p className="text-xs text-primary">탭하여 닉네임 변경</p>
      </motion.button>
    )}
  </div>
  </div>
  
  {/* Join Date */}
  <div className="flex items-center gap-1.5 mt-3 text-muted-foreground">
    <Calendar className="w-3.5 h-3.5" />
    <span className="text-xs">2024.01.15 가입</span>
  </div>
        </motion.div>

        {/* Stats Card - Now links to Dashboard */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.99 }}
          onClick={onOpenDashboard}
          className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">소비 리포트</h3>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm font-medium">
              자세히 보기
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-card-foreground">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">총 아이템</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-card-foreground">{stats.completed}</p>
              <p className="text-[10px] text-muted-foreground">완료</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-card-foreground">{stats.locations}</p>
              <p className="text-[10px] text-muted-foreground">장소</p>
            </div>
          </div>

          {/* Mini chart indicator */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">이번 달 완료율</span>
              <span className="text-xs font-medium text-green-500 ml-auto">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </motion.button>

        {/* Calendar Integration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-card-foreground">캘린더 연동</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                외부 캘린더와 일정을 동기화하세요
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCalendarModal(true)}
              className="text-sm text-primary font-medium flex-shrink-0"
            >
              관리
            </motion.button>
          </div>

          {connectedCalendars.length > 0 ? (
            <div className="space-y-2">
              {connectedCalendars.map((calId) => {
                const service = calendarServices.find((s) => s.id === calId);
                if (!service) return null;
                return (
                  <div
                    key={calId}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-secondary-foreground truncate">
                        {service.name}
                      </p>
                      <p className="text-xs text-muted-foreground">연동됨</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCalendarModal(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link2 className="w-5 h-5" />
              <span>캘린더 연동하기</span>
            </motion.button>
          )}
        </motion.div>

        {/* Routine Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-card-foreground">고정 루틴</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">출퇴근, 등하교 등 반복되는 동선</p>
            </div>
            {!isEditingRoutines ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditedRoutines(routines);
                  setIsEditingRoutines(true);
                }}
                className="text-sm text-primary font-medium flex-shrink-0"
              >
                편집
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveRoutines}
                className="text-sm text-primary font-medium flex-shrink-0"
              >
                저장
              </motion.button>
            )}
          </div>
          
          {isEditingRoutines ? (
            <div className="space-y-3">
              {editedRoutines.map((routine: any) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-secondary rounded-xl space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="루틴 이름"
                      value={routine.name}
                      onChange={(e) => handleUpdateRoutine(routine.id, "name", e.target.value)}
                      className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="출발지"
                      value={routine.startLocation}
                      onChange={(e) => handleUpdateRoutine(routine.id, "startLocation", e.target.value)}
                      className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="도착지"
                      value={routine.endLocation}
                      onChange={(e) => handleUpdateRoutine(routine.id, "endLocation", e.target.value)}
                      className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Round trip toggle + Time in one row */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUpdateRoutine(routine.id, "isRoundTrip", !routine.isRoundTrip)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                        routine.isRoundTrip
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-card text-muted-foreground border border-border"
                      }`}
                    >
                      <Route className="w-3.5 h-3.5" />
                      <span>왕복</span>
                    </motion.button>
                    <input
                      type="time"
                      value={routine.startTime}
                      onChange={(e) => handleUpdateRoutine(routine.id, "startTime", e.target.value)}
                      className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {routine.isRoundTrip && (
                      <input
                        type="time"
                        value={routine.endTime || "18:00"}
                        onChange={(e) => handleUpdateRoutine(routine.id, "endTime", e.target.value)}
                        className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                  </div>

                  <div className="flex gap-1">
                    {Object.entries(dayLabels).map(([key, label]) => (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleDay(routine.id, key)}
                        className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-colors ${
                          routine.days.includes(key)
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-muted-foreground border border-border"
                        }`}
                      >
                        {label as string}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddRoutine}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>루틴 추가</span>
              </motion.button>
            </div>
          ) : routines.length > 0 ? (
            <div className="space-y-2">
              {routines.map((routine: any) => (
                <div
                  key={routine.id}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Route className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-secondary-foreground">{routine.name}</span>
                      {routine.isRoundTrip && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">왕복</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {routine.startLocation} → {routine.endLocation}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-foreground">
                      {routine.startTime}
                      {routine.isRoundTrip && routine.endTime && (
                        <span className="text-muted-foreground font-normal"> / {routine.endTime}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {routine.days.map((d: string) => dayLabels[d]).join(" ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsEditingRoutines(true);
                handleAddRoutine();
              }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Route className="w-5 h-5" />
              <span>출퇴근 루틴 설정하기</span>
            </motion.button>
          )}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-card-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/10 text-destructive rounded-xl text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </motion.button>
      </div>
    </div>
  );
}
