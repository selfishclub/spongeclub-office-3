import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🥤 까스활명수 오피스 — 스폰지클럽 3기",
  description: "셀피쉬클럽 · 스폰지클럽 3기 — 실시간으로 서로의 작업 상태를 공유해요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#FAFAF8] text-[#1A1A1A]"
        style={{ fontFamily: "'Pretendard Variable', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
