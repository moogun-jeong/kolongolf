PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('guestbook', 'archive_comment')),
  archive_id TEXT,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible'
    CHECK (status IN ('visible', 'hidden')),
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_guestbook
ON messages (type, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_archive
ON messages (archive_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_rate_limit
ON messages (ip_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS archive_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  label TEXT,
  location TEXT,
  people TEXT,
  summary TEXT NOT NULL,
  author_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'visible', 'hidden')),
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS archive_post_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  archive_post_id INTEGER NOT NULL,
  image_data_url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'visible'
    CHECK (status IN ('visible', 'hidden')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (archive_post_id)
    REFERENCES archive_posts(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_archive_posts_status_date
ON archive_posts (status, date DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_archive_post_images_post_order
ON archive_post_images (archive_post_id, sort_order);
