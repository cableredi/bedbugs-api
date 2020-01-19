CREATE TABLE applications (
  application_id SERIAL PRIMARY KEY,
  application_name TEXT NOT NULL,
  application_url TEXT NOT NULL,
  repository_prod TEXT NULL,
  repository_test TEXT NULL,
  database_prod TEXT NULL,
  database_test TEXT NULL
);