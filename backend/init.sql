-- drop
drop type IF EXISTS plan_status CASCADE;
drop type IF EXISTS auditlog_action CASCADE;
drop type IF EXISTS order_type CASCADE;
drop type IF EXISTS trade_status CASCADE;
drop schema IF EXISTS connected CASCADE;

drop table IF EXISTS coinbasepro CASCADE ;
drop table IF EXISTS investor CASCADE ;
drop table IF EXISTS account_balance CASCADE ;
drop table IF EXISTS trade CASCADE ;
drop table IF EXISTS auditlog CASCADE;

drop table IF EXISTS investmentplan CASCADE;

-- create schemas

create schema IF NOT EXISTS connected ;
-- create


CREATE TYPE "plan_status" AS ENUM (
  'Disabled',
  'Enabled'
);

CREATE TYPE "trade_status" AS ENUM (
  'Disabled',
  'Enabled'
);

CREATE TYPE "order_type" AS ENUM (
  'Market',
  'Limit'
);

CREATE TYPE "auditlog_action" AS ENUM (
  'create_user',
  'update_user',
  'create_account',
  'update_account',
  'create_investment_plan',
  'update_investment_plan'
);

CREATE TABLE "investor" (
  "id" uuid PRIMARY KEY,
  "email" varchar,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE "account" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "exchange" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE "account_balance" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "account_id" uuid,
  "currency" varchar NOT NULL,
  "balance" numeric(1000,0) NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE connected.coinbasepro (
  "id" uuid PRIMARY KEY,
  "account_id" uuid NOT NULL,
  "nickname" varchar NOT NULL,
  "passphrase" varchar NOT NULL,
  "secret" varchar NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE "investmentplan" (
  "id" uuid PRIMARY KEY,
  "account_id" uuid NOT NULL,
  "status" plan_status NOT NULL,
  "frequency" interval NOT NULL,
  "amount" numeric(1000,0) NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE "trade" (
  "id" uuid PRIMARY KEY,
  "investmentplan" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "currency_pair" varchar NOT NULL,
  "order_type" order_type NOT NULL,
  "price" numeric(1000,0),
  "quantity" numeric(1000,0),
  "trade_status" trade_status NOT NULL,
  "exchange" varchar,
  "exchange_status" varchar,
  "updated_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL
);

CREATE TABLE "auditlog" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "account_id" uuid,
  "action" auditlog_action NOT NULL,
  "created_at" timestamptz NOT NULL
);

ALTER TABLE "account" ADD FOREIGN KEY ("user_id") REFERENCES "investor" ("id");

ALTER TABLE "account_balance" ADD FOREIGN KEY ("user_id") REFERENCES "investor" ("id");

ALTER TABLE "account_balance" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE connected.coinbasepro ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "investmentplan" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "trade" ADD FOREIGN KEY ("investmentplan") REFERENCES "investmentplan" ("id");

ALTER TABLE "trade" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "auditlog" ADD FOREIGN KEY ("user_id") REFERENCES "investor" ("id");

ALTER TABLE "auditlog" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

CREATE INDEX "unique_account_currency" ON "account_balance" ("account_id", "currency");

CREATE UNIQUE INDEX ON "account_balance" ("id");

COMMENT ON COLUMN "account"."exchange" IS 'Financial exchange or brokerage';
