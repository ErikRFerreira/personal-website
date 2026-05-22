import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_form_block_layout" AS ENUM('default', 'contact');
  CREATE TYPE "public"."enum_pages_blocks_about_intro_bio_page_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_about_intro_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_layout" AS ENUM('default', 'contact');
  CREATE TYPE "public"."enum__pages_v_blocks_about_intro_bio_page_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_about_intro_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_lens_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_form_block_quick_access_card_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_about_intro_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_about_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The Intersection of Logic & Art',
  	"bio" varchar,
  	"bio_second_paragraph" varchar,
  	"bio_page_link_type" "enum_pages_blocks_about_intro_bio_page_link_type" DEFAULT 'reference',
  	"bio_page_link_new_tab" boolean,
  	"bio_page_link_url" varchar,
  	"bio_page_link_label" varchar,
  	"cta_heading" varchar DEFAULT 'Let''s build something.',
  	"cta_description" varchar DEFAULT 'Currently open for new senior development roles and select freelance engineering projects.',
  	"cta_link_type" "enum_pages_blocks_about_intro_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block_quick_access_card_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The Intersection of Logic & Art',
  	"bio" varchar,
  	"bio_second_paragraph" varchar,
  	"bio_page_link_type" "enum__pages_v_blocks_about_intro_bio_page_link_type" DEFAULT 'reference',
  	"bio_page_link_new_tab" boolean,
  	"bio_page_link_url" varchar,
  	"bio_page_link_label" varchar,
  	"cta_heading" varchar DEFAULT 'Let''s build something.',
  	"cta_description" varchar DEFAULT 'Currently open for new senior development roles and select freelance engineering projects.',
  	"cta_link_type" "enum__pages_v_blocks_about_intro_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "lens_print_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" varchar NOT NULL,
  	"material" varchar,
  	"price" numeric
  );
  
  CREATE TABLE "lens_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"lens_id" integer
  );
  
  CREATE TABLE "series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"cover_image_id" integer,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "layout" "enum_pages_blocks_form_block_layout" DEFAULT 'default';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "intro_text" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_name" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_job_title" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_email" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_location" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_avatar_id" integer;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "quick_access_card_response_time" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "layout" "enum__pages_v_blocks_form_block_layout" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "intro_text" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_name" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_job_title" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_email" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_location" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_avatar_id" integer;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "quick_access_card_response_time" varchar;
  ALTER TABLE "lens" ADD COLUMN "series" varchar;
  ALTER TABLE "lens" ADD COLUMN "intro" varchar;
  ALTER TABLE "lens" ADD COLUMN "full_story" jsonb;
  ALTER TABLE "lens" ADD COLUMN "location" varchar;
  ALTER TABLE "lens" ADD COLUMN "year" numeric;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_camera" varchar;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_lens" varchar;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_aperture" varchar;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_shutter_speed" varchar;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_iso" numeric;
  ALTER TABLE "lens" ADD COLUMN "technical_metadata_focal_length" varchar;
  ALTER TABLE "lens" ADD COLUMN "licensing_text" varchar;
  ALTER TABLE "lens" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "lens" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "lens" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "lens" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "lens" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "lens" ADD COLUMN "status" "enum_lens_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "search_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "lens_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "series_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "series_id" integer;
  ALTER TABLE "pages_blocks_form_block_quick_access_card_tags" ADD CONSTRAINT "pages_blocks_form_block_quick_access_card_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_social_links" ADD CONSTRAINT "pages_blocks_about_intro_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro" ADD CONSTRAINT "pages_blocks_about_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_quick_access_card_tags" ADD CONSTRAINT "_pages_v_blocks_form_block_quick_access_card_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_social_links" ADD CONSTRAINT "_pages_v_blocks_about_intro_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro" ADD CONSTRAINT "_pages_v_blocks_about_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lens_print_options" ADD CONSTRAINT "lens_print_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lens_rels" ADD CONSTRAINT "lens_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lens_rels" ADD CONSTRAINT "lens_rels_lens_fk" FOREIGN KEY ("lens_id") REFERENCES "public"."lens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_form_block_quick_access_card_tags_order_idx" ON "pages_blocks_form_block_quick_access_card_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_quick_access_card_tags_parent_id_idx" ON "pages_blocks_form_block_quick_access_card_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_social_links_order_idx" ON "pages_blocks_about_intro_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_social_links_parent_id_idx" ON "pages_blocks_about_intro_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_order_idx" ON "pages_blocks_about_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_parent_id_idx" ON "pages_blocks_about_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_path_idx" ON "pages_blocks_about_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_quick_access_card_tags_order_idx" ON "_pages_v_blocks_form_block_quick_access_card_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_quick_access_card_tags_parent_id_idx" ON "_pages_v_blocks_form_block_quick_access_card_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_social_links_order_idx" ON "_pages_v_blocks_about_intro_social_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_social_links_parent_id_idx" ON "_pages_v_blocks_about_intro_social_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_order_idx" ON "_pages_v_blocks_about_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_parent_id_idx" ON "_pages_v_blocks_about_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_path_idx" ON "_pages_v_blocks_about_intro" USING btree ("_path");
  CREATE INDEX "lens_print_options_order_idx" ON "lens_print_options" USING btree ("_order");
  CREATE INDEX "lens_print_options_parent_id_idx" ON "lens_print_options" USING btree ("_parent_id");
  CREATE INDEX "lens_rels_order_idx" ON "lens_rels" USING btree ("order");
  CREATE INDEX "lens_rels_parent_idx" ON "lens_rels" USING btree ("parent_id");
  CREATE INDEX "lens_rels_path_idx" ON "lens_rels" USING btree ("path");
  CREATE INDEX "lens_rels_lens_id_idx" ON "lens_rels" USING btree ("lens_id");
  CREATE INDEX "series_cover_image_idx" ON "series" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "series_slug_idx" ON "series" USING btree ("slug");
  CREATE INDEX "series_updated_at_idx" ON "series" USING btree ("updated_at");
  CREATE INDEX "series_created_at_idx" ON "series" USING btree ("created_at");
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_quick_access_card_avatar_id_media_id_fk" FOREIGN KEY ("quick_access_card_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_quick_access_card_avatar_id_media_id_fk" FOREIGN KEY ("quick_access_card_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lens" ADD CONSTRAINT "lens_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_lens_fk" FOREIGN KEY ("lens_id") REFERENCES "public"."lens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_form_block_quick_access_card_quick_access_c_idx" ON "pages_blocks_form_block" USING btree ("quick_access_card_avatar_id");
  CREATE INDEX "_pages_v_blocks_form_block_quick_access_card_quick_acces_idx" ON "_pages_v_blocks_form_block" USING btree ("quick_access_card_avatar_id");
  CREATE INDEX "lens_meta_meta_image_idx" ON "lens" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "lens_slug_idx" ON "lens" USING btree ("slug");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_lens_id_idx" ON "search_rels" USING btree ("lens_id");
  CREATE INDEX "search_rels_series_id_idx" ON "search_rels" USING btree ("series_id");
  CREATE INDEX "search_rels_projects_id_idx" ON "search_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_series_id_idx" ON "payload_locked_documents_rels" USING btree ("series_id");
  ALTER TABLE "lens" DROP COLUMN "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_form_block_quick_access_card_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_intro_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block_quick_access_card_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_intro_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lens_print_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lens_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "series" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_form_block_quick_access_card_tags" CASCADE;
  DROP TABLE "pages_blocks_about_intro_social_links" CASCADE;
  DROP TABLE "pages_blocks_about_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_quick_access_card_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro_social_links" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro" CASCADE;
  DROP TABLE "lens_print_options" CASCADE;
  DROP TABLE "lens_rels" CASCADE;
  DROP TABLE "series" CASCADE;
  ALTER TABLE "pages_blocks_form_block" DROP CONSTRAINT "pages_blocks_form_block_quick_access_card_avatar_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_form_block" DROP CONSTRAINT "_pages_v_blocks_form_block_quick_access_card_avatar_id_media_id_fk";
  
  ALTER TABLE "lens" DROP CONSTRAINT "lens_meta_image_id_media_id_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_pages_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_lens_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_series_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_series_fk";
  
  DROP INDEX "pages_blocks_form_block_quick_access_card_quick_access_c_idx";
  DROP INDEX "_pages_v_blocks_form_block_quick_access_card_quick_acces_idx";
  DROP INDEX "lens_meta_meta_image_idx";
  DROP INDEX "lens_slug_idx";
  DROP INDEX "search_rels_pages_id_idx";
  DROP INDEX "search_rels_lens_id_idx";
  DROP INDEX "search_rels_series_id_idx";
  DROP INDEX "search_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_series_id_idx";
  ALTER TABLE "lens" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "intro_text";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_name";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_job_title";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_email";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_location";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_avatar_id";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "quick_access_card_response_time";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "intro_text";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_name";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_job_title";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_email";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_location";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_avatar_id";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "quick_access_card_response_time";
  ALTER TABLE "lens" DROP COLUMN "series";
  ALTER TABLE "lens" DROP COLUMN "intro";
  ALTER TABLE "lens" DROP COLUMN "full_story";
  ALTER TABLE "lens" DROP COLUMN "location";
  ALTER TABLE "lens" DROP COLUMN "year";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_camera";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_lens";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_aperture";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_shutter_speed";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_iso";
  ALTER TABLE "lens" DROP COLUMN "technical_metadata_focal_length";
  ALTER TABLE "lens" DROP COLUMN "licensing_text";
  ALTER TABLE "lens" DROP COLUMN "meta_title";
  ALTER TABLE "lens" DROP COLUMN "meta_image_id";
  ALTER TABLE "lens" DROP COLUMN "meta_description";
  ALTER TABLE "lens" DROP COLUMN "generate_slug";
  ALTER TABLE "lens" DROP COLUMN "slug";
  ALTER TABLE "lens" DROP COLUMN "status";
  ALTER TABLE "search_rels" DROP COLUMN "pages_id";
  ALTER TABLE "search_rels" DROP COLUMN "lens_id";
  ALTER TABLE "search_rels" DROP COLUMN "series_id";
  ALTER TABLE "search_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "series_id";
  DROP TYPE "public"."enum_pages_blocks_form_block_layout";
  DROP TYPE "public"."enum_pages_blocks_about_intro_bio_page_link_type";
  DROP TYPE "public"."enum_pages_blocks_about_intro_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_about_intro_bio_page_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_intro_cta_link_type";
  DROP TYPE "public"."enum_lens_status";`)
}
