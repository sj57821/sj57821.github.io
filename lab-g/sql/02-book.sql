CREATE TABLE books (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       title TEXT NOT NULL,
                       author TEXT NOT NULL,
                       year INTEGER NOT NULL,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);