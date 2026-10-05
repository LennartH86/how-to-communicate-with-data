-- Survey pipeline for the live demo: Google Form -> Apps Script -> BigQuery -> Veezoo
-- Project demos-467314, dataset workshop (EU). Run once; idempotent.

CREATE SCHEMA IF NOT EXISTS `demos-467314.workshop` OPTIONS (location = 'EU');

-- The 13 Gapminder questions with their correct answers. Static reference table.
CREATE OR REPLACE TABLE `demos-467314.workshop.survey_questions` (
  question_no      INT64   NOT NULL OPTIONS (description = 'Position in the form, 1 to 13'),
  question_key     STRING  NOT NULL OPTIONS (description = 'Column name of the answer in survey_responses'),
  question_short   STRING  NOT NULL OPTIONS (description = 'Short label for charts'),
  question_text    STRING  NOT NULL OPTIONS (description = 'Full question text as in the form'),
  option_a         STRING  NOT NULL,
  option_b         STRING  NOT NULL,
  option_c         STRING  NOT NULL,
  correct_answer   STRING  NOT NULL OPTIONS (description = 'Exact option text that is correct')
);

INSERT INTO `demos-467314.workshop.survey_questions` VALUES
 (1,  'q01_girls_primary_school',     'Girls finishing primary school',  'In all low-income countries across the world today, how many girls finish primary school?', '20 percent', '40 percent', '60 percent', '60 percent'),
 (2,  'q02_population_income_level',  'Where most people live',          'Where does the majority of the world population live?', 'Low-income countries', 'Middle-income countries', 'High-income countries', 'Middle-income countries'),
 (3,  'q03_extreme_poverty_trend',    'Extreme poverty, last 20 years',  'In the last 20 years, the proportion of the world population living in extreme poverty has ...', 'almost doubled', 'remained more or less the same', 'almost halved', 'almost halved'),
 (4,  'q04_life_expectancy',          'World life expectancy',           'What is the life expectancy of the world today?', '50 years', '60 years', '70 years', '70 years'),
 (5,  'q05_children_2100',            'Children in 2100',                'There are 2 billion children in the world today, aged 0 to 15 years old. How many children will there be in the year 2100, according to the United Nations?', '4 billion', '3 billion', '2 billion', '2 billion'),
 (6,  'q06_population_growth_reason', 'Why population grows',            'The UN predicts that by 2100 the world population will have increased by another 4 billion people. What is the main reason?', 'There will be more children (age blow 15)', 'There will be more adults (age 15 to 74)', 'There will be more very old people (age 75 and older)', 'There will be more adults (age 15 to 74)'),
 (7,  'q07_disaster_deaths_trend',    'Deaths from natural disasters',   'How did the number of deaths per year from natural disasters change over the last hundred years?', 'More than doubled', 'Remained about the same', 'Decreased to less than half', 'Decreased to less than half'),
 (8,  'q08_population_by_continent',  'People per continent',            'There are roughly 7 billion (B) people in the world today. Where to they live?', '1B Africa, 1B Americas, 4B Asia, 1B Europe', '2B Africa, 1B Americas, 3B Asia, 1B Europe', '1B Africa, 2B Americas, 3B Asia, 1B Europe', '1B Africa, 1B Americas, 4B Asia, 1B Europe'),
 (9,  'q09_vaccinated_children',      'Vaccinated one-year-olds',        'How many of the world\'s 1-year-old children today have been vaccinated against some disease?', '20 percent', '50 percent', '80 percent', '80 percent'),
 (10, 'q10_women_years_in_school',    "Women's years in school",        'Worldwide, 30-year-old men have spent 10 years in school, on average. How many years have women of the same age spent in school?', '9 years', '6 years', '3 years', '9 years'),
 (11, 'q11_endangered_species',       'Endangered species since 1996',   'In 1996, tigers, giant pandas, and black rhinos were all listed as endangered. How many of these three species are more critically endangered today?', 'Two of them', 'One of them', 'None of them', 'None of them'),
 (12, 'q12_electricity_access',       'Access to electricity',           'How many people in the world have some access to electricity?', '20 percent', '50 percent', '80 percent', '80 percent'),
 (13, 'q13_climate_trend',            'Climate in 100 years',            'Global climate experts believe that, over the next 100 years, the average temperature will ...', 'get warmer', 'remain the same', 'get colder', 'get warmer');

-- One row per submitted form. Written by the Apps Script (streaming insert) and by the
-- one-off backfill of the old survey. Streaming rows cannot be deleted for ~90 minutes,
-- so sessions are separated by session_date instead of truncating.
CREATE TABLE IF NOT EXISTS `demos-467314.workshop.survey_responses` (
  response_id                  STRING    NOT NULL OPTIONS (description = 'Form response id, or backfill-<row>'),
  submitted_at                 TIMESTAMP NOT NULL,
  session_date                 DATE      NOT NULL OPTIONS (description = 'Day of the workshop; default filter in Veezoo'),
  source                       STRING    NOT NULL OPTIONS (description = 'apps_script or backfill'),
  q01_girls_primary_school     STRING,
  q02_population_income_level  STRING,
  q03_extreme_poverty_trend    STRING,
  q04_life_expectancy          STRING,
  q05_children_2100            STRING,
  q06_population_growth_reason STRING,
  q07_disaster_deaths_trend    STRING,
  q08_population_by_continent  STRING,
  q09_vaccinated_children      STRING,
  q10_women_years_in_school    STRING,
  q11_endangered_species       STRING,
  q12_electricity_access       STRING,
  q13_climate_trend            STRING
)
PARTITION BY session_date;

-- One row per response and question: what Veezoo models.
-- Concept "Answer" with Question, Session, Chosen option and the flag Correct.
CREATE OR REPLACE VIEW `demos-467314.workshop.survey_answers` AS
WITH long AS (
  SELECT r.response_id, r.submitted_at, r.session_date, r.source, q.question_no, q.question_key, q.question_short, q.question_text, q.correct_answer,
         CASE q.question_no
           WHEN 1  THEN r.q01_girls_primary_school
           WHEN 2  THEN r.q02_population_income_level
           WHEN 3  THEN r.q03_extreme_poverty_trend
           WHEN 4  THEN r.q04_life_expectancy
           WHEN 5  THEN r.q05_children_2100
           WHEN 6  THEN r.q06_population_growth_reason
           WHEN 7  THEN r.q07_disaster_deaths_trend
           WHEN 8  THEN r.q08_population_by_continent
           WHEN 9  THEN r.q09_vaccinated_children
           WHEN 10 THEN r.q10_women_years_in_school
           WHEN 11 THEN r.q11_endangered_species
           WHEN 12 THEN r.q12_electricity_access
           WHEN 13 THEN r.q13_climate_trend
         END AS chosen_answer
  FROM `demos-467314.workshop.survey_responses` r
  CROSS JOIN `demos-467314.workshop.survey_questions` q
)
SELECT *,
       chosen_answer IS NOT NULL AND TRIM(chosen_answer) = correct_answer AS is_correct,
       -- the chimpanzee picks one of three options at random
       1 / 3 AS chimpanzee_hit_rate
FROM long;
