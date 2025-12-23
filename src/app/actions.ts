"use server";

import { prisma } from "../../lib/prisma";

export async function registerUser(
  name: string,
  slug: string,
  secretKey: string
) {
  try {
    // 1. 유저 생성 시도
    const newUser = await prisma.user.create({
      data: {
        name: name,
        slug: slug,
        secretKey: secretKey,
      },
    });

    return { success: true, user: newUser };
  } catch (error: any) {
    // P2002는 Prisma에서 Unique 제약 조건 위반 에러 코드입니다 (이미 존재하는 slug)
    if (error.code === "P2002") {
      return {
        success: false,
        error: "이미 존재하는 슬러그입니다. 다시 시도해주세요.",
      };
    }

    console.error("DB 저장 에러:", error);
    return { success: false, error: "서버 오류가 발생했습니다." };
  }
}

export async function sendLetter(
  slug: string,
  content: string,
  keyword: string,
  song: string
) {
  try {
    // 1. 해당 슬러그를 가진 유저가 있는지 먼저 확인
    const targetUser = await prisma.user.findUnique({
      where: { slug: slug },
    });

    if (!targetUser) {
      return { success: false, error: "존재하지 않는 편지함입니다." };
    }

    // 2. 편지 생성
    await prisma.letter.create({
      data: {
        content: content,
        keyword: keyword,
        song: song,
        userSlug: slug, // 찾은 유저의 슬러그로 식별
      },
    });

    return { success: true };
  } catch (error) {
    console.error("편지 전송 에러:", error);
    return { success: false, error: "편지를 보내는 중 오류가 발생했습니다." };
  }
}

export async function getLetters(slug: string, key: string) {
  // key 매개변수 추가
  try {
    const user = await prisma.user.findUnique({
      where: { slug },
      include: { letters: true },
    });

    // 유저가 없거나, 전달받은 key가 DB의 secretKey와 다르면 차단!
    if (!user || user.secretKey !== key) {
      return { success: false, error: "권한이 없습니다." };
    }

    const christmasDate = new Date("2025-12-24T00:00:00");
    const now = new Date();
    const isLocked = now < christmasDate;

    return {
      success: true,
      isLocked,
      count: user.letters.length,
      letters: isLocked ? [] : user.letters,
      userName: user.name,
    };
  } catch (error) {
    return { success: false, error: "오류가 발생했습니다." };
  }
}
