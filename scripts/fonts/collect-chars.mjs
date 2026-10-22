/**
 * 공개 페이지에서 세탁소체(laundryGothic)로 실제 그려지는 글자를 모은다.
 * - 페이지를 모바일, 데스크톱 너비로 열고, 글자마다 부모 요소의 글꼴 순서 첫 번째가 세탁소체인지 확인한다.
 *   약관 본문처럼 다른 글꼴(font-sans)로 그려지는 글자는 넣지 않는다.
 * - 눌러야 나타나는 글자(모바일 메뉴, 후기 슬라이드)도 열고 넘기며 모은다.
 * - 결과는 split-font.py가 공통 조각을 만들 때 쓴다. 방법은 docs/font-split.md 참고.
 *
 * 사용법: node scripts/fonts/collect-chars.mjs <사이트 주소> [결과 파일]
 *   예: node scripts/fonts/collect-chars.mjs http://localhost:3100
 * Chrome 위치가 다르면 CHROME_PATH 환경 변수로 지정한다.
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

// 공개 페이지 목록. 공개 페이지를 추가하거나 빼면 여기도 함께 고친다. 마지막은 404 페이지용 없는 주소다.
const PUBLIC_PATHS = [
  "/",
  "/easy-game-log",
  "/kbo-calendar",
  "/live-score",
  "/lock-screen-live",
  "/season-record",
  "/youtube-highlight",
  "/terms",
  "/privacy",
  "/this-page-does-not-exist",
];
const VIEWPORT_WIDTHS = [390, 1440];
const DEFAULT_OUT = "scripts/fonts/common-chars.json";
const DEFAULT_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** 페이지 안에서 실행: 세탁소체로 그려지는 글자를 한 문자열로 돌려준다. */
const readPageChars = () => {
  // 가상 요소(::before 등)는 자기 글꼴이 따로 있을 수 있어 pseudo를 함께 넘긴다.
  const isLaundry = (el, pseudo) =>
    getComputedStyle(el, pseudo)
      .fontFamily.split(",")[0]
      .trim()
      .replace(/['"]/g, "")
      .toLowerCase()
      .includes("laundrygothic");
  const laundry = [];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (!el || ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName))
      continue;
    if (isLaundry(el)) laundry.push(node.textContent);
  }
  for (const el of document.body.querySelectorAll("*")) {
    for (const pseudo of ["::before", "::after"]) {
      const content = getComputedStyle(el, pseudo).content;
      if (!content || content === "none" || content === "normal") continue;
      if (isLaundry(el, pseudo))
        laundry.push(content.replace(/^["']|["']$/g, ""));
    }
    if (el.placeholder && isLaundry(el)) laundry.push(el.placeholder);
  }
  return laundry.join("");
};

const collectPage = async (browser, url, width, chars) => {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  const add = (text) => {
    for (const ch of text) chars.add(ch);
  };
  add(await page.evaluate(readPageChars));

  const menu = page.locator('button[aria-label="메뉴 열기"]');
  if (await menu.isVisible().catch(() => false)) {
    await menu.click();
    add(await page.evaluate(readPageChars));
  }
  // 후기 슬라이드는 현재 후기 1개만 그리므로 끝까지 넘긴다.
  const reviewCount = await page
    .locator('button[aria-label$="번 보기"]')
    .count();
  for (let i = 0; i < reviewCount; i++) {
    await page.locator('button[aria-label="다음 후기"]').click();
    add(await page.evaluate(readPageChars));
  }
  await page.close();
};

const main = async () => {
  const [, , base, out = DEFAULT_OUT] = process.argv;
  if (!base) {
    console.error(
      "사용법: node scripts/fonts/collect-chars.mjs <사이트 주소> [결과 파일]",
    );
    process.exit(1);
  }
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ?? DEFAULT_CHROME,
  });
  const chars = new Set();
  for (const path of PUBLIC_PATHS) {
    const before = chars.size;
    for (const width of VIEWPORT_WIDTHS)
      await collectPage(browser, base + path, width, chars);
    console.log(`${path}: 새 글자 ${chars.size - before}개`);
  }
  await browser.close();

  const sorted = [...chars].filter((ch) => !/\s/.test(ch)).sort();
  const hangul = sorted.filter((ch) => ch >= "가" && ch <= "힣").length;
  writeFileSync(
    out,
    `${JSON.stringify({ laundry: sorted.join("") }, null, 2)}\n`,
  );
  console.log(`합계 ${sorted.length}자 (한글 ${hangul}자) -> ${out}`);
};

await main();
