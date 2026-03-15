"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetTeams, useGetUser } from "@/src/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/src/shared";
import { cn } from "@/src/shared/lib/tailwind";

type CalendarDay = {
  games: Array<{ home: string; away: string; venue: string }>;
};

const EMPTY_DAY: CalendarDay = { games: [] };

const KBO_CALENDAR = {
  "2026": {
    1: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
      29: EMPTY_DAY,
      30: EMPTY_DAY,
      31: EMPTY_DAY,
    },
    2: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
    },
    3: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: {
        games: [
          { home: "LG", away: "NC", venue: "마산" },
          { home: "키움", away: "두산", venue: "이천" },
          { home: "KT", away: "롯데", venue: "사직" },
          { home: "SSG", away: "KIA", venue: "광주" },
          { home: "삼성", away: "한화", venue: "대전" },
        ],
      },
      13: {
        games: [
          { home: "LG", away: "NC", venue: "마산" },
          { home: "키움", away: "두산", venue: "이천" },
          { home: "KT", away: "롯데", venue: "사직" },
          { home: "SSG", away: "KIA", venue: "광주" },
          { home: "삼성", away: "한화", venue: "대전" },
        ],
      },
      14: {
        games: [
          { home: "삼성", away: "두산", venue: "이천" },
          { home: "키움", away: "NC", venue: "마산" },
          { home: "LG", away: "롯데", venue: "사직" },
          { home: "KT", away: "KIA", venue: "광주" },
          { home: "SSG", away: "한화", venue: "대전" },
        ],
      },
      15: {
        games: [
          { home: "삼성", away: "두산", venue: "이천" },
          { home: "키움", away: "NC", venue: "마산" },
          { home: "LG", away: "롯데", venue: "사직" },
          { home: "KT", away: "KIA", venue: "광주" },
          { home: "SSG", away: "한화", venue: "대전" },
        ],
      },
      16: {
        games: [
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "한화", away: "두산", venue: "대전" },
          { home: "NC", away: "KIA", venue: "창원" },
        ],
      },
      17: {
        games: [
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      18: EMPTY_DAY,
      19: {
        games: [
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      20: {
        games: [
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      21: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "KT", away: "NC", venue: "수원" },
        ],
      },
      22: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "SSG", away: "키움", venue: "문학" },
        ],
      },
      23: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      24: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      29: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      30: EMPTY_DAY,
      31: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
    },
    4: {
      1: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
      2: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
      3: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      4: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      5: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      6: EMPTY_DAY,
      7: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      8: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      9: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      10: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      11: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      12: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      13: EMPTY_DAY,
      14: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      15: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      16: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      17: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "키움", venue: "수원" },
        ],
      },
      18: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "키움", venue: "수원" },
        ],
      },
      19: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "키움", venue: "수원" },
        ],
      },
      20: EMPTY_DAY,
      21: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      22: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      23: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      24: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      25: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      26: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      27: EMPTY_DAY,
      28: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
      29: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
      30: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
    },
    5: {
      1: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      2: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      3: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      4: EMPTY_DAY,
      5: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
        ],
      },
      6: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
        ],
      },
      7: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
        ],
      },
      8: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      9: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      10: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      11: EMPTY_DAY,
      12: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      13: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      14: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      15: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
        ],
      },
      16: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
        ],
      },
      17: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
        ],
      },
      18: EMPTY_DAY,
      19: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "LG", venue: "광주" },
          { home: "키움", away: "SSG", venue: "고척" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      20: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "LG", venue: "광주" },
          { home: "키움", away: "SSG", venue: "고척" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      21: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "LG", venue: "광주" },
          { home: "키움", away: "SSG", venue: "고척" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      22: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "롯데", away: "삼성", venue: "사직" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      23: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "롯데", away: "삼성", venue: "사직" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      24: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "롯데", away: "삼성", venue: "사직" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      25: EMPTY_DAY,
      26: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
        ],
      },
      27: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
        ],
      },
      28: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
        ],
      },
      29: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
      30: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
      31: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "롯데", venue: "창원" },
          { home: "키움", away: "KT", venue: "고척" },
          { home: "한화", away: "SSG", venue: "대전" },
        ],
      },
    },
    6: {
      1: EMPTY_DAY,
      2: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
        ],
      },
      3: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
        ],
      },
      4: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "키움", venue: "문학" },
          { home: "삼성", away: "NC", venue: "대구" },
          { home: "KT", away: "LG", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
        ],
      },
      5: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      6: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      7: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "NC", away: "LG", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
        ],
      },
      8: EMPTY_DAY,
      9: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      10: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      11: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "두산", venue: "사직" },
          { home: "KT", away: "삼성", venue: "수원" },
          { home: "키움", away: "NC", venue: "고척" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      12: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      13: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      14: {
        games: [
          { home: "LG", away: "롯데", venue: "잠실" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "KT", away: "NC", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
          { home: "키움", away: "한화", venue: "고척" },
        ],
      },
      15: EMPTY_DAY,
      16: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "KIA", away: "LG", venue: "광주" },
        ],
      },
      17: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "KIA", away: "LG", venue: "광주" },
        ],
      },
      18: {
        games: [
          { home: "두산", away: "KT", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "삼성", away: "키움", venue: "대구" },
          { home: "NC", away: "한화", venue: "창원" },
          { home: "KIA", away: "LG", venue: "광주" },
        ],
      },
      19: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      20: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      21: {
        games: [
          { home: "LG", away: "두산", venue: "잠실" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "KIA", venue: "수원" },
          { home: "키움", away: "롯데", venue: "고척" },
          { home: "한화", away: "삼성", venue: "대전" },
        ],
      },
      22: EMPTY_DAY,
      23: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      24: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      25: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "KT", away: "SSG", venue: "수원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "두산", venue: "대전" },
        ],
      },
      26: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
        ],
      },
      27: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
        ],
      },
      28: {
        games: [
          { home: "두산", away: "KIA", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "NC", away: "키움", venue: "창원" },
        ],
      },
      29: EMPTY_DAY,
      30: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
    },
    7: {
      1: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
      2: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
          { home: "한화", away: "KT", venue: "대전" },
        ],
      },
      3: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      4: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      5: {
        games: [
          { home: "LG", away: "한화", venue: "잠실" },
          { home: "SSG", away: "삼성", venue: "문학" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "KIA", away: "NC", venue: "광주" },
          { home: "키움", away: "두산", venue: "고척" },
        ],
      },
      6: EMPTY_DAY,
      7: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      8: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      9: {
        games: [
          { home: "두산", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "KIA", venue: "사직" },
          { home: "삼성", away: "LG", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      17: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      18: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      19: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "SSG", away: "KIA", venue: "문학" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      20: EMPTY_DAY,
      21: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      22: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      23: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "롯데", away: "SSG", venue: "사직" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "한화", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      24: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      25: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      26: {
        games: [
          { home: "두산", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "NC", venue: "문학" },
          { home: "롯데", away: "KT", venue: "사직" },
          { home: "KIA", away: "키움", venue: "광주" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      27: EMPTY_DAY,
      28: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      29: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      30: {
        games: [
          { home: "LG", away: "키움", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "삼성", away: "KIA", venue: "대구" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "한화", away: "롯데", venue: "대전" },
        ],
      },
      31: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "롯데", away: "삼성", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
          { home: "키움", away: "SSG", venue: "고척" },
        ],
      },
    },
    8: {
      1: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "롯데", away: "삼성", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
          { home: "키움", away: "SSG", venue: "고척" },
        ],
      },
      2: {
        games: [
          { home: "키움", away: "SSG", venue: "고척" },
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "삼성", away: "롯데", venue: "사직" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "한화", away: "KT", venue: "수원" },
        ],
      },
      3: EMPTY_DAY,
      4: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
        ],
      },
      5: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
        ],
      },
      6: {
        games: [
          { home: "두산", away: "NC", venue: "잠실" },
          { home: "SSG", away: "LG", venue: "문학" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KIA", away: "KT", venue: "광주" },
        ],
      },
      7: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      8: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      9: {
        games: [
          { home: "LG", away: "KIA", venue: "잠실" },
          { home: "삼성", away: "두산", venue: "대구" },
          { home: "NC", away: "SSG", venue: "창원" },
          { home: "KT", away: "롯데", venue: "수원" },
          { home: "한화", away: "키움", venue: "대전" },
        ],
      },
      10: EMPTY_DAY,
      11: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      12: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      13: {
        games: [
          { home: "두산", away: "한화", venue: "잠실" },
          { home: "SSG", away: "롯데", venue: "문학" },
          { home: "NC", away: "KT", venue: "창원" },
          { home: "KIA", away: "삼성", venue: "광주" },
          { home: "키움", away: "LG", venue: "고척" },
        ],
      },
      14: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
        ],
      },
      15: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
        ],
      },
      16: {
        games: [
          { home: "LG", away: "SSG", venue: "잠실" },
          { home: "롯데", away: "NC", venue: "사직" },
          { home: "삼성", away: "한화", venue: "대구" },
          { home: "KT", away: "키움", venue: "수원" },
          { home: "KIA", away: "두산", venue: "광주" },
        ],
      },
      17: EMPTY_DAY,
      18: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      19: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      20: {
        games: [
          { home: "LG", away: "KT", venue: "잠실" },
          { home: "롯데", away: "키움", venue: "사직" },
          { home: "삼성", away: "SSG", venue: "대구" },
          { home: "NC", away: "두산", venue: "창원" },
          { home: "한화", away: "KIA", venue: "대전" },
        ],
      },
      21: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      22: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      23: {
        games: [
          { home: "두산", away: "롯데", venue: "잠실" },
          { home: "SSG", away: "KT", venue: "문학" },
          { home: "NC", away: "삼성", venue: "창원" },
          { home: "키움", away: "KIA", venue: "고척" },
          { home: "한화", away: "LG", venue: "대전" },
        ],
      },
      24: EMPTY_DAY,
      25: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      26: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      27: {
        games: [
          { home: "LG", away: "NC", venue: "잠실" },
          { home: "SSG", away: "한화", venue: "문학" },
          { home: "KT", away: "두산", venue: "수원" },
          { home: "KIA", away: "롯데", venue: "광주" },
          { home: "키움", away: "삼성", venue: "고척" },
        ],
      },
      28: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      29: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      30: {
        games: [
          { home: "두산", away: "키움", venue: "잠실" },
          { home: "롯데", away: "LG", venue: "사직" },
          { home: "삼성", away: "KT", venue: "대구" },
          { home: "KIA", away: "SSG", venue: "광주" },
          { home: "한화", away: "NC", venue: "대전" },
        ],
      },
      31: EMPTY_DAY,
    },
    9: {
      1: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
          { home: "키움", away: "SSG", venue: "고척" },
        ],
      },
      2: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
          { home: "키움", away: "SSG", venue: "고척" },
        ],
      },
      3: {
        games: [
          { home: "두산", away: "LG", venue: "잠실" },
          { home: "삼성", away: "롯데", venue: "대구" },
          { home: "NC", away: "KIA", venue: "창원" },
          { home: "KT", away: "한화", venue: "수원" },
          { home: "키움", away: "SSG", venue: "고척" },
        ],
      },
      4: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      5: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      6: {
        games: [
          { home: "LG", away: "삼성", venue: "잠실" },
          { home: "SSG", away: "두산", venue: "문학" },
          { home: "롯데", away: "한화", venue: "사직" },
          { home: "KIA", away: "KT", venue: "광주" },
          { home: "키움", away: "NC", venue: "고척" },
        ],
      },
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
      29: EMPTY_DAY,
      30: EMPTY_DAY,
    },
    10: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
      29: EMPTY_DAY,
      30: EMPTY_DAY,
      31: EMPTY_DAY,
    },
    11: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
      29: EMPTY_DAY,
      30: EMPTY_DAY,
    },
    12: {
      1: EMPTY_DAY,
      2: EMPTY_DAY,
      3: EMPTY_DAY,
      4: EMPTY_DAY,
      5: EMPTY_DAY,
      6: EMPTY_DAY,
      7: EMPTY_DAY,
      8: EMPTY_DAY,
      9: EMPTY_DAY,
      10: EMPTY_DAY,
      11: EMPTY_DAY,
      12: EMPTY_DAY,
      13: EMPTY_DAY,
      14: EMPTY_DAY,
      15: EMPTY_DAY,
      16: EMPTY_DAY,
      17: EMPTY_DAY,
      18: EMPTY_DAY,
      19: EMPTY_DAY,
      20: EMPTY_DAY,
      21: EMPTY_DAY,
      22: EMPTY_DAY,
      23: EMPTY_DAY,
      24: EMPTY_DAY,
      25: EMPTY_DAY,
      26: EMPTY_DAY,
      27: EMPTY_DAY,
      28: EMPTY_DAY,
      29: EMPTY_DAY,
      30: EMPTY_DAY,
      31: EMPTY_DAY,
    },
  },
};

const SWIPE_THRESHOLD = 50;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const KBO_YEARS = Object.keys(KBO_CALENDAR)
  .map(Number)
  .sort((a, b) => a - b);
const getKboMonthsForYear = (year: number) => {
  const yearData = KBO_CALENDAR[String(year) as keyof typeof KBO_CALENDAR];
  if (!yearData) return [];
  return Object.keys(yearData)
    .map(Number)
    .filter((m) => m >= 1 && m <= 12)
    .sort((a, b) => a - b);
};

const getMinMaxDate = () => {
  if (KBO_YEARS.length === 0) return { min: null, max: null };
  const minYear = KBO_YEARS[0]!;
  const minMonths = getKboMonthsForYear(minYear);
  const maxYear = KBO_YEARS[KBO_YEARS.length - 1]!;
  const maxMonths = getKboMonthsForYear(maxYear);
  const min =
    minMonths.length > 0
      ? new Date(minYear, minMonths[0]! - 1, 1)
      : new Date(minYear, 0, 1);
  const max =
    maxMonths.length > 0
      ? new Date(maxYear, maxMonths[maxMonths.length - 1]! - 1, 1)
      : new Date(maxYear, 11, 1);
  return { min, max };
};

const { min: MIN_CALENDAR_DATE, max: MAX_CALENDAR_DATE } = getMinMaxDate();

const getPrevMonth = (date: Date): Date | null => {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  if (MIN_CALENDAR_DATE && prev < MIN_CALENDAR_DATE) return null;
  const months = getKboMonthsForYear(prev.getFullYear());
  if (months.length === 0) return null;
  const prevMonth1Based = prev.getMonth() + 1;
  if (!months.includes(prevMonth1Based)) return null;
  return prev;
};

const getNextMonth = (date: Date): Date | null => {
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  if (MAX_CALENDAR_DATE && next > MAX_CALENDAR_DATE) return null;
  const months = getKboMonthsForYear(next.getFullYear());
  if (months.length === 0) return null;
  const nextMonth1Based = next.getMonth() + 1;
  if (!months.includes(nextMonth1Based)) return null;
  return next;
};

const clampToKboRange = (date: Date): Date => {
  if (MIN_CALENDAR_DATE && date < MIN_CALENDAR_DATE) return MIN_CALENDAR_DATE;
  if (MAX_CALENDAR_DATE && date > MAX_CALENDAR_DATE) return MAX_CALENDAR_DATE;
  const months = getKboMonthsForYear(date.getFullYear());
  const month1Based = date.getMonth() + 1;
  if (months.length === 0) return MIN_CALENDAR_DATE ?? date;
  if (!months.includes(month1Based)) {
    const nearest =
      months.find((m) => m >= month1Based) ?? months[months.length - 1];
    return new Date(date.getFullYear(), nearest - 1, 1);
  }
  return date;
};

type CalendarDayData = {
  date: Date;
  isCurrentMonth: boolean;
};

const getCalendarDays = (month: Date): CalendarDayData[] => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const lastDate = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = 1 - firstDay;
  const needsSixRows = lastDate + firstDay > 35;
  const cellCount = needsSixRows ? 42 : 35;
  const result: CalendarDayData[] = [];
  for (let i = 0; i < cellCount; i++) {
    const date = new Date(year, monthIndex, startOffset + i);
    result.push({
      date,
      isCurrentMonth: date.getMonth() === monthIndex,
    });
  }
  return result;
};

const getGamesForDate = (
  date: Date,
  teamShortName: string | null,
): Array<{ home: string; away: string; venue: string }> => {
  if (!teamShortName) return [];
  const year = date.getFullYear().toString();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const yearData = KBO_CALENDAR[year as keyof typeof KBO_CALENDAR];
  if (!yearData) return [];
  const monthData = yearData[month as keyof typeof yearData];
  if (!monthData) return [];
  const dayData = monthData[day as keyof typeof monthData];
  if (!dayData || !dayData.games?.length) return [];
  return dayData.games.filter(
    (g) => g.home === teamShortName || g.away === teamShortName,
  );
};

const formatMonthLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const CalendarPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeMonth, setActiveMonth] = useState<Date>(() => {
    const now = new Date();
    return clampToKboRange(new Date(now.getFullYear(), now.getMonth(), 1));
  });
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const touchStartX = useRef(0);

  const { data: user } = useGetUser();
  const { data: teams, isLoading: isTeamsLoading } = useGetTeams();

  const initialTeamId = user?.team_id ?? teams?.[0]?.id ?? null;
  const hasUserChangedTeam = useRef(false);

  const handleTeamChange = useCallback((value: string) => {
    hasUserChangedTeam.current = true;
    setSelectedTeamId(value);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialTeamId != null && !hasUserChangedTeam.current) {
      setSelectedTeamId(String(initialTeamId));
    }
  }, [initialTeamId]);

  const goToPrevMonth = useCallback(() => {
    setActiveMonth((prev) => {
      const next = getPrevMonth(prev);
      return next ?? prev;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setActiveMonth((prev) => {
      const next = getNextMonth(prev);
      return next ?? prev;
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        if (deltaX > 0) goToPrevMonth();
        else goToNextMonth();
      }
    },
    [goToPrevMonth, goToNextMonth],
  );

  const selectedTeam = teams?.find((t) => String(t.id) === selectedTeamId);
  const teamShortName = selectedTeam?.short_team_name ?? null;

  const calendarDays = getCalendarDays(activeMonth);
  const canGoPrev = !!getPrevMonth(activeMonth);
  const canGoNext = !!getNextMonth(activeMonth);

  if (!mounted) return null;

  return (
    <div
      className="flex flex-col px-[16px] pt-[24px] pb-[24px]"
      role="region"
      aria-label="경기 일정"
      aria-busy={isTeamsLoading}
    >
      <div className="mb-[16px]">
        {isTeamsLoading ? (
          <Skeleton className="h-[44px] w-full rounded-[12px] bg-white/10" />
        ) : (
          <Select value={selectedTeamId} onValueChange={handleTeamChange}>
            <SelectTrigger
              className="h-[44px] w-full min-w-[160px] rounded-[12px] border-white/10 bg-white/5 text-[14px]"
              aria-label="구단 선택"
            >
              <SelectValue placeholder="구단 선택" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#232323]">
              {teams?.map((team) => (
                <SelectItem key={team.id} value={String(team.id)}>
                  {team.team_name ?? team.short_team_name ?? ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div
        className="touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="mb-[12px] flex w-full items-center justify-center gap-[16px]"
          role="group"
          aria-label="월 선택"
        >
          <button
            type="button"
            className="flex size-[24px] items-center justify-center bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={goToPrevMonth}
            disabled={!canGoPrev}
            aria-label="이전 달"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <span
            className="min-w-[120px] text-center text-[16px] font-medium"
            aria-live="polite"
          >
            {formatMonthLabel(activeMonth)}
          </span>
          <button
            type="button"
            className="flex size-[24px] items-center justify-center bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={goToNextMonth}
            disabled={!canGoNext}
            aria-label="다음 달"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>

        <div
          className="grid w-full grid-cols-7 gap-0"
          role="grid"
          aria-label={`${formatMonthLabel(activeMonth)} 경기 일정`}
        >
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="flex aspect-square items-center justify-center text-[14px] text-white/70"
              role="columnheader"
              aria-label={wd}
            >
              {wd}
            </div>
          ))}
          {calendarDays.map(({ date, isCurrentMonth }, i) => {
            const games = getGamesForDate(date, teamShortName);
            const isToday = date.toDateString() === new Date().toDateString();
            const isTodayCell = isToday && isCurrentMonth;
            const isOtherMonth = !isCurrentMonth;
            const dateColorClass = isTodayCell
              ? "text-white"
              : isOtherMonth
                ? "text-white/40"
                : "text-white/80";
            const opponentColorClass = isTodayCell
              ? "text-white"
              : isOtherMonth
                ? "text-white/40"
                : "text-white/80";
            const venueColorClass = isTodayCell
              ? "text-white/90"
              : isOtherMonth
                ? "text-white/40"
                : "text-white/60";
            const dayLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일, ${WEEKDAYS[date.getDay()]}요일`;
            const gamesLabel =
              games.length > 0 && teamShortName
                ? games
                    .map(
                      (g) =>
                        `${g.home} 대 ${g.away}${g.venue ? ` @${g.venue}` : ""}`,
                    )
                    .join(", ")
                : "";
            const cellAriaLabel = gamesLabel
              ? `${dayLabel}, ${gamesLabel}`
              : dayLabel;
            return (
              <div
                key={i}
                role="gridcell"
                aria-label={cellAriaLabel}
                className="flex min-h-[56px] flex-col items-center justify-start gap-[2px] p-[2px] text-center"
              >
                <span
                  className={cn(
                    "flex size-[32px] items-center justify-center rounded-full text-[16px]",
                    dateColorClass,
                    isTodayCell && "border-2 border-white/70 bg-white/5",
                  )}
                >
                  {date.getDate()}
                </span>
                {games.length > 0 && teamShortName && (
                  <div className="flex w-full flex-col gap-px">
                    {games.map((g, j) => {
                      const opponent =
                        g.home === teamShortName ? g.away : g.home;
                      return (
                        <div
                          key={j}
                          className="flex flex-col"
                          title={`${g.away} vs ${g.home}${g.venue ? ` @${g.venue}` : ""}`}
                        >
                          <span
                            className={cn(
                              "truncate text-[12px]",
                              opponentColorClass,
                            )}
                          >
                            {opponent}
                          </span>
                          {g.venue ? (
                            <span
                              className={cn(
                                "truncate text-[10px]",
                                venueColorClass,
                              )}
                            >
                              {g.venue}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
