CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"website" text,
	"street" text,
	"postal_code" text,
	"city" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" text PRIMARY KEY NOT NULL,
	"display_id" integer GENERATED ALWAYS AS IDENTITY (sequence name "contact_display_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"whats_app" text,
	"linked_in" text,
	"instagram" text,
	"x" text,
	"avatar_url" text,
	"birthday_month" integer,
	"birthday_day" integer,
	"birthday_year" integer,
	"is_private" boolean DEFAULT false NOT NULL,
	"company_id" text,
	"created_by_user_id" text NOT NULL,
	"deleted_at" timestamp with time zone,
	"synced_fields_edited_at" timestamp with time zone,
	"last_inbound_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contact_has_name" CHECK ("contact"."first_name" <> '' OR "contact"."last_name" <> ''),
	CONSTRAINT "contact_birthday_pair" CHECK (("contact"."birthday_month" IS NULL AND "contact"."birthday_day" IS NULL) OR ("contact"."birthday_month" IS NOT NULL AND "contact"."birthday_day" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "contact_google_link" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"google_resource_name" text,
	"etag" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_error" text,
	"last_pushed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_tag" (
	"contact_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "contact_tag_contact_id_tag_id_pk" PRIMARY KEY("contact_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_google_link" ADD CONSTRAINT "contact_google_link_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_google_link" ADD CONSTRAINT "contact_google_link_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_google_link" ADD CONSTRAINT "contact_google_link_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_tag" ADD CONSTRAINT "contact_tag_contact_id_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_tag" ADD CONSTRAINT "contact_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contact_display_id_idx" ON "contact" USING btree ("display_id");--> statement-breakpoint
CREATE INDEX "contact_company_idx" ON "contact" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contact_google_link_contact_account_idx" ON "contact_google_link" USING btree ("contact_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_name_lower_idx" ON "tag" USING btree (lower("name"));