/**
 * 구조화 데이터(JSON-LD)를 <script> 태그로 주입한다.
 *
 * `<`를 유니코드로 이스케이프해, 데이터에 "</script>"가 섞여도
 * 스크립트 태그가 조기 종료되어 마크업이 깨지는 일을 막는다.
 */
type JsonLdScriptProps = {
  data: unknown;
};

export const JsonLdScript = ({ data }: JsonLdScriptProps) => {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
