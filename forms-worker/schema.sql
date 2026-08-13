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
  guests INTEGER NOT NULL, -- adults + children combined
  adults INTEGER,
  children INTEGER NOT NULL DEFAULT 0,
  children_ages TEXT, -- JSON array of ages 0-17, e.g. "[5,9]"; NULL when children = 0
  extra_breakfast INTEGER NOT NULL DEFAULT 0,
  extra_ebike INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  message TEXT,
  locale TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  is_spam INTEGER NOT NULL DEFAULT 0,
  cf_country TEXT,
  token TEXT -- random id used in the on-demand /translate/:token link (not the sequential `id`, so the link can't be guessed by incrementing a number)
);

CREATE UNIQUE INDEX idx_submissions_token ON submissions(token);

CREATE INDEX idx_submissions_created_at ON submissions(created_at);
