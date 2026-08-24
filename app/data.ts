/**
 * 까스활명수 오피스 3기 — 데이터 설정
 *
 * 매주 유닛원이 달라지므로, 여기서만 수정하면 됩니다.
 */

export type MemberStatus = "waiting" | "submitted" | "watching";
export type MemberRole = "감독관" | "멤버";

export type Member = {
  nick: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
  submissionUrl?: string;
};

export type WeekMission = {
  week: number;
  title: string;
  tasks: { title: string; description: string }[];
};

// ─── 현재 주차 & 마감 ───
export const CURRENT_WEEK = 2;
export const DEADLINE_LABEL = "8월 30일(일) 오후 6시";
export const DEADLINE_ISO = "2026-08-30T09:00:00Z"; // UTC = KST 18:00

// ─── 과제 현황판 연동 ───
export const MISSIONS_URL = "https://spongeclub-community.vercel.app/missions";

// ─── 유닛 참여자 (매주 업데이트) ───
export const MEMBERS: Member[] = [
  // 감독관
  { nick: "다니", name: "송다은", role: "감독관", status: "watching" },

  // 유닛 멤버
  { nick: "헤이", name: "윤민홍", role: "멤버", status: "waiting" },
  { nick: "말디니", name: "박진형", role: "멤버", status: "waiting" },
  { nick: "레미", name: "최주희", role: "멤버", status: "waiting" },
  { nick: "브라운", name: "이정근", role: "멤버", status: "waiting" },
  { nick: "테리", name: "강태호", role: "멤버", status: "waiting" },
  { nick: "찌니", name: "신진영", role: "멤버", status: "waiting" },
  { nick: "써니", name: "박수연", role: "멤버", status: "waiting" },
  { nick: "웃는돌", name: "장경아", role: "멤버", status: "waiting" },
  { nick: "해운대유진", name: "김병학", role: "멤버", status: "waiting" },
  { nick: "카라", name: "최강훈", role: "멤버", status: "waiting" },
  { nick: "제프", name: "이재필", role: "멤버", status: "waiting" },
  { nick: "이카루스", name: "이창민", role: "멤버", status: "waiting" },
  { nick: "양세", name: "박세현", role: "멤버", status: "waiting" },
  { nick: "선샤인", name: "엄지혜", role: "멤버", status: "waiting" },
  { nick: "샘", name: "이승민", role: "멤버", status: "waiting" },
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
