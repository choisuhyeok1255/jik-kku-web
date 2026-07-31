/**
 * 기능 소개 페이지의 자주 묻는 질문 블록.
 * 같은 목록이 FAQPage 구조화 데이터에도 쓰이므로 seo-faq를 단일 출처로 받는다.
 */
import type { SeoFaqItem } from "@/src/shared/lib/seo-faq";

type SeoFaqSectionProps = {
  items: SeoFaqItem[];
};

export const SeoFaqSection = ({ items }: SeoFaqSectionProps) => {
  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-xl font-semibold text-white">자주 묻는 질문</h2>
      <dl className="mt-6 space-y-6">
        {items.map(({ q, a }) => (
          <div key={q}>
            <dt className="text-[15px] font-medium text-white/90">{q}</dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-white/65">
              {a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
