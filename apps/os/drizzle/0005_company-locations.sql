CREATE TABLE "company_location" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"position" integer NOT NULL,
	"label" text,
	"street" text,
	"postal_code" text,
	"city" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_location" ADD CONSTRAINT "company_location_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_location_company_idx" ON "company_location" USING btree ("company_id","position");--> statement-breakpoint
-- Move each existing company address into its first location.
INSERT INTO "company_location" ("id", "company_id", "position", "street", "postal_code", "city", "country")
SELECT gen_random_uuid()::text, "id", 0, "street", "postal_code", "city", "country"
FROM "company"
WHERE coalesce("street", "postal_code", "city", "country") IS NOT NULL;--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN "street";--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN "country";