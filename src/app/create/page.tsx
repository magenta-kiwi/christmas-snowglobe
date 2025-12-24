// app/create/page.tsx
"use client";
import { useEffect, useState } from "react";
import { registerUser } from "../actions";
import MusicPlayer from "../components/musicplayer";
import Snowglobe from "../components/snowglobe";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, setIsPending] = useState(false);
  const generateKey = () => {
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      return window.crypto.randomUUID();
    }
    // 아주 만약의 경우를 대비한 대체 로직 (혹은 그냥 랜덤 문자열)
    return Math.random().toString(36).substring(2, 15);
  };

  // 사용 예시
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    setSecretKey(generateKey());
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("닉네임을 입력해 주세요!");
      return;
    }

    setIsPending(true);

    // 1. 슬러그 생성 로직
    const rawEncodedName = btoa(encodeURIComponent(name.trim()));
    const encodedName = rawEncodedName.replace(/=/g, "");
    const randomSuffix = Math.random().toString(36).slice(2, 5);
    const newSlug = `${encodedName}-${randomSuffix}`;

    // 2. registerUser API 호출
    const result = await registerUser(name.trim(), newSlug, secretKey);
    if (result.success) {
      setSlug(newSlug);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#070F2B] via-[#1B1A55] to-[#535C91] py-10 px-4 flex flex-col items-center justify-center overflow-hidden text-white">
      <MusicPlayer />

      {!slug ? (
        // [적용] 스노우볼 내부에 편지함 만들기 폼 배치
        <Snowglobe>
          <h1 className="mt-3 text-xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
            🎄Christmas Snowglobe🎄
            <br />
          </h1>
          <p className="text-blue-100 text-xs opacity-90 leading-relaxed mt-2">
            이브에 편지를 보내면
            <br />
            크리스마스 당일에 도착해요!
          </p>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="닉네임 입력"
              className="w-50 h-10 bg-white/20 border border-white/30 rounded-xl p-3 mt-3 text-white placeholder:text-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="w-35 h-10 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg text-sm"
            >
              스노우볼 만들기 ✨
            </button>
          </div>
        </Snowglobe>
      ) : (
        // 링크 생성 완료 시에도 테마 유지
        <div className="max-w-md w-full text-center animate-fadeIn z-10">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            ✨ 링크 생성 완료!
          </h2>
          <div className="text-white text-xs mb-4">
            링크를 잘 보관해주세요! 잃어버리면 찾을 수 없어요...
          </div>
          <div className="flex flex-col w-full gap-6">
            {/* 1. 친구용 링크 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <span className="text-xl">🎁</span>
                <span className="text-sm font-bold text-white/90">
                  친구들에게 보낼 링크
                </span>
              </div>
              <div
                className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-5 border border-white/20 break-all relative group"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${slug}`
                  );
                  alert("링크가 복사되었습니다!");
                }}
              >
                <span className="font-mono text-yellow-200 text-sm">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/${slug}`}
                </span>
                {/* 팁: 복사 버튼 같은 걸 나중에 추가해도 좋아요! */}
              </div>
              <p className="text-[11px] text-white/50 ml-1">
                * 이 링크를 친구들에게 공유하면 편지를 받을 수 있어요.
              </p>
            </div>

            {/* 2. 내 편지함 확인용 링크 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <span className="text-xl">🔒</span>
                <span className="text-sm font-bold text-white/90">
                  내 스노우볼 링크
                </span>
              </div>
              <div
                className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-5 border border-white/10 break-all border-dashed"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/my/${slug}?key=${secretKey}`
                  );
                  alert("링크가 복사되었습니다!");
                }}
              >
                <span className="font-mono text-blue-200 text-sm">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/my/${slug}?key=${secretKey}`}
                </span>
              </div>
              <p className="text-[11px] text-red-200/60 ml-1 mb-8">
                * 주의: 이 링크는 친구들에게 공유하지 마세요!
              </p>
            </div>
          </div>

          <a
            href={`/my/${slug}?key=${secretKey}`}
            className="py-6 px-6 text-white bg-[#347433] font-bold rounded-2xl shadow-xl transition-all "
          >
            내 스노우볼 보러가기
          </a>
        </div>
      )}
      {/* 개발자 문의 정보 - 우측 하단 고정 */}
      <p className="fixed bottom-6 right-6 text-xs text-white/50 hover:text-white/80 transition-colors z-50">
        개발자에게 문의하기 : @wjeong_0411
      </p>
    </div>
  );
}
