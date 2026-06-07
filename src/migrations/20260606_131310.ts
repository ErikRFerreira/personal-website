import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_lens_block" ALTER COLUMN "eyebrow" SET DEFAULT 'Visual Storytelling';
  ALTER TABLE "pages_blocks_lens_block" ALTER COLUMN "label" SET DEFAULT '01 — Lens';
  ALTER TABLE "_pages_v_blocks_lens_block" ALTER COLUMN "eyebrow" SET DEFAULT 'Visual Storytelling';
  ALTER TABLE "_pages_v_blocks_lens_block" ALTER COLUMN "label" SET DEFAULT '01 — Lens';
  ALTER TABLE "pages_blocks_lens_block" ADD COLUMN "intro" varchar DEFAULT 'A curated selection of moments frozen in time, spanning architectural geometry, natural landscapes, and the silent depths of the ocean.';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "eyebrow" varchar DEFAULT 'THE ARCHITECT & THE EXPLORER';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "headline_line_one" varchar DEFAULT 'Precision in code.';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "headline_line_two" varchar DEFAULT 'Calm in the deep.';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "portrait_id" integer;
  ALTER TABLE "_pages_v_blocks_lens_block" ADD COLUMN "intro" varchar DEFAULT 'A curated selection of moments frozen in time, spanning architectural geometry, natural landscapes, and the silent depths of the ocean.';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "eyebrow" varchar DEFAULT 'THE ARCHITECT & THE EXPLORER';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "headline_line_one" varchar DEFAULT 'Precision in code.';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "headline_line_two" varchar DEFAULT 'Calm in the deep.';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "portrait_id" integer;
  ALTER TABLE "projects_metrics" ADD CONSTRAINT "projects_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_metrics_order_idx" ON "projects_metrics" USING btree ("_order");
  CREATE INDEX "projects_metrics_parent_id_idx" ON "projects_metrics" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_about_intro" ADD CONSTRAINT "pages_blocks_about_intro_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD CONSTRAINT "_pages_v_blocks_about_intro_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_about_intro_portrait_idx" ON "pages_blocks_about_intro" USING btree ("portrait_id");
  CREATE INDEX "_pages_v_blocks_about_intro_portrait_idx" ON "_pages_v_blocks_about_intro" USING btree ("portrait_id");
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "bio_page_link_type";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "bio_page_link_new_tab";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "bio_page_link_url";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "bio_page_link_label";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_heading";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_description";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_link_type";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_link_new_tab";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_link_url";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "cta_link_label";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "bio_page_link_type";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "bio_page_link_new_tab";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "bio_page_link_url";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "bio_page_link_label";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_heading";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_description";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_link_type";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_link_new_tab";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_link_url";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "cta_link_label";
  DROP TYPE "public"."enum_pages_blocks_about_intro_bio_page_link_type";
  DROP TYPE "public"."enum_pages_blocks_about_intro_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_intro_bio_page_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_intro_cta_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_about_intro_bio_page_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_about_intro_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_about_intro_bio_page_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_about_intro_cta_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "projects_metrics" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_metrics" CASCADE;
  ALTER TABLE "pages_blocks_about_intro" DROP CONSTRAINT "pages_blocks_about_intro_portrait_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_about_intro" DROP CONSTRAINT "_pages_v_blocks_about_intro_portrait_id_media_id_fk";
  
  DROP INDEX "pages_blocks_about_intro_portrait_idx";
  DROP INDEX "_pages_v_blocks_about_intro_portrait_idx";
  ALTER TABLE "pages_blocks_lens_block" ALTER COLUMN "eyebrow" SET DEFAULT '02 — Lens';
  ALTER TABLE "pages_blocks_lens_block" ALTER COLUMN "label" SET DEFAULT 'Visual Diary';
  ALTER TABLE "_pages_v_blocks_lens_block" ALTER COLUMN "eyebrow" SET DEFAULT '02 — Lens';
  ALTER TABLE "_pages_v_blocks_lens_block" ALTER COLUMN "label" SET DEFAULT 'Visual Diary';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "heading" varchar DEFAULT 'The Intersection of Logic & Art';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "bio_page_link_type" "enum_pages_blocks_about_intro_bio_page_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "bio_page_link_new_tab" boolean;
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "bio_page_link_url" varchar;
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "bio_page_link_label" varchar;
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_heading" varchar DEFAULT 'Let''s build something.';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_description" varchar DEFAULT 'Currently open for new senior development roles and select freelance engineering projects.';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_link_type" "enum_pages_blocks_about_intro_cta_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_link_new_tab" boolean;
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_link_url" varchar;
  ALTER TABLE "pages_blocks_about_intro" ADD COLUMN "cta_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "heading" varchar DEFAULT 'The Intersection of Logic & Art';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "bio_page_link_type" "enum__pages_v_blocks_about_intro_bio_page_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "bio_page_link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "bio_page_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "bio_page_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_heading" varchar DEFAULT 'Let''s build something.';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_description" varchar DEFAULT 'Currently open for new senior development roles and select freelance engineering projects.';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_link_type" "enum__pages_v_blocks_about_intro_cta_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD COLUMN "cta_link_label" varchar;
  ALTER TABLE "pages_blocks_lens_block" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "headline_line_one";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "headline_line_two";
  ALTER TABLE "pages_blocks_about_intro" DROP COLUMN "portrait_id";
  ALTER TABLE "_pages_v_blocks_lens_block" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "headline_line_one";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "headline_line_two";
  ALTER TABLE "_pages_v_blocks_about_intro" DROP COLUMN "portrait_id";`)
}
