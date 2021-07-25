-- truncate

truncate table investor CASCADE;

-- drop
drop type IF EXISTS plan_status CASCADE;
drop type IF EXISTS auditlog_action CASCADE;
drop type IF EXISTS order_type CASCADE;
drop type IF EXISTS trade_status CASCADE;
drop schema IF EXISTS connected CASCADE;
drop table IF EXISTS exchange_coinbasepro CASCADE;

drop type if exists plan_freq cascade;
drop table IF EXISTS coinbasepro CASCADE ;
drop table IF EXISTS investor CASCADE ;
drop table IF EXISTS account CASCADE ;
drop table IF EXISTS account_balance CASCADE ;
drop table IF EXISTS trade CASCADE ;
drop table IF EXISTS auditlog CASCADE;

drop table IF EXISTS plan CASCADE;


-- create update function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create schemas


--create schema IF NOT EXISTS connected ;
-- create
CREATE TYPE "plan_status" AS ENUM (
  'Disabled',
  'Enabled'
);

CREATE TYPE "trade_status" AS ENUM (
  'Scheduled',
  'Sent',
  'Confirmed',
  'Canceled',
  'Complete',
  'Partial'
);


CREATE TYPE "order_type" AS ENUM (
  'Market',
  'Limit'
);

CREATE TYPE "auditlog_action" AS ENUM (
  'create_investor',
  'update_investor',
  'create_account',
  'update_account',
  'create_plan',
  'update_plan'
);

CREATE TABLE "investor" (
  "id" uuid PRIMARY KEY,
  "email" varchar UNIQUE,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "account" (
  "id" uuid PRIMARY KEY,
  "investor_id" uuid NOT NULL UNIQUE,
  "exchange" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "account_balance" (
  "id" uuid PRIMARY KEY,
  "investor_id" uuid,
  "account_id" uuid,
  "currency" varchar NOT NULL,
  "balance" numeric(1000,0) NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "exchange_coinbasepro" (
  "id" uuid PRIMARY KEY,
  "account_id" uuid NOT NULL,
  "nickname" varchar NOT NULL,
  "key" varchar NOT NULL,
  "passphrase" varchar NOT NULL,
  "secret" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "plan" (
  "id" uuid PRIMARY KEY,
  "account_id" uuid NOT NULL UNIQUE,
  "status" plan_status NOT NULL,
  "frequency" integer NOT NULL,
  "amount" numeric(1000,0) NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "trade" (
  "id" uuid PRIMARY KEY,
  "plan" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "currency_pair" varchar NOT NULL,
  "order_type" order_type NOT NULL,
  "price" numeric(1000,0),
  "quantity" numeric(1000,0),
  "trade_status" trade_status NOT NULL,
  "exchange" varchar,
  "exchange_status" varchar,
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "auditlog" (
  "id" uuid PRIMARY KEY,
  "investor_id" uuid,
  "account_id" uuid,
  "action" auditlog_action NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE "account" ADD FOREIGN KEY ("investor_id") REFERENCES "investor" ("id");

ALTER TABLE "account_balance" ADD FOREIGN KEY ("investor_id") REFERENCES "investor" ("id");

ALTER TABLE "account_balance" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "exchange_coinbasepro" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "plan" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "trade" ADD FOREIGN KEY ("plan") REFERENCES "plan" ("id");

ALTER TABLE "trade" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "auditlog" ADD FOREIGN KEY ("investor_id") REFERENCES "investor" ("id");

ALTER TABLE "auditlog" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

CREATE INDEX "unique_account_currency" ON "account_balance" ("account_id", "currency");

CREATE UNIQUE INDEX ON "account_balance" ("id");

COMMENT ON COLUMN "account"."exchange" IS 'Financial exchange or brokerage';

COMMENT ON COLUMN "plan"."frequency" IS 'in minutes';

-- update triggers

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON account
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON account_balance
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON investor
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON plan
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON trade
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON exchange_coinbasepro
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
