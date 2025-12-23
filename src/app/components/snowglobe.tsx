// components/Snowglobe.tsx
import React from "react";
import Snowfall from "./snow";

interface SnowglobeProps {
  children: React.ReactNode; // 스노우볼 안에 들어갈 내용
}

export default function Snowglobe({ children }: SnowglobeProps) {
  const DECORATIONS = ["⭐", "🎄", "⭐", "🎅", "⭐", "🎁", "⭐", "🎄"];
  return (
    // 전체 컨테이너: 호버 시 스케일 커짐 효과
    <div className="group relative w-80 h-[400px] mx-auto flex flex-col items-center transition-transform duration-500 hover:scale-[1.03]">
      {/* === 1. 스노우볼 구체 (Globe) === */}
      <div className="relative w-80 h-80 z-10">
        {/* [Layer 1: 외부 유리 쉘] 반사광과 입체 테두리 담당 */}
        <div
          className="absolute inset-0 rounded-full border-blue-100/20
                        bg-gradient-to-br from-white/40 via-transparent to-blue-900/10
                        shadow-[inset_10px_10px_30px_rgba(255,255,255,0.6),_inset_-10px_-15px_40px_rgba(0,0,50,0.3),_0_10px_30px_rgba(0,0,0,0.2)]
                        pointer-events-none z-30"
        ></div>

        {/* [Layer 2: 내부 콘텐츠 컨테이너] 실제 내용과 눈이 담기는 곳 */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden 
                        bg-blue-950/40 backdrop-blur-md border border-white/10
                        flex items-center justify-center z-20"
        >
          {/* 스노우볼 내부에만 내리는 눈 (mode="contained") */}
          <Snowfall mode="contained" />

          {/* 실제 콘텐츠 (텍스트 등) */}
          <div className="relative z-40 p-8 text-center text-white drop-shadow-lg font-medium">
            {children}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 w-56 h-24 bg-gradient-to-b from-[#6D2323] to-[#A31D1D]
                      rounded-[40%_40%_30%_30%_/_100%_100%_20%_20%]
                      border-t-4 border-[#A31D1D]/50 shadow-2xl z-0
                      flex-row justify-center items-start"
      >
        {/* 받침대 금장 장식 띠 (살짝 얇게 조정) */}
        {/* <div className="absolute top-1 w-[85%] h-1 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 rounded-full opacity-60 shadow-sm"></div> */}

        {/* ⭐🎅🎁 이모티콘 장식 빙 두르기 ⭐ */}
        <div className="w-full h-full flex justify-center items-start pointer-events-none">
          {DECORATIONS.map((emoji, i) => {
            // 1. 전체 개수를 기준으로 각도 계산 (예: 8개면 -35도 ~ +35도 사이로 배치)
            const totalCount = DECORATIONS.length;
            // 중앙에서부터 양쪽으로 퍼지도록 각도 설정 (간격 10도)
            const rotateAngle = (totalCount - i / 2 + 0.5) * 29;

            return (
              <span
                key={i}
                className="text-lg drop-shadow-md select-none"
                style={{
                  // 위치를 중앙으로 잡고
                  left: "50%",
                  // 계산된 각도만큼 회전
                  rotate: `${rotateAngle}deg`,
                  // ⭐ 핵심: 회전의 중심축을 이모티콘 아래쪽 멀리로 설정하여 둥글게 배치
                  transformOrigin: "center 50px",
                  // X축 중앙 정렬 및 미세 위치 조정
                  transform: "translateX(-50%) translateY(-2px)",
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
