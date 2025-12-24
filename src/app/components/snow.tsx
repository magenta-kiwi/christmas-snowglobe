// components/Snowfall.tsx
"use client";
import { useEffect, useState } from "react";

// mode prop 추가: 'fullscreen' (기본값) 또는 'contained' (스노우볼 내부용)
interface SnowfallProps {
  mode?: "fullscreen" | "contained";
}

export default function Snowfall({ mode = "fullscreen" }: SnowfallProps) {
  const [flakes, setFlakes] = useState<any[]>([]);

  useEffect(() => {
    // 스노우볼 안이면 눈송이 개수를 조금 줄여서 자연스럽게 (예: 30개)
    const count = mode === "contained" ? 100 : 180;

    const newFlakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20, // 딜레이를 길게 주어 끊김 없이 내리게 함
      duration: 15 + Math.random() * 15, // 속도 다양화
      size: mode === "contained" ? Math.random() * 5 : Math.random() * 9, // 스노우볼 안은 조금 작게
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setFlakes(newFlakes);
  }, [mode]);

  // mode에 따라 위치 속성 결정
  const positionClass =
    mode === "contained" ? "absolute inset-0" : "fixed inset-0";

  return (
    <div className={`${positionClass} overflow-hidden pointer-events-none z-0`}>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-50px]" // animate-snow 클래스 대신 직접 스타일 적용 (기존 CSS 충돌 방지)
          style={{
            left: `${flake.left}%`,
            animation: `snowfall ${flake.duration}s linear infinite`,
            animationDelay: `-${flake.delay}s`, // 마이너스 딜레이로 처음부터 내리고 있는 것처럼
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
          }}
        >
          {/* 이미지 경로는 실제 프로젝트에 맞게 수정해주세요 */}
          <img
            src="/snowflake.png"
            alt="snow"
            className="w-full h-full object-contain animate-spin-slow" // 회전 애니메이션 별도 분리 추천
          />
        </div>
      ))}
    </div>
  );
}
