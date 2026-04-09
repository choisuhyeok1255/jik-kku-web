"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MarketingSubpageLayout } from "./MarketingSubpageLayout";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";

const bullets = [
  "내가 작성한 직관 기록에도, 해당 경기 하이라이트가 연결됩니다.",
  "다른 사람이 올린 기록을 볼 때도 같은 경기라면 하이라이트를 함께 볼 수 있습니다.",
  "직관 후에 유튜브를 따로 검색하지 않아도, 기록과 함께 다시 보기 좋게 모아 둡니다.",
];

const faqItems: { q: string; a: string }[] = [
  {
    q: "기록한 경기의 하이라이트를 다시 볼 수 있나요?",
    a: "네. 직관 기록에 묶인 경기라면 하이라이트를 함께 확인할 수 있도록 연결해 둡니다.",
  },
  {
    q: "경기 다시보기는 어떻게 연결되나요?",
    a: "해당 경기의 하이라이트 영상을 자동으로 찾아 기록과 나란히 볼 수 있게 구성했습니다.",
  },
];

const YoutubeHighlightLandingPage = () => {
  return (
    <MarketingSubpageLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:px-8">
        <p className="text-sm font-medium text-orange-400">기능 소개</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          야구 하이라이트를 기록과 함께 보기
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70 md:text-base">
          야구 하이라이트와 경기 다시보기를 직관 기록 옆에 두었습니다. 기록한
          경기의 하이라이트를 찾아 보기 쉽게 이어지도록 만든 기능입니다.
        </p>

        <figure className="mt-10">
          <div className="relative mx-auto aspect-[9/19] w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-lg md:max-w-[300px]">
            <Image
              src="/ios_feed.png"
              alt="직꾸 피드에서 직관 기록과 경기 하이라이트를 함께 볼 수 있는 화면"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 280px, 300px"
            />
          </div>
          <figcaption className="mt-2 text-center text-[12px] text-white/45">
            피드에서 기록과 함께 경기를 다시 보기
          </figcaption>
        </figure>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            내 기록에도, 다른 사람 기록에도
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            본인이 남긴 직관 기록뿐 아니라, 커뮤니티에서 다른 팬이 올린 기록을
            볼 때도 같은 경기라면 하이라이트를 함께 확인할 수 있습니다. 경기
            맥락이 글과 영상으로 이어집니다.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            검색 없이 다시 보기
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            직관 직후나 며칠 뒤에도, 팀 이름과 날짜를 다시 검색해 유튜브를 찾을
            필요가 적습니다. 기록 화면에서 바로 하이라이트로 이어져 그날의
            장면을 빠르게 돌아볼 수 있습니다.
          </p>
        </section>

        <ul className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
          {bullets.map((text) => (
            <li key={text} className="flex gap-3 text-[15px] text-white/85">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/4 p-6">
          <h2 className="text-lg font-semibold text-white">자주 묻는 질문</h2>
          <dl className="mt-6 space-y-6">
            {faqItems.map(({ q, a }) => (
              <div key={q}>
                <dt className="text-[15px] font-medium text-white/90">{q}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-white/65">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            App Store
          </a>
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Google Play
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-white/45">
          <Link href="/" className="underline-offset-4 hover:underline">
            직꾸 홈으로 돌아가기
          </Link>
        </p>
      </article>
    </MarketingSubpageLayout>
  );
};

export default YoutubeHighlightLandingPage;
