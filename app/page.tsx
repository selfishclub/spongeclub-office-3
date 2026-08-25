"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CURRENT_WEEK,
  DEADLINE_LABEL,
  DEADLINE_ISO,
  MEMBERS,
  WEEKS,
  STATUS_CONFIG,
  HAIR_COLORS,
  SHIRT_COLORS,
  hashNick,
  type Member,
  type StatusType,
} from "./data";

// ─── 카운트다운 타이머 ───
function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    function calc() {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("마감!");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const parts: string[] = [];
      if (d > 0) parts.push(`${d}일`);
      parts.push(`${h}시간`);
      parts.push(`${m}분`);
      parts.push(`${s}초`);
      setRemaining(parts.join(" "));
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  return remaining;
}

// ─── localStorage 상태 관리 훅 ───
function useLocalStatuses() {
  const [statuses, setStatuses] = useState<
    Record<string, { statusType: StatusType; message?: string }>
  >({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("office3-statuses");
      if (saved) setStatuses(JSON.parse(saved));
    } catch {
      /* 무시 */
    }
  }, []);

  function updateStatus(
    nick: string,
    statusType: StatusType,
    message?: string
  ) {
    const updated = { ...statuses, [nick]: { statusType, message } };
    setStatuses(updated);
    try {
      localStorage.setItem("office3-statuses", JSON.stringify(updated));
    } catch {
      /* 무시 */
    }
  }

  return { statuses, updateStatus };
}

// ─── 픽셀아트 캐릭터 컴포넌트 (CSS로 구현) ───
function PixelCharacter({
  nick,
  isAdmin,
}: {
  nick: string;
  isAdmin: boolean;
}) {
  const hash = hashNick(nick);
  const hairColor = HAIR_COLORS[hash % HAIR_COLORS.length];
  const shirtColor = SHIRT_COLORS[hash % SHIRT_COLORS.length];
  const skinColor = "#F5D6B8";
  // 화면 색상 (해시 기반)
  const screenColors = ["#4FC3F7", "#81C784", "#FFB74D", "#BA68C8", "#4DB6AC"];
  const screenColor = screenColors[hash % screenColors.length];

  return (
    <div className="relative w-full flex justify-center">
      {/* 캐릭터 + 책상 컨테이너 */}
      <div className="relative" style={{ width: 72, height: 80 }}>
        {/* 머리카락 */}
        <div
          className="absolute rounded-t-md"
          style={{
            width: 24,
            height: 8,
            left: 24,
            top: 0,
            backgroundColor: hairColor,
          }}
        />
        {/* 얼굴 */}
        <div
          className="absolute rounded-b-sm"
          style={{
            width: 22,
            height: 14,
            left: 25,
            top: 7,
            backgroundColor: skinColor,
          }}
        />
        {/* 눈 (왼쪽) */}
        <div
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            left: 30,
            top: 12,
            backgroundColor: "#333",
          }}
        />
        {/* 눈 (오른쪽) */}
        <div
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            left: 39,
            top: 12,
            backgroundColor: "#333",
          }}
        />
        {/* 감독관 왕관 */}
        {isAdmin && (
          <div
            className="absolute text-center"
            style={{
              fontSize: 10,
              left: 23,
              top: -10,
              width: 26,
            }}
          >
            👑
          </div>
        )}
        {/* 몸통/셔츠 */}
        <div
          className="absolute rounded-sm"
          style={{
            width: 26,
            height: 16,
            left: 23,
            top: 21,
            backgroundColor: shirtColor,
          }}
        />
        {/* 왼쪽 팔 */}
        <div
          className="absolute rounded-sm"
          style={{
            width: 8,
            height: 12,
            left: 15,
            top: 23,
            backgroundColor: shirtColor,
          }}
        />
        {/* 왼쪽 손 */}
        <div
          className="absolute rounded-sm"
          style={{
            width: 6,
            height: 5,
            left: 16,
            top: 34,
            backgroundColor: skinColor,
          }}
        />
        {/* 오른쪽 팔 */}
        <div
          className="absolute rounded-sm"
          style={{
            width: 8,
            height: 12,
            left: 49,
            top: 23,
            backgroundColor: shirtColor,
          }}
        />
        {/* 오른쪽 손 */}
        <div
          className="absolute rounded-sm"
          style={{
            width: 6,
            height: 5,
            left: 50,
            top: 34,
            backgroundColor: skinColor,
          }}
        />
        {/* 책상 */}
        <div
          className="absolute"
          style={{
            width: 68,
            height: 10,
            left: 2,
            top: 40,
            backgroundColor: "#8B6914",
            borderRadius: 2,
          }}
        />
        {/* 책상 다리 (왼쪽) */}
        <div
          className="absolute"
          style={{
            width: 4,
            height: 14,
            left: 6,
            top: 50,
            backgroundColor: "#6B5010",
          }}
        />
        {/* 책상 다리 (오른쪽) */}
        <div
          className="absolute"
          style={{
            width: 4,
            height: 14,
            left: 62,
            top: 50,
            backgroundColor: "#6B5010",
          }}
        />
        {/* 노트북 (뚜껑) */}
        <div
          className="absolute"
          style={{
            width: 22,
            height: 16,
            left: 25,
            top: 24,
            backgroundColor: "#B0BEC5",
            borderRadius: "2px 2px 0 0",
            border: "1px solid #90A4AE",
          }}
        />
        {/* 노트북 화면 */}
        <div
          className="absolute"
          style={{
            width: 18,
            height: 11,
            left: 27,
            top: 26,
            backgroundColor: screenColor,
            borderRadius: 1,
          }}
        />
        {/* 노트북 바닥 */}
        <div
          className="absolute"
          style={{
            width: 24,
            height: 3,
            left: 24,
            top: 39,
            backgroundColor: "#90A4AE",
            borderRadius: "0 0 2px 2px",
          }}
        />
        {/* 커피 머그 */}
        <div
          className="absolute"
          style={{
            width: 6,
            height: 7,
            left: 54,
            top: 33,
            backgroundColor: "#FFFFFF",
            borderRadius: "0 0 1px 1px",
            border: "1px solid #DDD",
          }}
        />
        {/* 커피 내용물 */}
        <div
          className="absolute"
          style={{
            width: 4,
            height: 3,
            left: 55,
            top: 34,
            backgroundColor: "#795548",
            borderRadius: 0,
          }}
        />
        {/* 포스트잇 */}
        <div
          className="absolute"
          style={{
            width: 7,
            height: 7,
            left: 8,
            top: 33,
            backgroundColor: "#FFF176",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

// ─── 멤버 데스크 카드 ───
function MemberDeskCard({
  member,
  onClick,
}: {
  member: Member;
  onClick: () => void;
}) {
  const st = STATUS_CONFIG[member.statusType];
  const isAdmin = member.role === "감독관";
  const isSubmitted = member.statusType === "submitted";

  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center rounded-xl border-2 transition hover:shadow-lg p-3 relative"
      style={{
        backgroundColor: isSubmitted ? "#F0FFF0" : "#FFFEF5",
        borderColor: isSubmitted ? "#86EFAC" : "#E8E0D0",
      }}
    >
      {/* 상태 배지 (상단) */}
      <div
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${st.badgeColor} ${st.badgeText}`}
      >
        {st.emoji} {st.label}
      </div>

      {/* 말풍선 (상태 메시지가 있을 때) */}
      {member.message && (
        <div className="relative mt-2 mb-1 w-full">
          <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] text-gray-600 text-center relative shadow-sm">
            {member.message}
            {/* 말풍선 꼬리 */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45" />
          </div>
        </div>
      )}

      {/* 픽셀아트 캐릭터 */}
      <div className={member.message ? "mt-1" : "mt-4"}>
        <PixelCharacter nick={member.nick} isAdmin={isAdmin} />
      </div>

      {/* 이름 */}
      <div className="mt-1 text-center">
        <p className="font-extrabold text-sm leading-tight">{member.nick}</p>
        <p className="text-[10px] text-gray-400">{member.name}</p>
      </div>

      {/* 셸 지급 배지 (제출 완료인 경우) */}
      {isSubmitted && (
        <div className="mt-1 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 text-[9px] font-bold text-amber-700">
          🐚 셸 3개 지급 예정
        </div>
      )}
    </button>
  );
}

// ─── 감독관 미니 카드 ───
function AdminMiniCard({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      <span className="text-lg">👑</span>
      <div>
        <p className="font-bold text-sm">{member.nick}</p>
        <p className="text-[10px] text-gray-500">{member.name}</p>
      </div>
      <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
        감독관
      </span>
    </div>
  );
}

// ─── 칠판 미션 보드 ───
function ChalkboardMissionBoard({
  weekData,
  selectedWeek,
}: {
  weekData: { title: string; tasks: { title: string; description: string }[] } | undefined;
  selectedWeek: number;
}) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* 나무 프레임 */}
      <div className="bg-[#8B6914] p-2 rounded-xl shadow-lg">
        {/* 칠판 본체 */}
        <div
          className="rounded-lg p-5"
          style={{
            backgroundColor: "#2D5016",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* 칠판 제목 */}
          <h2
            className="text-center text-lg font-extrabold text-[#F5F0E0] mb-4"
            style={{ textShadow: "0 0 6px rgba(245,240,224,0.3)" }}
          >
            📋 {selectedWeek}회차 미션
          </h2>
          <p
            className="text-center text-sm text-[#C8E6A0] mb-4 font-bold"
            style={{ textShadow: "0 0 4px rgba(200,230,160,0.2)" }}
          >
            {weekData?.title || "미션 준비 중..."}
          </p>

          {/* 미션 항목 — 분필 텍스트 */}
          {weekData && weekData.tasks.length > 0 ? (
            <div className="space-y-3">
              {weekData.tasks.map((t, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start"
                >
                  {/* 번호 원 */}
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold"
                    style={{
                      backgroundColor: "rgba(245,240,224,0.15)",
                      color: "#E9ED12",
                      border: "1px solid rgba(233,237,18,0.3)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p
                      className="font-bold text-sm text-[#F5F0E0]"
                      style={{
                        textShadow: "0 0 4px rgba(245,240,224,0.2)",
                      }}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs text-[#A0C878] mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-sm text-center text-[#6B8F50]"
              style={{ textShadow: "0 0 4px rgba(107,143,80,0.2)" }}
            >
              세션이 끝나면 과제가 올라옵니다.
            </p>
          )}
        </div>
      </div>
      {/* 칠판 받침대 */}
      <div className="h-2 bg-gradient-to-b from-[#8B6914] to-[#6B5010] rounded-b-xl mx-2" />
    </div>
  );
}

// ─── 까스활명수 병 프로그레스 ───
function BottleProgress({
  submitted,
  total,
}: {
  submitted: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const fillHeight = total > 0 ? (submitted / total) * 100 : 0;

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* 나무 프레임 */}
      <div className="bg-[#8B6914] p-2 rounded-xl shadow-lg">
        <div
          className="rounded-lg p-5 flex flex-col items-center"
          style={{
            backgroundColor: "#2D5016",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          <h3
            className="text-sm font-extrabold text-[#F5F0E0] mb-3"
            style={{ textShadow: "0 0 6px rgba(245,240,224,0.3)" }}
          >
            이번 주 제출 현황
          </h3>

          {/* 병 모양 */}
          <div className="relative flex flex-col items-center mb-3">
            {/* 병 뚜껑 */}
            <div
              className="rounded-t-md"
              style={{
                width: 20,
                height: 8,
                backgroundColor: "#C0C0C0",
                border: "1px solid #A0A0A0",
              }}
            />
            {/* 병 목 */}
            <div
              className="relative"
              style={{
                width: 24,
                height: 16,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderLeft: "2px solid rgba(255,255,255,0.25)",
                borderRight: "2px solid rgba(255,255,255,0.25)",
              }}
            />
            {/* 병 어깨 (넓어지는 부분) */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "12px solid rgba(255,255,255,0.15)",
              }}
            />
            {/* 병 몸통 */}
            <div
              className="relative overflow-hidden rounded-b-lg"
              style={{
                width: 56,
                height: 100,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.25)",
                borderTop: "none",
              }}
            >
              {/* 액체 채움 */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{
                  height: `${fillHeight}%`,
                  background:
                    "linear-gradient(to top, #E9ED12, #F5F17A)",
                  borderRadius: "0 0 6px 6px",
                }}
              />
              {/* 까스활명수 라벨 */}
              <div
                className="absolute inset-x-1 top-1/2 -translate-y-1/2 text-center py-1 rounded-sm"
                style={{
                  backgroundColor: "rgba(139,105,20,0.8)",
                  border: "1px solid #C0A030",
                }}
              >
                <p
                  className="text-[7px] font-extrabold text-[#F5F0E0] leading-tight"
                >
                  까스
                </p>
                <p
                  className="text-[6px] font-bold text-[#E9ED12] leading-tight"
                >
                  활명수
                </p>
              </div>
            </div>
          </div>

          {/* 숫자 표시 */}
          <div className="text-center">
            <p
              className="text-3xl font-extrabold text-[#E9ED12]"
              style={{ textShadow: "0 0 8px rgba(233,237,18,0.4)" }}
            >
              {submitted} / {total}
            </p>
            <p className="text-sm text-[#C8E6A0] font-bold mt-1">
              {pct}% 제출
            </p>
          </div>
        </div>
      </div>
      <div className="h-2 bg-gradient-to-b from-[#8B6914] to-[#6B5010] rounded-b-xl mx-2" />
    </div>
  );
}

// ─── 대나무숲 게시판 ───
type BambooPost = {
  id: string;
  text: string;
  replies: { id: string; text: string; createdAt: string }[];
  createdAt: string;
};

function BambooForest() {
  const [posts, setPosts] = useState<BambooPost[]>([]);
  const [input, setInput] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [openReply, setOpenReply] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bamboo-posts");
      if (saved) setPosts(JSON.parse(saved));
    } catch {
      /* 무시 */
    }
  }, []);

  function save(updated: BambooPost[]) {
    setPosts(updated);
    try {
      localStorage.setItem("bamboo-posts", JSON.stringify(updated));
    } catch {
      /* 무시 */
    }
  }

  function addPost() {
    const text = input.trim();
    if (!text) return;
    save([
      {
        id: Date.now().toString(),
        text,
        replies: [],
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setInput("");
  }

  function addReply(postId: string) {
    const text = (replyInputs[postId] ?? "").trim();
    if (!text) return;
    save(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                {
                  id: Date.now().toString(),
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );
    setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
    setOpenReply(null);
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "방금";
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    return `${Math.floor(h / 24)}일 전`;
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* 나무 프레임 */}
      <div className="bg-[#8B6914] p-2 rounded-xl shadow-lg">
        {/* 칠판 본체 */}
        <div
          className="rounded-lg p-5"
          style={{
            backgroundColor: "#2D5016",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* 헤더 — 분필 느낌 */}
          <div className="text-center mb-4">
            <h2
              className="text-xl font-extrabold text-[#F5F0E0]"
              style={{
                textShadow: "0 0 6px rgba(245,240,224,0.3)",
              }}
            >
              🎋 까스활명수 대나무숲
            </h2>
            <p className="text-sm text-[#C8E6A0] mt-1 font-bold">
              무엇이든 물어보세요
            </p>
            <p className="text-xs text-[#A0C878] mt-2 leading-relaxed">
              &ldquo;임금님 귀는 당나귀 귀&rdquo;처럼,
              <br />
              여기선 속에 있는 말을 그냥 외치면 돼요
            </p>
          </div>

          {/* 안내 배지 */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">
              🙈 아무도 안 놀라요
            </span>
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">
              🔁 두 번 물어봐도 돼요
            </span>
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">
              🫂 지나가던 사람이 답해요
            </span>
          </div>

          {/* 입력 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPost()}
              placeholder="막힌 곳, 궁금한 것, 하고 싶은 말..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#1A3A08] border border-[#3D6B1E] text-sm text-[#F5F0E0] placeholder:text-[#6B8F50] focus:outline-none focus:border-[#8BC34A]"
            />
            <button
              onClick={addPost}
              className="shrink-0 px-4 py-2.5 rounded-lg bg-[#8BC34A] text-[#1A3A08] text-sm font-extrabold hover:bg-[#9CCC65] transition"
            >
              외치기 🎋
            </button>
          </div>

          {/* 글 목록 */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {posts.length === 0 && (
              <p className="text-sm text-[#6B8F50] text-center py-6">
                아직 아무도 외치지 않았어요.
                <br />
                첫 번째 대나무가 되어주세요 🎋
              </p>
            )}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[#1A3A08]/60 rounded-lg border border-[#3D6B1E] p-3"
              >
                <p className="text-sm text-[#E8E0D0]">{post.text}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-[#6B8F50]">
                    {timeAgo(post.createdAt)}
                  </span>
                  <button
                    onClick={() =>
                      setOpenReply(openReply === post.id ? null : post.id)
                    }
                    className="text-[10px] text-[#8BC34A] font-bold hover:underline"
                  >
                    💬 답글{" "}
                    {post.replies.length > 0 && `(${post.replies.length})`}
                  </button>
                </div>
                {post.replies.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-[#3D6B1E] space-y-1.5">
                    {post.replies.map((r) => (
                      <div key={r.id} className="text-xs text-[#A0C878]">
                        <span>{r.text}</span>
                        <span className="text-[#6B8F50] ml-2">
                          {timeAgo(r.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {openReply === post.id && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replyInputs[post.id] ?? ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && addReply(post.id)
                      }
                      placeholder="답글 달기..."
                      className="flex-1 px-3 py-1.5 rounded-md bg-[#1A3A08] border border-[#3D6B1E] text-xs text-[#F5F0E0] placeholder:text-[#6B8F50] focus:outline-none focus:border-[#8BC34A]"
                    />
                    <button
                      onClick={() => addReply(post.id)}
                      className="shrink-0 px-3 py-1.5 rounded-md bg-[#3D6B1E] text-[#C8E6A0] text-xs font-bold hover:bg-[#4A7D24] transition"
                    >
                      답글
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 칠판 받침대 */}
      <div className="h-2 bg-gradient-to-b from-[#8B6914] to-[#6B5010] rounded-b-xl mx-2" />
      {/* 칠판 밑 캐릭터들 */}
      <div className="flex justify-center gap-1 mt-2 text-2xl">
        <span title="막힌 곳을 어떻게 설명해야 할지 몰라도 괜찮아요">🧽</span>
        <span title="슬랙 #까스활명수 채널에 한 줄 던져도 됩니다">🐙</span>
        <span title="편한 쪽으로 오세요">⭐</span>
        <span title="지나가던 사람이 답을 주고 가요">🦀</span>
        <span title="아무도 안 놀라요">🐿️</span>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1">
        막힌 곳을 어떻게 설명해야 할지 몰라도 괜찮아요 · 슬랙 #까스활명수 채널에 한 줄
        던져도 됩니다
      </p>
    </div>
  );
}

// ─── 상태 변경 모달 ───
function StatusModal({
  member,
  onClose,
  onUpdate,
}: {
  member: Member;
  onClose: () => void;
  onUpdate: (statusType: StatusType, message?: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(
    member.statusType
  );
  const [msg, setMsg] = useState(member.message || "");

  const statusOptions: StatusType[] = [
    "idle",
    "start",
    "doing",
    "working",
    "half",
    "almost",
    "feedback",
    "submitted",
    "resting",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <PixelCharacter nick={member.nick} isAdmin={member.role === "감독관"} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg">{member.nick}</h3>
            <p className="text-sm text-gray-500">{member.name}</p>
          </div>
        </div>

        {/* 상태 선택 그리드 */}
        <p className="text-xs font-bold text-gray-500 mb-2">상태 변경</p>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {statusOptions.map((st) => {
            const config = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border-2 transition ${
                  selectedStatus === st
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-300"
                }`}
              >
                {config.emoji} {config.label}
              </button>
            );
          })}
        </div>

        {/* 상태 메시지 */}
        <p className="text-xs font-bold text-gray-500 mb-2">
          상태 메시지 (말풍선)
        </p>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="오늘도 화이팅! 💪"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400 mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-bold hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            onClick={() => {
              onUpdate(selectedStatus, msg.trim() || undefined);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ───
export default function OfficePage() {
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_WEEK);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { statuses, updateStatus } = useLocalStatuses();
  const countdown = useCountdown(DEADLINE_ISO);

  // localStorage 상태를 멤버 데이터에 병합
  const membersWithStatus = useMemo(
    () =>
      MEMBERS.map((m) => {
        const saved = statuses[m.nick];
        if (saved) {
          return { ...m, statusType: saved.statusType, message: saved.message };
        }
        return m;
      }),
    [statuses]
  );

  const weekData = WEEKS.find((w) => w.week === selectedWeek);

  const admins = membersWithStatus.filter((m) => m.role === "감독관");
  const regulars = membersWithStatus.filter((m) => m.role !== "감독관");
  const submitted = membersWithStatus.filter(
    (m) => m.statusType === "submitted"
  ).length;
  const total = membersWithStatus.length;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      {/* ─── 헤더 ─── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: "#FFFEF5",
          borderColor: "#E8E0D0",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold">🏢 오피스 보드</h1>
            {/* 주차 드롭다운 */}
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="text-sm font-bold bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {WEEKS.map((w) => (
                <option key={w.week} value={w.week}>
                  {w.week}회차
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">
              유닛 참여자 <strong>{total}명</strong>
            </span>
            <span className="flex items-center gap-1 text-green-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              실시간
            </span>
          </div>
        </div>

        {/* 마감 타이머 바 */}
        <div className="bg-amber-50 border-t border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-800">
              📌 제출 마감 — {DEADLINE_LABEL}
            </span>
            <span className="font-bold text-amber-600">
              ⏳ {countdown}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ─── 감독관 카드 ─── */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {admins.map((m) => (
              <AdminMiniCard key={m.nick} member={m} />
            ))}
          </div>
        </div>

        {/* ─── 칠판 미션 보드 + 까스활명수 병 ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 칠판 미션 보드 (2/3 너비) */}
          <div className="md:col-span-2">
            <ChalkboardMissionBoard
              weekData={weekData}
              selectedWeek={selectedWeek}
            />
          </div>

          {/* 까스활명수 병 프로그레스 (1/3 너비) */}
          <div>
            <BottleProgress submitted={submitted} total={total} />
          </div>
        </div>

        {/* ─── 픽셀아트 캐릭터 데스크 카드 그리드 ─── */}
        <div className="mb-8">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            🧑‍💻 유닛 멤버 현황
            <span className="text-xs font-bold text-gray-400">
              카드를 클릭하면 상태를 변경할 수 있어요
            </span>
          </h2>

          {/* 반응형 그리드: 6열 → 3열 → 2열 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {regulars.map((m) => (
              <MemberDeskCard
                key={m.nick}
                member={m}
                onClick={() => setSelectedMember(m)}
              />
            ))}
          </div>
        </div>

        {/* ─── 대나무숲 ─── */}
        <div className="mb-8">
          <BambooForest />
        </div>
      </div>

      {/* ─── 푸터 ─── */}
      <footer className="text-center text-xs text-gray-400 py-6 border-t border-[#E8E0D0]">
        스폰지클럽 3기 · 까스활명수 유닛 오피스
      </footer>

      {/* ─── 상태 변경 모달 ─── */}
      {selectedMember && (
        <StatusModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={(statusType, message) => {
            updateStatus(selectedMember.nick, statusType, message);
            setSelectedMember(null);
          }}
        />
      )}
    </main>
  );
}
