#!/usr/bin/env bash
# 아카이브 사진을 웹용 파생본으로 변환합니다.
#
#   <이름>-display.jpg  긴 변 1800px, 화면/라이트박스용
#   <이름>-thumb.jpg    긴 변 400px, 라이트박스 썸네일과 카드 미리보기용
#
# 사용법:
#   ./scripts/optimize-images.sh            images/ 전체를 훑어 빠진 파생본만 생성
#   ./scripts/optimize-images.sh a.jpg b.png  지정한 원본만 변환
#
# 새 사진은 `images/archive-<연도>-<월>-<번호>.jpg` 규칙으로 넣고 스크립트를 실행한 뒤,
# `main.js`의 `archives` 배열에는 생성된 `-display` 경로를 적습니다.
# ImageMagick(magick)이 필요합니다.

set -euo pipefail

IMAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/images"
DISPLAY_EDGE=1800
DISPLAY_QUALITY=82
THUMB_EDGE=400
THUMB_QUALITY=72

if ! command -v magick >/dev/null 2>&1; then
  echo "magick(ImageMagick)을 찾을 수 없습니다." >&2
  exit 1
fi

# 텍스트가 담긴 공지 캡처는 JPEG 압축에서 글자가 뭉개지므로 PNG로 유지합니다.
target_extension() {
  case "$1" in
    *notice*) echo "png" ;;
    *) echo "jpg" ;;
  esac
}

# 원본보다 큰 이미지를 만들지 않도록 '>' 플래그로 축소만 수행합니다.
# PNG는 축소하면서 생긴 중간색 때문에 오히려 커지므로 팔레트로 양자화합니다.
render() {
  local source="$1" output="$2" edge="$3" quality="$4"
  local -a encode=()
  case "$output" in
    *.png) encode=(-colors 256 -define png:compression-level=9) ;;
    *) encode=(-quality "$quality") ;;
  esac
  magick "$source" -auto-orient -resize "${edge}x${edge}>" -strip "${encode[@]}" "$output"
  printf "  %-42s %s\n" "$(basename "$output")" "$(du -h "$output" | cut -f1)"
}

process() {
  local source="$1"
  local base extension display thumb
  base="$(basename "$source")"
  base="${base%.*}"
  extension="$(target_extension "$base")"
  display="$IMAGE_DIR/${base}-display.${extension}"
  thumb="$IMAGE_DIR/${base}-thumb.${extension}"

  echo "$base"
  [ -f "$display" ] || render "$source" "$display" "$DISPLAY_EDGE" "$DISPLAY_QUALITY"
  [ -f "$thumb" ] || render "$display" "$thumb" "$THUMB_EDGE" "$THUMB_QUALITY"
}

# 파생본이 이미 있는 -display 파일에는 짝이 되는 썸네일만 채웁니다.
backfill_thumb() {
  local display="$1"
  local thumb="${display/-display./-thumb.}"
  [ -f "$thumb" ] && return 0
  echo "$(basename "${display%-display.*}")"
  render "$display" "$thumb" "$THUMB_EDGE" "$THUMB_QUALITY"
}

if [ "$#" -gt 0 ]; then
  for source in "$@"; do
    process "$source"
  done
  exit 0
fi

shopt -s nullglob nocaseglob
for source in "$IMAGE_DIR"/*.jpg "$IMAGE_DIR"/*.jpeg "$IMAGE_DIR"/*.png; do
  case "$source" in
    *-display.*|*-thumb.*) continue ;;
  esac
  process "$source"
done

for display in "$IMAGE_DIR"/*-display.*; do
  backfill_thumb "$display"
done
