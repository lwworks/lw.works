CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'planning' NOT NULL,
	"start_date" date,
	"end_date" date,
	"company_id" text NOT NULL,
	"billing" text NOT NULL,
	"hourly_rate_cents" integer,
	"fixed_price_cents" integer,
	"retainer_amount_cents" integer,
	"retainer_hours" integer,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_key_format" CHECK ("project"."key" ~ '^[A-Z][A-Z0-9]{1,5}$'),
	CONSTRAINT "project_status" CHECK ("project"."status" IN ('planning', 'active', 'completed')),
	CONSTRAINT "project_dates" CHECK ("project"."start_date" IS NULL OR "project"."end_date" IS NULL OR "project"."end_date" >= "project"."start_date"),
	CONSTRAINT "project_billing_fields" CHECK (("project"."billing" = 'hourly' AND "project"."hourly_rate_cents" IS NOT NULL AND "project"."fixed_price_cents" IS NULL AND "project"."retainer_amount_cents" IS NULL AND "project"."retainer_hours" IS NULL)
        OR ("project"."billing" = 'fixed' AND "project"."fixed_price_cents" IS NOT NULL AND "project"."hourly_rate_cents" IS NULL AND "project"."retainer_amount_cents" IS NULL AND "project"."retainer_hours" IS NULL)
        OR ("project"."billing" = 'retainer' AND "project"."retainer_amount_cents" IS NOT NULL AND "project"."retainer_hours" IS NOT NULL AND "project"."hourly_rate_cents" IS NULL AND "project"."fixed_price_cents" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "project_contact" (
	"project_id" text NOT NULL,
	"contact_id" text NOT NULL,
	CONSTRAINT "project_contact_project_id_contact_id_pk" PRIMARY KEY("project_id","contact_id")
);
--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "project_id" text;--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "project_assignment" text;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_contact" ADD CONSTRAINT "project_contact_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_contact" ADD CONSTRAINT "project_contact_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_active_key_idx" ON "project" USING btree ("key") WHERE "project"."archived_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "project_slug_idx" ON "project" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "project_company_idx" ON "project" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "project_contact_contact_idx" ON "project_contact" USING btree ("contact_id");--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "time_entry_project_idx" ON "time_entry" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_project_assignment" CHECK ("time_entry"."project_assignment" IS NULL OR "time_entry"."project_assignment" IN ('auto', 'manual'));