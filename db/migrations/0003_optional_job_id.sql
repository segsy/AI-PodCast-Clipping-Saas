-- Make job_id optional in clips table
ALTER TABLE clips ALTER COLUMN job_id DROP NOT NULL;

