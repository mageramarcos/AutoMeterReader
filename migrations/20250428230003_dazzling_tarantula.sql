CREATE TYPE "public"."measure_type" AS ENUM('WATER', 'GAS');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meter_readings" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_code" text NOT NULL,
	"measure_uuid" text NOT NULL,
	"measure_value" integer NOT NULL,
	"measure_datetime" timestamp NOT NULL,
	"measure_type" "measure_type" NOT NULL,
	"has_confirmed" boolean DEFAULT false NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meter_readings_customer_code_key" ON "meter_readings" USING btree ("customer_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meter_readings_measure_uuid_key" ON "meter_readings" USING btree ("measure_uuid");