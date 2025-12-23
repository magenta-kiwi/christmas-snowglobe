"use client";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

const EMOJIS = ["☃️", "🎁", "🎄", "🎅", "💝", "⭐", "💚", "❄️"];

export default function PhysicsSnowglobe({ count }: { count: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = engineRef.current;
    const { world } = engine;

    Matter.Composite.clear(world, false);
    Matter.Engine.clear(engine);

    // 1. 렌더러 설정 (투명하게)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 300,
        height: 300,
        wireframes: false, // 실제 이미지를 보기 위해 false
        background: "transparent",
      },
    });

    // 2. 둥근 벽 만들기 (스노우볼 형태)
    // Matter-js는 기본적으로 사각형 벽이므로, 여러 개의 작은 사각형을 원형으로 배치하여 둥근 바닥을 만듭니다.
    const wallCount = 100;
    const radius = 145;
    const centerX = 150;
    const centerY = 150;

    const walls = [];
    for (let i = 0; i < wallCount; i++) {
      // Math.PI * 2 를 사용하여 360도 전체 범위를 계산합니다.
      const angle = (i / wallCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      walls.push(
        Matter.Bodies.rectangle(x, y, 30, 10, {
          // 벽 조각 크기 조절
          isStatic: true,
          angle: angle + Math.PI / 2, // 각 조각을 원의 중심을 향하게 회전
          render: { visible: false }, // 실제 벽은 안 보이게
          friction: 1,
          restitution: 1, // 벽에 부딪히면 튕겨 나오게 함
        })
      );
    }
    Matter.Composite.add(world, walls);

    // 3. 이모지 생성 (편지 개수만큼)
    const emojis = Array.from({ length: Math.min(count, 30) }).map((_, i) => {
      // 이제 천장이 막혔으므로, 구슬 밖이 아니라 구슬 안쪽 상단(y: 50~100)에서 생성해야 합니다.
      const x = 170 + (Math.random() - 0.5) * 20;
      const y = 150 + i * -10; // 구슬 내부 상단에서 차례대로 떨어지게 설정

      const body = Matter.Bodies.circle(x, y, 15, {
        restitution: 0.3, // 탄성 (통통 튀는 정도)
        friction: 0.2, // 마찰
        render: {
          sprite: {
            // 이모지를 텍스트 그대로 쓰기 어려워 canvas로 그려서 넣습니다.
            texture: createEmojiTexture(EMOJIS[i % EMOJIS.length]),
            xScale: 1,
            yScale: 1,
          },
        },
      });
      return body;
    });

    Matter.Composite.add(world, emojis);

    // 4. 실행
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // 5. 클릭 시 팝! (위로 튀어오르기)
    const handlePop = () => {
      emojis.forEach((body) => {
        const force = {
          x: (Math.random() - 0.2) * 0.01,
          y: -0.01 - Math.random() * 0.02,
        };
        Matter.Body.applyForce(body, body.position, force);
      });
    };

    sceneRef.current.addEventListener("click", handlePop);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [count]);

  return <div ref={sceneRef} className="relative w-[300px] h-[300px]" />;
}

// 이모지를 이미지 텍스트로 변환하는 헬퍼 함수
function createEmojiTexture(emoji: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "40px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 32, 32);
  }
  return canvas.toDataURL();
}
