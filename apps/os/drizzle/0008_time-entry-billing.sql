DROP INDEX "time_entry_project_idx";--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "billed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "invoice_number" text;--> statement-breakpoint
CREATE INDEX "time_entry_project_idx" ON "time_entry" USING btree ("project_id","billed_at");