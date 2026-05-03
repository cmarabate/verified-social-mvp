-- 003_extend_verification_status_enum.sql
-- Purpose: Ensure verification_status enum includes Stripe's "processing" value
-- Dependencies: 001_initial_schema.sql already applied at least once
-- Notes: ALTER TYPE ADD VALUE may not be permitted inside a transaction block in some Postgres versions
-- Rollback: Not supported for enum values (Postgres does not support removing enum values)

alter type verification_status add value if not exists 'processing';

-- Verification
select enumlabel
from pg_enum
join pg_type on pg_enum.enumtypid = pg_type.oid
where pg_type.typname = 'verification_status'
order by enumsortorder;
