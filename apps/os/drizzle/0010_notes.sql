CREATE TABLE "note" (
	"id" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"contact_id" text,
	"company_id" text,
	"project_id" text,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "note_single_owner" CHECK (num_nonnulls("note"."contact_id", "note"."company_id", "note"."project_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "note_contact_idx" ON "note" USING btree ("contact_id","created_at");--> statement-breakpoint
CREATE INDEX "note_company_idx" ON "note" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "note_project_idx" ON "note" USING btree ("project_id","created_at");