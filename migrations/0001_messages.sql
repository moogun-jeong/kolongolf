CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('guestbook', 'archive_comment')),
  archive_id TEXT,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'pending')),
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_messages_guestbook
ON messages (type, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_archive
ON messages (archive_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_rate_limit
ON messages (ip_hash, created_at DESC);
