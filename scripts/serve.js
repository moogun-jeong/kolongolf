// 의존성 없는 정적 미리보기 서버입니다.
// Firebase Studio에서는 `python3 -m http.server`를 썼지만 Replit 환경에는 python3가 없어
// Node 기본 모듈만으로 같은 역할을 합니다. Cloudflare Functions(/api)까지 함께 띄우려면
// `npm run dev`(wrangler pages dev)를 사용하세요.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2"
};

const sendError = (response, status, message) => {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
};

const server = http.createServer((request, response) => {
  // `?v=20260809-1` 같은 캐시 버전 쿼리를 떼어내고 경로만 해석합니다.
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath.endsWith("/") ? `${requestPath}index.html` : requestPath;
  const filePath = path.join(root, relativePath);

  // 심볼릭 링크나 `..`으로 저장소 밖 파일이 노출되지 않도록 막습니다.
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    sendError(response, 403, "403 Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendError(response, 404, "404 Not Found");
      return;
    }

    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "content-length": stats.size,
      "cache-control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  });
});

server.listen(port, host, () => {
  console.log(`Kolon Golf Society preview: http://${host}:${port}`);
});
