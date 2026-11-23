-- Plain-text descriptions become note documents: one paragraph per line, empty lines as empty paragraphs.
-- `USING` can't hold a subquery, so the conversion goes through a temporary column.
ALTER TABLE "project" ADD COLUMN "description_doc" jsonb;--> statement-breakpoint
UPDATE "project" SET "description_doc" = jsonb_build_object(
	'type', 'doc',
	'content', (
		SELECT jsonb_agg(
			CASE WHEN "line" = '' THEN jsonb_build_object('type', 'paragraph')
			ELSE jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', "line")))
			END ORDER BY "n"
		)
		FROM regexp_split_to_table(replace("project"."description", E'\r', ''), E'\n') WITH ORDINALITY AS "lines"("line", "n")
	)
)
WHERE "description" IS NOT NULL AND btrim("description") <> '';--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "description_doc" TO "description";
