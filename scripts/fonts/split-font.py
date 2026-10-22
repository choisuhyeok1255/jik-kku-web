"""
세탁소체 원본 woff에서 웹용 두 조각(woff2)과 나머지 조각의 unicode-range를 만든다.

1. 모양이 빈(윤곽선 0개) 한글 음절을 뺀다. 원본은 KS X 1001 밖 한글 대부분이 빈 모양이라,
   그대로 두면 브라우저가 대체 글꼴로 넘기지 않고 빈칸을 그린다.
2. 남은 글자를 둘로 나눈다.
   - 공통 조각(common): 공개 페이지에서 이 글꼴로 그려지는 글자(collect-chars.mjs 결과) + 출력 가능한 ASCII 전체
   - 나머지 조각(rest): 그 밖의 글자
3. 나머지 조각의 unicode-range를 출력한다. app/layout.tsx의 laundryGothicRest에 붙여 넣는다.
   전체 범위에서 "공개 페이지 글자(폰트에 없는 이모지 등 포함) + ASCII"를 뺀 구간이다.
   폰트에 없는 글자도 빼야, 브라우저가 그 글자를 찾으려고 나머지 조각을 받으러 가지 않는다.

준비: pip install fonttools brotli
사용법: python scripts/fonts/split-font.py [--chars 파일] [--fonts 폴더] [--out 폴더]
방법 전체는 docs/font-split.md 참고.
"""
import argparse
import json

from fontTools import subset
from fontTools.ttLib import TTFont

WEIGHTS = ("Regular", "Bold")
ASCII_PRINTABLE = set(range(0x20, 0x7F))


def is_empty_hangul(font, codepoint, glyph_name):
    return 0xAC00 <= codepoint <= 0xD7A3 and font["glyf"][glyph_name].numberOfContours == 0


def save_subset(src, codepoints, dst):
    font = TTFont(src)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]  # 글자 간격(kern) 등 글꼴 기능 유지
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    subsetter = subset.Subsetter(options=opts)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(dst)


def rest_unicode_range(common_chars):
    """전체 범위(U+0~10FFFF)에서 common_chars를 뺀 구간을 unicode-range 문자열로 만든다."""
    ranges = []
    start = 0
    for cp in sorted(common_chars):
        if cp > start:
            ranges.append((start, cp - 1))
        start = cp + 1
    ranges.append((start, 0x10FFFF))
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in ranges)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--chars", default="scripts/fonts/common-chars.json")
    parser.add_argument("--fonts", default="public/fonts", help="원본 woff가 있는 폴더")
    parser.add_argument("--out", default="public/fonts", help="조각을 저장할 폴더")
    args = parser.parse_args()

    with open(args.chars, encoding="utf-8") as f:
        used = {ord(ch) for ch in json.load(f)["laundry"]}
    # 공통 조각에 넣을 글자. 폰트에 없는 글자(이모지 등)도 포함해 두어야 나머지 조각 범위에서 빠진다.
    common_chars = used | ASCII_PRINTABLE

    for weight in WEIGHTS:
        src = f"{args.fonts}/laundrygo {weight}.woff"
        font = TTFont(src)
        cmap = font.getBestCmap()
        kept = {cp for cp, name in cmap.items() if not is_empty_hangul(font, cp, name)}
        common = common_chars & kept
        rest = kept - common
        save_subset(src, common, f"{args.out}/laundrygo-{weight}.common.woff2")
        save_subset(src, rest, f"{args.out}/laundrygo-{weight}.rest.woff2")
        print(f"{weight}: 원본 {len(cmap)}자 중 빈 한글 {len(cmap) - len(kept)}자 제외 -> 공통 {len(common)}자, 나머지 {len(rest)}자")
        missing = sorted(cp for cp in used if cp not in kept)
        if missing:
            print(f"  페이지에 있지만 폰트에 없는 글자: {''.join(chr(cp) for cp in missing)}")

    print("\n나머지 조각 unicode-range (app/layout.tsx에 붙여 넣기):")
    print(rest_unicode_range(common_chars))


if __name__ == "__main__":
    main()
