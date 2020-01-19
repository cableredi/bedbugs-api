CREATE TYPE priority_values AS ENUM (
  'High', 'Medium', 'Low'
);

CREATE TYPE status_values AS ENUM (
  'Open', 'In-Progress', 'Closed'
);

CREATE TABLE bugs (
  bug_id SERIAL PRIMARY KEY,
  bug_name TEXT NOT NULL,
  application_id INTEGER REFERENCES applications(application_id) ON DELETE CASCADE NOT NULL,
  ticket_number TEXT NOT NULL,
  priority priority_values NOT NULL,
  status status_values NOT NULL,
  environment TEXT  NULL,
  notes TEXT  NULL,
  reported_by TEXT NULL,
  reported_on TIMESTAMP NOT NULL DEFAULT now(),
  expected_result TEXT NULL,
  actual_result TEXT NULL,
  developer TEXT NULL,
  developer_notes TEXT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT now()
);