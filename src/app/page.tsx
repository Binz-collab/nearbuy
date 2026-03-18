"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginScreen } from "@/components/screens/login-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { MapScreen } from "@/components/screens/map-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { GroupScreen } from "@/components/screens/group-screen";
import { InviteLandingScreen } from "@/components/screens/invite-landing-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { PushNotification } from "@/components/push-notification";
import { NotificationCenter } from "@/components/notification-center";
import { AddItemDrawer } from "@/components/add-item-drawer";
import { GroupManagement } from "@/components/group-management";

// Dummy shared members
const sharedMembers: any[] = [
  { id: "m1", name: "민지", color: "#FF6B6B" },
  { id: "m2", name: "철수", color: "#4ECDC4" },
  { id: "m3", name: "영희", color: "#9B59B6" },
];

// Dummy groups
const initialGroups: any[] = [
  { id: "personal", name: "개인", type: "personal", memberCount: 1 },
  { id: "home", name: "우리 집", type: "home", memberCount: 3 },
  { id: "club", name: "동아리", type: "club", memberCount: 5 },
];

const initialItems: any[] = [
  {
    id: "1",
    name: "세탁세제",
    category: "다이소",
    location: "강남역 다이소",
    lat: 37.5665,
    lng: 126.978,
    completed: false,
    sharedWith: [sharedMembers[0], sharedMembers[1]],
    addedBy: sharedMembers[0],
    groupId: "home",
    isScheduled: false,
    memo: "무향 제품으로 구매하기",
  },
  {
    id: "2",
    name: "우유",
    category: "마트",
    location: "이마트 역삼점",
    lat: 37.5012,
    lng: 127.0396,
    completed: false,
    purchasingBy: sharedMembers[1],
    sharedWith: [sharedMembers[0], sharedMembers[1], sharedMembers[2]],
    addedBy: sharedMembers[1],
    groupId: "home",
    isScheduled: true,
    scheduleDate: "2026-03-17",
    scheduleTime: "18:00",
    memo: "저지방 1L 2개",
  },
  {
    id: "3",
    name: "감기약",
    category: "약국",
    location: "온누리약국",
    lat: 37.4979,
    lng: 127.0276,
    completed: false,
    addedBy: { id: "me", name: "나", color: "#6366F1" },
    groupId: "personal",
    isScheduled: false,
  },
  {
    id: "4",
    name: "삼각김밥",
    category: "편의점",
    location: "GS25 테헤란로점",
    lat: 37.5172,
    lng: 127.0473,
    completed: true,
    addedBy: { id: "me", name: "나", color: "#6366F1" },
    groupId: "personal",
    isScheduled: false,
  },
  {
    id: "5",
    name: "소금빵",
    category: "베이커리",
    location: "파리바게뜨 강남점",
    lat: 37.5045,
    lng: 127.0498,
    completed: false,
    sharedWith: [sharedMembers[0]],
    addedBy: sharedMembers[0],
    groupId: "club",
    isScheduled: true,
    scheduleDate: "2026-03-18",
    scheduleTime: "10:00",
  },
  {
    id: "6",
    name: "충전기",
    category: "다이소",
    location: "강남역 다이소",
    lat: 37.5665,
    lng: 126.978,
    completed: false,
    addedBy: { id: "me", name: "나", color: "#6366F1" },
    groupId: "personal",
    isScheduled: true,
    scheduleDate: "2026-03-17",
    scheduleTime: "15:00",
  },
];

const initialSchedules: any[] = [
  {
    id: "s1",
    time: "08:30",
    title: "출근",
    location: "집 -> 회사",
    isPast: true,
    isCurrent: false,
    calendarSource: "routine",
    isRoutine: true,
  },
  {
    id: "s2",
    time: "10:00",
    title: "주간 회의",
    location: "회사 회의실",
    isPast: true,
    isCurrent: false,
    calendarSource: "google",
  },
  {
    id: "s3",
    time: "12:00",
    title: "점심 미팅",
    location: "강남역 부근",
    isPast: true,
    isCurrent: false,
    recommendation: initialItems[0],
    calendarSource: "google",
  },
  {
    id: "s4",
    time: "15:00",
    title: "외근",
    location: "역삼역",
    isPast: false,
    isCurrent: true,
    recommendation: initialItems[1],
    calendarSource: "samsung",
  },
  {
    id: "s5",
    time: "18:00",
    title: "퇴근",
    location: "회사 -> 집",
    isPast: false,
    isCurrent: false,
    calendarSource: "routine",
    isRoutine: true,
  },
];

const initialNotifications: any[] = [
  {
    id: "n1",
    type: "enter",
    message: "강남역 다이소 근처입니다. 세탁세제를 구매하세요!",
    time: "방금 전",
  },
  {
    id: "n2",
    type: "enter",
    message: "이마트 역삼점이 100m 앞에 있습니다.",
    time: "5분 전",
  },
  {
    id: "n3",
    type: "purchased",
    message: "철수님이 삼각김밥을 구매했습니다.",
    time: "30분 전",
  },
];

const initialRoutines: any[] = [
  {
    id: "r1",
    name: "출퇴근",
    startLocation: "집",
    endLocation: "회사",
    startTime: "08:30",
    endTime: "18:00",
    isRoundTrip: true,
    days: ["mon", "tue", "wed", "thu", "fri"],
  },
];

const categories = [
  { id: "all", label: "전체" },
  { id: "daiso", label: "다이소" },
  { id: "mart", label: "마트" },
  { id: "convenience", label: "편의점" },
  { id: "pharmacy", label: "약국" },
  { id: "bakery", label: "베이커리" },
];

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function NearBuyApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showInviteLanding, setShowInviteLanding] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("home");
  const [items, setItems] = useState<any[]>(initialItems);
  const [groups, setGroups] = useState<any[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<any>(initialGroups[0]);
  
  // User profile - nickname from mypage
  const [userProfile, setUserProfile] = useState({
    id: "me",
    name: "사용자",
    nickname: "사용자",
    color: "#6366F1",
  });
  const [calendarSchedules] = useState<any[]>(initialSchedules.filter(s => !s.isRoutine));
  const [routines, setRoutines] = useState<any[]>(initialRoutines);

  // Generate schedules from routines + calendar events
  const todayDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  const routineSchedules = routines.flatMap((routine: any) => {
    if (!routine.days.includes(todayDay)) return [];
    const scheduleItems: any[] = [];
    
    // Going schedule (start location -> end location)
    scheduleItems.push({
      id: `${routine.id}-go`,
      time: routine.startTime,
      title: routine.name.includes("출퇴근") ? "출근" : `${routine.name} (출발)`,
      location: `${routine.startLocation} -> ${routine.endLocation}`,
      isPast: true,
      isCurrent: false,
      calendarSource: "routine",
      isRoutine: true,
    });
    
    // Return schedule (end location -> start location) if round trip
    if (routine.isRoundTrip && routine.endTime) {
      scheduleItems.push({
        id: `${routine.id}-return`,
        time: routine.endTime,
        title: routine.name.includes("출퇴근") ? "퇴근" : `${routine.name} (복귀)`,
        location: `${routine.endLocation} -> ${routine.startLocation}`,
        isPast: false,
        isCurrent: false,
        calendarSource: "routine",
        isRoutine: true,
      });
    }
    
    return scheduleItems;
  });

  // Combine and sort all schedules by time
  const schedules = [...routineSchedules, ...calendarSchedules].sort((a, b) => 
    a.time.localeCompare(b.time)
  );
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isAddItemDrawerOpen, setIsAddItemDrawerOpen] = useState(false);
  const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);
  const [groupManagementMode, setGroupManagementMode] = useState<"create" | "settings">("create");
  const [pushNotification, setPushNotification] = useState<any>(null);
  const [nearbyItemId, setNearbyItemId] = useState<string | undefined>(undefined);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check for invite link in URL (simulated)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("invite")) {
      setShowInviteLanding(true);
    }
  }, []);

  // Simulate push notification after login
  useEffect(() => {
    if (isLoggedIn && !showInviteLanding) {
      const timer = setTimeout(() => {
        setPushNotification({
          itemName: "세탁세제",
          storeName: "강남역 다이소",
          distance: "50m",
          status: "enter",
        });
        setNearbyItemId("1");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, showInviteLanding]);

const handleLogin = (nickname: string) => {
  setUserProfile(prev => ({
    ...prev,
    name: nickname,
    nickname: nickname,
  }));
  setIsLoggedIn(true);
  setShowInviteLanding(false);
  };

  const handleAcceptInvite = (nickname?: string) => {
    setIsLoggedIn(true);
    setShowInviteLanding(false);
    setSelectedGroup(groups.find((g: any) => g.id === "home") || groups[0]);
    // nickname would be saved to user profile for this group in a real app
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("home");
  };

  const handleAddItem = (newItem: any) => {
    const itemWithMeta = {
      ...newItem,
      addedBy: { id: "me", name: "나", color: "#6366F1" },
      groupId: activeTab === "group" ? selectedGroup?.id : "personal",
    };
    setItems((prev: any) => [itemWithMeta, ...prev]);
  };

  const handleCompleteItem = (item: any) => {
    setItems((prev: any) =>
      prev.map((i: any) => (i.id === item.id ? { ...i, completed: !i.completed } : i))
    );
  };

  const handleUpdateItem = (updatedItem: any) => {
    setItems((prev: any) =>
      prev.map((i: any) => (i.id === updatedItem.id ? updatedItem : i))
    );
  };

  const handleNavigate = (item: any, mapService?: string) => {
    setPushNotification(null);
    // Set the item as nearby so it gets selected in the map
    setNearbyItemId(item.id);
    // Switch to map tab
    setActiveTab("map");
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev: any) => prev.filter((n: any) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleCreateGroup = (group: any) => {
    const newGroup = {
      ...group,
      memberCount: 1,
    };
    setGroups((prev: any) => [...prev, newGroup]);
    setSelectedGroup(newGroup);
  };

  const handleSaveRoutines = (newRoutines: any[]) => {
    setRoutines(newRoutines);
  };

  const handleOpenInvite = (group: any) => {
    setSelectedGroup(group);
    setGroupManagementMode("create");
    setIsGroupManagementOpen(true);
  };

  const handleOpenGroupSettings = () => {
    setGroupManagementMode("settings");
    setIsGroupManagementOpen(true);
  };

  const handleOpenGroupCreate = () => {
    setGroupManagementMode("create");
    setIsGroupManagementOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev: any) => prev.filter((g: any) => g.id !== groupId));
    setSelectedGroup(groups.find((g: any) => g.id === "personal") || groups[0]);
  };

  const handleLeaveGroup = (groupId: string) => {
    // In a real app, this would remove the user from the group
    setSelectedGroup(groups.find((g: any) => g.id === "personal") || groups[0]);
  };

  const handleUpdateNickname = (nickname: string) => {
    // In a real app, this would update the user's nickname in the group
  };

  const stats = {
    total: items.length,
    completed: items.filter((i: any) => i.completed).length,
    locations: [...new Set(items.map((i: any) => i.location))].length,
  };

  // Show invite landing page
  if (showInviteLanding && !isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <InviteLandingScreen
          groupName="우리 집"
          inviterName="민지"
          onAcceptInvite={handleAcceptInvite}
        />
      </div>
    );
  }

  // Show login screen
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  // Show dashboard if open
  if (showDashboard) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <DashboardScreen
          onBack={() => setShowDashboard(false)}
          stats={stats}
          items={items}
        />
      </div>
    );
  }

  return (
  <div className="max-w-md mx-auto bg-background min-h-screen relative">
  {/* Push Notification */}
  <PushNotification
        notification={pushNotification}
        onClose={() => setPushNotification(null)}
        onNavigate={() => {
          if (pushNotification) {
            handleNavigate({ location: pushNotification.storeName });
          }
        }}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Add Item Drawer */}
      <AddItemDrawer
        isOpen={isAddItemDrawerOpen}
        onClose={() => setIsAddItemDrawerOpen(false)}
        onAdd={handleAddItem}
        categories={categories}
        currentGroup={activeTab === "group" ? selectedGroup : { id: "personal", name: "개인" }}
      />

      {/* Group Management */}
      <GroupManagement
        isOpen={isGroupManagementOpen}
        onClose={() => setIsGroupManagementOpen(false)}
        onCreateGroup={handleCreateGroup}
        mode={groupManagementMode}
        currentGroup={selectedGroup}
        isAdmin={selectedGroup?.id === "home" || selectedGroup?.id === "club"}
        onDeleteGroup={handleDeleteGroup}
        onLeaveGroup={handleLeaveGroup}
        onUpdateNickname={handleUpdateNickname}
      />

      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              items={items}
              schedules={schedules}
              onCompleteItem={handleCompleteItem}
              onNavigate={handleNavigate}
              onUpdateItem={handleUpdateItem}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              notificationCount={notifications.length}
            />
          </motion.div>
        )}

        {activeTab === "map" && (
          <motion.div
            key="map"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <MapScreen 
              items={items} 
              nearbyItemId={nearbyItemId}
              onNavigate={handleNavigate}
              preferredMapService="naver"
              onUpdateItem={handleUpdateItem}
            />
          </motion.div>
        )}

        {activeTab === "group" && (
          <motion.div
            key="group"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <GroupScreen
              groups={groups}
              selectedGroup={selectedGroup}
              items={items}
              onSelectGroup={setSelectedGroup}
              onOpenGroupManagement={handleOpenGroupSettings}
              onOpenGroupCreate={handleOpenGroupCreate}
              onOpenInvite={handleOpenInvite}
              onCompleteItem={handleCompleteItem}
              onNavigate={handleNavigate}
              onUpdateItem={handleUpdateItem}
            />
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
<ProfileScreen
  onLogout={handleLogout}
  stats={stats}
  routines={routines}
  onSaveRoutines={handleSaveRoutines}
  onOpenDashboard={() => setShowDashboard(true)}
  userProfile={userProfile}
  onUpdateProfile={(profile: any) => setUserProfile(profile)}
  />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => setIsAddItemDrawerOpen(true)}
      />
    </div>
  );
}
