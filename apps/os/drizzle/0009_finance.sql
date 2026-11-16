CREATE TABLE "invoice" (
	"id" text PRIMARY KEY NOT NULL,
	"sevdesk_id" text NOT NULL,
	"kind" text NOT NULL,
	"number" text,
	"sevdesk_contact_id" text,
	"contact_name" text NOT NULL,
	"subject" text,
	"invoice_date" date NOT NULL,
	"due_date" date,
	"paid_at" date,
	"status" text NOT NULL,
	"original_invoice_id" text,
	"currency" text NOT NULL,
	"net_cents" integer NOT NULL,
	"gross_cents" integer NOT NULL,
	"net_eur_cents" integer NOT NULL,
	"gross_eur_cents" integer NOT NULL,
	"paid_eur_cents" integer DEFAULT 0 NOT NULL,
	"sevdesk_updated_at" timestamp with time zone,
	"synced_at" timestamp with time zone NOT NULL,
	CONSTRAINT "invoice_kind" CHECK ("invoice"."kind" IN ('invoice', 'cancellation', 'credit_note')),
	CONSTRAINT "invoice_status" CHECK ("invoice"."status" IN ('draft', 'open', 'partially_paid', 'paid', 'cancelled'))
);
--> statement-breakpoint
CREATE TABLE "sevdesk_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_number" text,
	"name" text NOT NULL,
	"synced_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sevdesk_sync_state" (
	"id" text PRIMARY KEY NOT NULL,
	"locked_until" timestamp with time zone,
	"last_synced_at" timestamp with time zone,
	"last_error" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "sevdesk_contact_id" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_sevdesk_contact_id_sevdesk_contact_id_fk" FOREIGN KEY ("sevdesk_contact_id") REFERENCES "public"."sevdesk_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invoice_date_idx" ON "invoice" USING btree ("invoice_date");--> statement-breakpoint
CREATE INDEX "invoice_contact_date_idx" ON "invoice" USING btree ("sevdesk_contact_id","invoice_date");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "invoice" USING btree ("status");--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_sevdesk_contact_id_sevdesk_contact_id_fk" FOREIGN KEY ("sevdesk_contact_id") REFERENCES "public"."sevdesk_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_sevdesk_contact_id_unique" UNIQUE("sevdesk_contact_id");