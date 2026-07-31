/**
 * 자주 묻는 질문 섹션.
 * 본문과 구조화 데이터(FAQPage JSON-LD)가 같은 목록을 쓰도록 seo-faq를 단일 출처로 삼는다.
 */
import { SEO_HOME_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";

export const FaqSection = () => {
  return (
    <section
      id="faq"
      className="scroll-mt-[72px] border-t border-white/10 bg-[#0d0d0d] px-4 py-16 md:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          자주 묻는 질문
        </h2>
        <dl className="mt-10 space-y-8">
          {SEO_HOME_FAQ_ITEMS.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-[15px] font-semibold text-white/90">{q}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-white/60">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
