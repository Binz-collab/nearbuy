// src/types/index.ts
// Prisma가 데이터베이스 스키마를 바탕으로 자동 생성해준 훌륭한 타입들을 불러옵니다.
// 이렇게 하면 DB 스키마가 바뀔 때 프론트엔드 타입도 자동으로 업데이트되는 마법이 일어납니다!
import type { Group, Item, Notification, Routine, Schedule, User, Invitation, ActivityLog } from "@prisma/client";

// ----------------------------------------------------------------------------
// 1. Prisma 모델 그대로 사용 (가장 이상적)
// ----------------------------------------------------------------------------
// Prisma가 만들어준 타입을 그대로 export 해서 다른 컴포넌트들이 쓸 수 있게 해줍니다.
export type { User, Group, Item, Schedule, Routine, Notification, Invitation, ActivityLog };

// ----------------------------------------------------------------------------
// 2. 프론트엔드 전용 확장 타입 (UI 렌더링용)
// ----------------------------------------------------------------------------
// DB에는 없지만 화면을 그릴 때 필요한 추가 정보들을 정의합니다.

// 예시 1: 그룹 정보를 보여줄 때, 그 그룹에 속한 멤버 목록도 같이 필요할 때
export interface GroupWithMembers extends Group {
  memberCount: number; // DB에는 없지만 UI에서 필요한 계산된 값
  members?: User[]; // 관계를 통해 불러온 멤버들
}

// 예시 2: 아이템을 보여줄 때, 누가 추가했는지 이름이 필요할 때
export interface ItemWithDetails extends Item {
  addedBy: Pick<User, "id" | "nickname">;
  purchasingBy?: Pick<User, "id" | "nickname"> | null;
}

// ----------------------------------------------------------------------------
// 3. UI/상태 관리를 위한 유틸리티 타입
// ----------------------------------------------------------------------------
export type TabType = "home" | "map" | "group" | "profile";

export interface Category {
  id: string;
  label: string;
}
