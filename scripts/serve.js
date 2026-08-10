// 의존성 없는 정적 미리보기 서버입니다(`npm run preview:static`).
// `/api`까지 확인하려면 `npm start`(= `scripts/dev.js`, wrangler pages dev)를 쓰세요.
//
// 배포와 같은 파일만 보이도록 저장소 루트가 아니라 `dist/`를 서빙합니다.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "dist");
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
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
  if (response.headersSent) {
    response.end();
    return;
  }
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
};

// `?v=20260809-1` 같은 캐시 버전 쿼리를 떼고, 잘못된 퍼센트 인코딩에도 죽지 않게 합니다.
const resolveRequestPath = (request) => {
  try {
    const requestPath = decodeURIComponent(
      new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname
    );
    return requestPath.endsWith("/") ? `${requestPath}index.html` : requestPath;
  } catch {
    return null;
  }
};

const server = http.createServer((request, response) => {
  const relativePath = resolveRequestPath(request);
  if (relativePath === null) {
    sendError(response, 400, "400 Bad Request");
    return;
  }

  const filePath = path.join(root, relativePath);

  // 심볼릭 링크나 `..`으로 배포 폴더 밖 파일이 노출되지 않도록 막습니다.
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

// 요청 하나가 실패해도 미리보기 서버 전체가 내려가지 않도록 합니다.
server.on("clientError", (error, socket) => {
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
process.on("uncaughtException", (error) => {
  console.error("[preview] 요청 처리 중 오류가 발생했지만 서버는 계속 실행합니다.", error);
});

if (!fs.existsSync(root)) {
  console.error("[preview] dist/가 없습니다. 먼저 `npm run build`를 실행하세요.");
  process.exit(1);
}

server.listen(port, host, () => {
  console.log(`Kolon Golf Society preview(dist): http://${host}:${port}`);
});
