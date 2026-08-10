const privateRootPaths = new Set([
  "/.gitignore",
  "/.replit",
  "/AGENTS.md",
  "/FINAL_IMPROVEMENT_PLAN.md",
  "/GEMINI.md",
  "/HOMEPAGE_REVIEW.md",
  "/PRIORITY_IMPROVEMENT_PLAN.md",
  "/PROJECT_LOG.md",
  "/README.md",
  "/REPLIT_MIGRATION_AUDIT.md",
  "/TASK.md",
  "/_headers",
  "/_routes.json",
  "/blueprint.md",
  "/home1.png",
  "/home2.png",
  "/home_redisign.md",
  "/image.png",
  "/kolongolf",
  "/mobile1.png",
  "/notice.png",
  "/package-lock.json",
  "/package.json",
  "/wrangler.toml",
  "/images/20260704 MOV.mov",
  "/images/waacky.png"
]);

const privatePathPrefixes = [
  "/.github/",
  "/.idx/",
  "/.vscode/",
  "/functions/",
  "/lib/",
  "/migrations/",
  "/scripts/",
  "/sql/"
];

const normalizePathname = (pathname) => {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
};

export const onRequest = async ({ request, next }) => {
  const pathname = normalizePathname(new URL(request.url).pathname);
  const isPrivate =
    privateRootPaths.has(pathname) ||
    privatePathPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isPrivate) return next();

  return new Response("404 Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    }
  });
};
