CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  checkin_display TEXT NOT NULL,
  checkin_iso TEXT NOT NULL,
  checkout_display TEXT NOT NULL,
  checkout_iso TEXT NOT NULL,
  guests INTEGER NOT NULL,
  extra_breakfast INTEGER NOT NULL DEFAULT 0,
  extra_ebike INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  message TEXT,
  locale TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  is_spam INTEGER NOT NULL DEFAULT 0,
  cf_country TEXT
);

CREATE INDEX idx_submissions_created_at ON submissions(created_at);
