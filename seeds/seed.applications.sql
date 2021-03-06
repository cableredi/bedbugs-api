INSERT INTO applications (
  user_id,
  application_name, 
  application_url, 
  repository_prod, 
  repository_test,
  database_prod,
  database_test
)
VALUES (
  1,
  'Application 1', 
  'https://www.application1.com', 
  'https://github.com/application1',
  'https://github.com/applicationTest',
  'application1 prod db',
  'application1 test db'
),
(
  1,
  'Application 2', 
  'https://www.application2.com', 
  'https://github.com/company/application2',
  'https://github.com/company-test/application2',
  'application2 prod db',
  'application2 test db'
);