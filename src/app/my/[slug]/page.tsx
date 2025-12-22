"use client";
import { use, useEffect, useState } from "react";

export default function MyBoxPage({ params }: any) {
  const { slug } = use(params) as {slug : string};
  const [letters, setLetters] = useState([]);

  const decodedName = decodeURIComponent(slug).split("-")[0];

  useEffect(() => {
    // TODO: API에서 메시지 가져오기
    setLetters([]);
  }, []);

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-center text-2xl font-bold mb-6">
        🎁 {decodedName} 님의 편지함
      </h1>

      {letters.length === 0 && (
        <p className="text-center text-gray-500">아직 도착한 편지가 없어요…</p>
      )}

      <div className="space-y-4">
        {letters.map((letter: any, i) => (
          <div key={i} className="bg-white shadow-md p-4 rounded-xl">
            <p className="whitespace-pre-wrap mb-2">{letter.content}</p>
            {letter.song && (
              <p className="text-sm text-blue-500">🎧 추천 노래: {letter.song}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">{letter.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
