// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // 접속하자마자 /create 페이지로 보냅니다.
  redirect("/create");
}
