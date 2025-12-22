"use client";
import { useEffect, useRef, useState } from "react";

const SONG_LIST = [
  {
    title: "Last Christmas",
    artist: "Wham!",
    url: "/Wham!-Last Christmas.mp3",
  },
  {
    title: "Make It To Christmas",
    artist: "Alessia Cara",
    url: "/Alessia Cara-Make It To Christmas.mp3",
  },
  {
    title: "Save Our Christmas",
    artist: "John Park",
    url: "/John Park-Save Our Christmas.mp3",
  },
  {
    title: "Underneath the Tree",
    artist: "Kelly Clarkson",
    url: "/Kelly Clarkson-Underneath the Tree.mp3",
  },
  {
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    url: "/Mariah Carey-All I Want for Christmas is You.mp3",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(SONG_LIST[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 랜덤 노래 설정
  const setRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * SONG_LIST.length);
    setCurrentSong(SONG_LIST[randomIndex]);
  };

  useEffect(() => {
    setRandomSong();
  }, []);

  // 재생/일시정지 토글 함수
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => console.log("재생 실패:", err));
    }
  };

  // 노래가 끝났을 때 처리
  const handleEnded = () => {
    setRandomSong();
    // 잠시 후 다음 곡 재생 (곡이 바뀌는 시간을 벌어줌)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <div className="fixed top-6 left-6 z-[100] flex items-center">
      <audio ref={audioRef} src={currentSong.url} onEnded={handleEnded} />

      {/* [핵심 변경] isExpanded 상태를 따로 두지 않고 
        isPlaying 상태에 따라 가로 너비(max-w)를 직접 조절합니다.
      */}
      <div
        className={`flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full transition-all duration-700 ease-in-out shadow-lg overflow-hidden ${
          isPlaying ? "max-w-[350px] pr-5" : "max-w-[48px]"
        }`}
      >
        {/* 재생/정지 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMusic();
          }}
          className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 transition-transform duration-500 ${
            isPlaying ? "animate-spin-slow" : ""
          }`}
        >
          <span className="text-xl">{isPlaying ? "🎄" : "🔇"}</span>
        </button>

        {/* 노래 정보: 재생 중일 때만 투명도가 올라가며 나타남 */}
        <div
          className={`mt-1 transition-all duration-700 whitespace-nowrap ${
            isPlaying
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-5 pointer-events-none"
          }`}
        >
          <p className="text-xs font-bold text-white leading-tight">
            {currentSong.title}
          </p>
          <p className="text-[10px] text-blue-200 opacity-80">
            {currentSong.artist}
          </p>
        </div>
      </div>
    </div>
  );
}
