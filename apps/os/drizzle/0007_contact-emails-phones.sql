ALTER TABLE "contact" ADD COLUMN "emails" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "phones" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
-- Move each existing email and phone into the new lists. The phone was pushed to Google as `mobile`, the email without a type.
UPDATE "contact" SET "emails" = jsonb_build_array(jsonb_build_object('value', "email", 'type', NULL)) WHERE "email" IS NOT NULL AND "email" <> '';--> statement-breakpoint
UPDATE "contact" SET "phones" = jsonb_build_array(jsonb_build_object('value', "phone", 'type', 'mobile')) WHERE "phone" IS NOT NULL AND "phone" <> '';--> statement-breakpoint
ALTER TABLE "contact" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "contact" DROP COLUMN "phone";
