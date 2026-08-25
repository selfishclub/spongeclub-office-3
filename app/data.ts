/**
 * 까스활명수 오피스 3기 — 데이터 설정
 *
 * 매주 유닛원이 달라지므로, 여기서만 수정하면 됩니다.
 */

// 상태 타입: Supabase statuses 테이블과 동일
export type StatusType =
  | "working"
  | "start"
  | "doing"
  | "half"
  | "almost"
  | "idle"
  | "feedback"
  | "resting"
  | "submitted";

export type MemberRole = "감독관" | "멤버";

export type Member = {
  nick: string;
  name: string;
  role: MemberRole;
  statusType: StatusType;
  message?: string; // 상태 메시지 (말풍선)
  submissionUrl?: string;
};

export type WeekMission = {
  week: number;
  title: string;
  tasks: { title: string; description: string }[];
};

// ─── 상태 표시 매핑 ───
export const STATUS_CONFIG: Record<
  StatusType,
  { emoji: string; label: string; badgeColor: string; badgeText: string }
> = {
  working: {
    emoji: "🔥",
    label: "열일 중",
    badgeColor: "bg-orange-500",
    badgeText: "text-white",
  },
  start: {
    emoji: "🚀",
    label: "오늘부터 시작!",
    badgeColor: "bg-blue-500",
    badgeText: "text-white",
  },
  doing: {
    emoji: "📝",
    label: "과제 진행 중",
    badgeColor: "bg-yellow-400",
    badgeText: "text-yellow-900",
  },
  half: {
    emoji: "🎆",
    label: "50% 이상 완성!",
    badgeColor: "bg-purple-500",
    badgeText: "text-white",
  },
  almost: {
    emoji: "🐱",
    label: "거의 다 했어요!",
    badgeColor: "bg-pink-500",
    badgeText: "text-white",
  },
  idle: {
    emoji: "💤",
    label: "대기",
    badgeColor: "bg-gray-400",
    badgeText: "text-white",
  },
  feedback: {
    emoji: "🙌",
    label: "피드백 환영",
    badgeColor: "bg-teal-500",
    badgeText: "text-white",
  },
  resting: {
    emoji: "☕",
    label: "쉬는 중",
    badgeColor: "bg-amber-600",
    badgeText: "text-white",
  },
  submitted: {
    emoji: "✅",
    label: "제출 완료",
    badgeColor: "bg-green-500",
    badgeText: "text-white",
  },
};

// ─── 현재 주차 & 마감 ───
export const CURRENT_WEEK = 2;
export const DEADLINE_LABEL = "8월 30일(일) 오후 6시";
export const DEADLINE_ISO = "2026-08-30T09:00:00Z"; // UTC = KST 18:00

// ─── 유닛 참여자 (매주 업데이트) ───
export const MEMBERS: Member[] = [
  // 감독관
  { nick: "다니", name: "송다은", role: "감독관", statusType: "working", message: "여러분 화이팅! 💪" },

  // 유닛 멤버
  { nick: "헤이", name: "윤민홍", role: "멤버", statusType: "idle" },
  { nick: "말디니", name: "박진형", role: "멤버", statusType: "idle" },
  { nick: "레미", name: "최주희", role: "멤버", statusType: "idle" },
  { nick: "브라운", name: "이정근", role: "멤버", statusType: "idle" },
  { nick: "테리", name: "강태호", role: "멤버", statusType: "idle" },
  { nick: "찌니", name: "신진영", role: "멤버", statusType: "idle" },
  { nick: "써니", name: "박수연", role: "멤버", statusType: "idle" },
  { nick: "웃는돌", name: "장경아", role: "멤버", statusType: "idle" },
  { nick: "해운대유진", name: "김병학", role: "멤버", statusType: "idle" },
  { nick: "카라", name: "최강훈", role: "멤버", statusType: "idle" },
  { nick: "제프", name: "이재필", role: "멤버", statusType: "idle" },
  { nick: "이카루스", name: "이창민", role: "멤버", statusType: "idle" },
  { nick: "양세", name: "박세현", role: "멤버", statusType: "idle" },
  { nick: "선샤인", name: "엄지혜", role: "멤버", statusType: "idle" },
  { nick: "샘", name: "이승민", role: "멤버", statusType: "idle" },
];

// ─── 주차별 미션 ───
export const WEEKS: WeekMission[] = [
  {
    week: 1,
    title: "셋업데이 · Claude Code & GTM 코어",
    tasks: [
      { title: "자기소개 카드 작성", description: "자기소개.md를 채워서 제출" },
      { title: "GTM 코어 한 장", description: "GTM 코어 문서를 .md 파일로 업로드" },
      { title: "이기적 타이머 자랑하기", description: "만든 타이머를 스크린샷과 함께 공유" },
    ],
  },
  {
    week: 2,
    title: "1차 전환 프로모션 기획 & 구현",
    tasks: [
      { title: "01~08: 프로모션 기획", description: "GTM 코어 기반 1차 전환 프로모션 기획 (8가지 항목)" },
      { title: "09~10: 구현 & 배포", description: "PRD 설계 → Vercel 배포 → 배포 주소 제출" },
      { title: "11~12: 점검 & SNS", description: "GTM 코어 연결 점검 + 만든 과정 SNS에 올리기" },
    ],
  },
  {
    week: 3,
    title: "3회차 미션",
    tasks: [],
  },
  {
    week: 4,
    title: "4회차 미션 · 오프라인",
    tasks: [],
  },
  {
    week: 5,
    title: "5회차 미션",
    tasks: [],
  },
  {
    week: 6,
    title: "6회차 미션",
    tasks: [],
  },
];

// ─── 픽셀아트 캐릭터 색상 팔레트 ───
// 닉네임 해시로 결정적으로 색상 선택
export const HAIR_COLORS = [
  "#3D2B1F", // 다크 브라운
  "#1A1A2E", // 블랙
  "#8B4513", // 새들 브라운
  "#D4A574", // 블론드
  "#C0392B", // 레드
  "#2C3E50", // 다크 네이비
  "#6B3FA0", // 퍼플
  "#E67E22", // 오렌지 브라운
];

export const SHIRT_COLORS = [
  "#3498DB", // 블루
  "#9B59B6", // 퍼플
  "#E74C3C", // 레드
  "#2ECC71", // 그린
  "#F39C12", // 옐로우
  "#1ABC9C", // 틸
  "#E91E63", // 핑크
  "#FF5722", // 딥 오렌지
  "#607D8B", // 블루 그레이
  "#8BC34A", // 라이트 그린
];

// 닉네임으로 결정적 해시 생성
export function hashNick(nick: string): number {
  let hash = 0;
  for (let i = 0; i < nick.length; i++) {
    const char = nick.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
