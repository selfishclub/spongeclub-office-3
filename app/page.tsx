"use client";

import { useEffect, useState } from "react";
import {
  CURRENT_WEEK,
  DEADLINE_LABEL,
  DEADLINE_ISO,
  MEMBERS,
  WEEKS,
  type Member,
} from "./data";

// ─── 카운트다운 타이머 ───
function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    function calc() {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) { setRemaining("마감!"); return; }
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

// ─── 상태별 표시 ───
const STATUS_MAP = {
  waiting: { emoji: "💤", label: "대기", color: "text-gray-400" },
  submitted: { emoji: "✅", label: "제출", color: "text-green-600" },
  watching: { emoji: "👀", label: "지켜보는 중", color: "text-amber-500" },
} as const;

// ─── 멤버 카드 ───
function MemberCard({ member, onClick }: { member: Member; onClick: () => void }) {
  const st = STATUS_MAP[member.status];
  const isAdmin = member.role === "감독관";

  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition text-left",
        member.status === "submitted"
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{isAdmin ? "👑" : st.emoji}</span>
        <div>
          <span className="font-bold text-sm">
            {member.nick}
            <span className="text-gray-400 font-normal ml-1">({member.name})</span>
          </span>
          {isAdmin && (
            <span className="ml-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              감독관
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold ${st.color}`}>
          {isAdmin ? "👑 감독관" : `${st.emoji} ${st.label}`}
        </span>
        <span className="text-[10px] text-gray-300">클릭 → 제출·피드백</span>
      </div>
    </button>
  );
}

// ─── 멤버 상세 모달 ───
function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{member.role === "감독관" ? "👑" : "🧽"}</span>
          <div>
            <h3 className="font-extrabold text-lg">{member.nick}</h3>
            <p className="text-sm text-gray-500">{member.name}</p>
          </div>
        </div>
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <span>상태:</span>
            <span className="font-bold">
              {STATUS_MAP[member.status].emoji} {STATUS_MAP[member.status].label}
            </span>
          </div>
          {member.submissionUrl && (
            <a href={member.submissionUrl} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-500 hover:underline">
              제출물 보기 →
            </a>
          )}
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-gray-100 text-sm font-bold hover:bg-gray-200 transition">
          닫기
        </button>
      </div>
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
    } catch { /* 무시 */ }
  }, []);

  function save(updated: BambooPost[]) {
    setPosts(updated);
    try { localStorage.setItem("bamboo-posts", JSON.stringify(updated)); } catch { /* 무시 */ }
  }

  function addPost() {
    const text = input.trim();
    if (!text) return;
    save([{ id: Date.now().toString(), text, replies: [], createdAt: new Date().toISOString() }, ...posts]);
    setInput("");
  }

  function addReply(postId: string) {
    const text = (replyInputs[postId] ?? "").trim();
    if (!text) return;
    save(posts.map((p) =>
      p.id === postId
        ? { ...p, replies: [...p.replies, { id: Date.now().toString(), text, createdAt: new Date().toISOString() }] }
        : p,
    ));
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
    <div className="relative rounded-2xl overflow-hidden mb-6">
      {/* 칠판 배경 */}
      <div className="bg-[#2D5016] p-5 pb-6">
        {/* 칠판 프레임 */}
        <div className="border-4 border-[#8B6914] rounded-xl p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]">
          {/* 헤더 — 분필 느낌 */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-extrabold text-[#F5F0E0]" style={{ textShadow: "0 0 6px rgba(245,240,224,0.3)" }}>
              🎋 까스활명수 대나무숲
            </h2>
            <p className="text-sm text-[#C8E6A0] mt-1 font-bold">무엇이든 물어보세요</p>
            <p className="text-xs text-[#A0C878] mt-2 leading-relaxed">
              &ldquo;임금님 귀는 당나귀 귀&rdquo;처럼,<br />
              여기선 속에 있는 말을 그냥 외치면 돼요
            </p>
          </div>

          {/* 안내 배지 */}
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">🙈 아무도 안 놀라요</span>
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">🔁 두 번 물어봐도 돼요</span>
            <span className="text-[11px] text-[#C8E6A0] bg-[#1A3A08] px-2.5 py-1 rounded-full">🫂 지나가던 사람이 답해요</span>
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

          {/* 글 목록 (칠판 위에) */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {posts.length === 0 && (
              <p className="text-sm text-[#6B8F50] text-center py-6">
                아직 아무도 외치지 않았어요.<br />
                첫 번째 대나무가 되어주세요 🎋
              </p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="bg-[#1A3A08]/60 rounded-lg border border-[#3D6B1E] p-3">
                <p className="text-sm text-[#E8E0D0]">{post.text}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-[#6B8F50]">{timeAgo(post.createdAt)}</span>
                  <button
                    onClick={() => setOpenReply(openReply === post.id ? null : post.id)}
                    className="text-[10px] text-[#8BC34A] font-bold hover:underline"
                  >
                    💬 답글 {post.replies.length > 0 && `(${post.replies.length})`}
                  </button>
                </div>
                {post.replies.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-[#3D6B1E] space-y-1.5">
                    {post.replies.map((r) => (
                      <div key={r.id} className="text-xs text-[#A0C878]">
                        <span>{r.text}</span>
                        <span className="text-[#6B8F50] ml-2">{timeAgo(r.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {openReply === post.id && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replyInputs[post.id] ?? ""}
                      onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addReply(post.id)}
                      placeholder="답글 달기..."
                      className="flex-1 px-3 py-1.5 rounded-md bg-[#1A3A08] border border-[#3D6B1E] text-xs text-[#F5F0E0] placeholder:text-[#6B8F50] focus:outline-none focus:border-[#8BC34A]"
                    />
                    <button onClick={() => addReply(post.id)} className="shrink-0 px-3 py-1.5 rounded-md bg-[#3D6B1E] text-[#C8E6A0] text-xs font-bold hover:bg-[#4A7D24] transition">
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
      <div className="h-3 bg-gradient-to-b from-[#8B6914] to-[#6B5010] rounded-b-xl" />

      {/* 칠판 밑 캐릭터들 */}
      <div className="flex justify-center gap-1 -mt-1 text-2xl">
        <span title="막힌 곳을 어떻게 설명해야 할지 몰라도 괜찮아요">🧽</span>
        <span title="슬랙 #까스활명수 채널에 한 줄 던져도 됩니다">🐙</span>
        <span title="편한 쪽으로 오세요">⭐</span>
        <span title="지나가던 사람이 답을 주고 가요">🦀</span>
        <span title="아무도 안 놀라요">🐿️</span>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1">
        막힌 곳을 어떻게 설명해야 할지 몰라도 괜찮아요 · 슬랙 #까스활명수 채널에 한 줄 던져도 됩니다
      </p>
    </div>
  );
}

// ─── 메인 페이지 ───
export default function OfficePage() {
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_WEEK);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const weekData = WEEKS.find((w) => w.week === selectedWeek);
  const countdown = useCountdown(DEADLINE_ISO);

  const admins = MEMBERS.filter((m) => m.role === "감독관");
  const regulars = MEMBERS.filter((m) => m.role !== "감독관");
  const submitted = MEMBERS.filter((m) => m.status === "submitted").length;
  const total = MEMBERS.length;
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 w-full">
      {/* 헤더 */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-extrabold">🥤 까스활명수 오피스</h1>
        <p className="text-sm text-gray-500 mt-1">
          셀피쉬클럽 · 스폰지클럽 3기 — 실시간으로 서로의 작업 상태를 공유해요.
        </p>
      </header>

      {/* 마감 안내 + 카운트다운 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
        <p className="text-sm font-bold text-amber-800">
          📌 이번 주 제출 마감 — {DEADLINE_LABEL}
        </p>
        <p className="text-xs text-amber-600 mt-1.5 font-bold">
          ⏳ 마감까지 {countdown}
        </p>
      </div>

      {/* 🎋 대나무숲 (칠판 + 캐릭터) */}
      <BambooForest />

      {/* 주차 탭 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {WEEKS.map((w) => (
          <button
            key={w.week}
            onClick={() => setSelectedWeek(w.week)}
            className={[
              "shrink-0 px-4 py-2 rounded-full text-sm font-bold transition",
              w.week === selectedWeek
                ? "bg-[#1A1A1A] text-white"
                : w.week <= CURRENT_WEEK
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-300",
            ].join(" ")}
          >
            {w.week}회차
          </button>
        ))}
        <span className="shrink-0 text-xs text-gray-400 ml-auto">
          유닛 참여자 {total}명
        </span>
      </div>

      {/* 미션 내용 */}
      {weekData && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-extrabold text-lg mb-3">{selectedWeek}회차 미션</h2>
          <p className="text-sm text-gray-600 mb-4">{weekData.title}</p>
          {weekData.tasks.length > 0 ? (
            <ul className="space-y-3">
              {weekData.tasks.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-sm">{t.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">세션이 끝나면 과제가 올라옵니다.</p>
          )}
        </div>
      )}

      {/* 제출 현황 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg">제출 현황</h2>
          <div className="text-right">
            <span className="text-2xl font-extrabold">{submitted} / {total}</span>
            <span className="text-xs text-gray-400 ml-2">{pct}% 제출</span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-[#E9ED12] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* 감독관 */}
        {admins.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">감독관</p>
            <div className="space-y-2">
              {admins.map((m) => (
                <MemberCard key={m.nick} member={m} onClick={() => setSelectedMember(m)} />
              ))}
            </div>
          </div>
        )}

        {/* 멤버 */}
        {regulars.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">멤버</p>
            <div className="space-y-2">
              {regulars.map((m) => (
                <MemberCard key={m.nick} member={m} onClick={() => setSelectedMember(m)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="text-center text-xs text-gray-300 mt-8 pb-8">
        스폰지클럽 3기 · 까스활명수 유닛 오피스
      </footer>

      {/* 멤버 모달 */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </main>
  );
}
