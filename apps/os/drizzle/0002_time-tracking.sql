CREATE TABLE "calendar_sync_state" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"calendar_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_error" text,
	"synced_until" timestamp with time zone,
	"last_full_sync_at" timestamp with time zone,
	"last_synced_at" timestamp with time zone,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"calendar_id" text NOT NULL,
	"google_event_id" text NOT NULL,
	"google_recurring_event_id" text,
	"google_ical_uid" text,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"attendees" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"time_zone" text,
	"html_link" text,
	"google_status" text NOT NULL,
	"google_updated_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_sync_state" ADD CONSTRAINT "calendar_sync_state_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_sync_state" ADD CONSTRAINT "calendar_sync_state_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "calendar_sync_state_user_calendar_idx" ON "calendar_sync_state" USING btree ("user_id","calendar_id");--> statement-breakpoint
CREATE UNIQUE INDEX "time_entry_user_calendar_event_idx" ON "time_entry" USING btree ("user_id","calendar_id","google_event_id");--> statement-breakpoint
CREATE INDEX "time_entry_user_start_idx" ON "time_entry" USING btree ("user_id","start_at");--> statement-breakpoint
CREATE INDEX "time_entry_user_recurring_idx" ON "time_entry" USING btree ("user_id","google_recurring_event_id");