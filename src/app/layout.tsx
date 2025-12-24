import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: '나만의 크리스마스 스노우볼',
//   description: '친구들의 마음을 담은 따뜻한 메시지를 확인해보세요.',
//   openGraph: {
//     title: '나만의 크리스마스 스노우볼',
//     description: '12월 25일에 열리는 특별한 선물상자 🎁',
//     url: 'https://christmas-snowglobe.vercel.app',
//     siteName: 'Christmas Snowglobe',
//     images: [
//       {
//         url: '/og-screen.png', // public 폴더에 저장한 이미지 경로
//         width: 1200,
//         height: 630,
//       },
//     ],
//     locale: 'ko_KR',
//     type: 'website',
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
