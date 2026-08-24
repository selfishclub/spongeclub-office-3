"use client";

import { useEffect, useState } from "react";
import {
  CURRENT_WEEK,
  DEADLINE_LABEL,
  DEADLINE_ISO,
  MEMBERS,
  MISSIONS_URL,
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
            <a
              href={member.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline"
            >
              제출물 보기 →
            </a>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-100 text-sm font-bold hover:bg-gray-200 transition"
        >
          닫기
        </button>
      </div>
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

      {/* 과제 현황판 연동 */}
      <a
        href={MISSIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full mb-6 px-4 py-3 rounded-xl border-2 border-[#1A1A1A] bg-[#E9ED12] font-extrabold text-sm hover:opacity-90 transition"
      >
        🎯 전체 과제 현황판 보기 →
      </a>

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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              감독관
            </p>
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">
              멤버
            </p>
            <div className="space-y-2">
              {regulars.map((m) => (
                <MemberCard key={m.nick} member={m} onClick={() => setSelectedMember(m)} />
              ))}
            </div>
          </div>
        )}

        {regulars.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            아직 이번 주 유닛 멤버가 등록되지 않았어요.<br />
            감독관이 멤버를 추가하면 여기에 나타납니다.
          </p>
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
