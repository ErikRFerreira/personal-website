import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_initiate_project_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_initiate_project_cta_link_appearance" AS ENUM('default');
  CREATE TYPE "public"."enum__pages_v_blocks_initiate_project_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_initiate_project_cta_link_appearance" AS ENUM('default');
  CREATE TABLE "pages_blocks_initiate_project" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_text" varchar DEFAULT '@',
  	"heading" varchar DEFAULT 'Initiate Project.',
  	"description" varchar DEFAULT 'Available for technical leadership roles and specialized visual commissions. Let''s discuss architecture and aesthetics.',
  	"cta_label" varchar DEFAULT 'Get in touch',
  	"cta_link_type" "enum_pages_blocks_initiate_project_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_appearance" "enum_pages_blocks_initiate_project_cta_link_appearance" DEFAULT 'default',
  	"partnership_note" varchar DEFAULT 'ACCEPTING SELECT PARTNERSHIPS FOR 2024',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reveal_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"supporting_text" varchar DEFAULT 'Different tools. Same instinct for perspective.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_home_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'The Architect & The Explorer',
  	"name" varchar DEFAULT 'Erik Ferreira',
  	"roles" varchar DEFAULT 'Software Engineer · Scuba Instructor · Underwater Photographer',
  	"bio" varchar,
  	"portrait_id" integer,
  	"email" varchar,
  	"cta_label" varchar DEFAULT 'Get in touch',
  	"cta_url" varchar DEFAULT '/contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_initiate_project" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_text" varchar DEFAULT '@',
  	"heading" varchar DEFAULT 'Initiate Project.',
  	"description" varchar DEFAULT 'Available for technical leadership roles and specialized visual commissions. Let''s discuss architecture and aesthetics.',
  	"cta_label" varchar DEFAULT 'Get in touch',
  	"cta_link_type" "enum__pages_v_blocks_initiate_project_cta_link_type" DEFAULT 'reference',
  	"cta_link_new_tab" boolean,
  	"cta_link_url" varchar,
  	"cta_link_appearance" "enum__pages_v_blocks_initiate_project_cta_link_appearance" DEFAULT 'default',
  	"partnership_note" varchar DEFAULT 'ACCEPTING SELECT PARTNERSHIPS FOR 2024',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_reveal_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"supporting_text" varchar DEFAULT 'Different tools. Same instinct for perspective.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'The Architect & The Explorer',
  	"name" varchar DEFAULT 'Erik Ferreira',
  	"roles" varchar DEFAULT 'Software Engineer · Scuba Instructor · Underwater Photographer',
  	"bio" varchar,
  	"portrait_id" integer,
  	"email" varchar,
  	"cta_label" varchar DEFAULT 'Get in touch',
  	"cta_url" varchar DEFAULT '/contact',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "lens_rels" DROP CONSTRAINT "lens_rels_lens_fk";
  
  DROP INDEX "lens_rels_lens_id_idx";
  ALTER TABLE "pages_blocks_selected_projects" ADD COLUMN "intro" varchar DEFAULT 'A selection of coding projects that combine thoughtful design, robust engineering, and practical solutions to real-world problems.';
  ALTER TABLE "pages_blocks_capabilities" ADD COLUMN "intro" varchar DEFAULT 'From polished interfaces to robust backend systems, I build thoughtful, reliable digital products from end to end.';
  ALTER TABLE "_pages_v_blocks_selected_projects" ADD COLUMN "intro" varchar DEFAULT 'A selection of coding projects that combine thoughtful design, robust engineering, and practical solutions to real-world problems.';
  ALTER TABLE "_pages_v_blocks_capabilities" ADD COLUMN "intro" varchar DEFAULT 'From polished interfaces to robust backend systems, I build thoughtful, reliable digital products from end to end.';
  ALTER TABLE "lens" ADD COLUMN "series_id" integer;
  ALTER TABLE "lens_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "series" ADD COLUMN "generate_slug" boolean DEFAULT true;
  INSERT INTO "series" ("name", "slug", "updated_at", "created_at")
  SELECT source."name", source."slug", now(), now()
  FROM (
    SELECT DISTINCT ON (
      lower(
        trim(
          both '-' from regexp_replace(trim("series"), '[^a-zA-Z0-9]+', '-', 'g')
        )
      )
    )
      trim("series") AS "name",
      lower(
        trim(
          both '-' from regexp_replace(trim("series"), '[^a-zA-Z0-9]+', '-', 'g')
        )
      ) AS "slug"
    FROM "lens"
    WHERE nullif(trim("series"), '') IS NOT NULL
    ORDER BY
      lower(
        trim(
          both '-' from regexp_replace(trim("series"), '[^a-zA-Z0-9]+', '-', 'g')
        )
      ),
      "id"
  ) source
  WHERE source."slug" <> ''
  ON CONFLICT ("slug") DO NOTHING;

  UPDATE "lens" lens_document
  SET "series_id" = collection."id"
  FROM "series" collection
  WHERE nullif(trim(lens_document."series"), '') IS NOT NULL
    AND collection."slug" = lower(
      trim(
        both '-' from regexp_replace(trim(lens_document."series"), '[^a-zA-Z0-9]+', '-', 'g')
      )
    );

  DELETE FROM "lens_rels" WHERE "path" = 'relatedPhotos';
  ALTER TABLE "pages_blocks_initiate_project" ADD CONSTRAINT "pages_blocks_initiate_project_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reveal_text" ADD CONSTRAINT "pages_blocks_reveal_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bio" ADD CONSTRAINT "pages_blocks_home_bio_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bio" ADD CONSTRAINT "pages_blocks_home_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_initiate_project" ADD CONSTRAINT "_pages_v_blocks_initiate_project_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reveal_text" ADD CONSTRAINT "_pages_v_blocks_reveal_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bio" ADD CONSTRAINT "_pages_v_blocks_home_bio_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bio" ADD CONSTRAINT "_pages_v_blocks_home_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_initiate_project_order_idx" ON "pages_blocks_initiate_project" USING btree ("_order");
  CREATE INDEX "pages_blocks_initiate_project_parent_id_idx" ON "pages_blocks_initiate_project" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_initiate_project_path_idx" ON "pages_blocks_initiate_project" USING btree ("_path");
  CREATE INDEX "pages_blocks_reveal_text_order_idx" ON "pages_blocks_reveal_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_reveal_text_parent_id_idx" ON "pages_blocks_reveal_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reveal_text_path_idx" ON "pages_blocks_reveal_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_home_bio_order_idx" ON "pages_blocks_home_bio" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_bio_parent_id_idx" ON "pages_blocks_home_bio" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_bio_path_idx" ON "pages_blocks_home_bio" USING btree ("_path");
  CREATE INDEX "pages_blocks_home_bio_portrait_idx" ON "pages_blocks_home_bio" USING btree ("portrait_id");
  CREATE INDEX "_pages_v_blocks_initiate_project_order_idx" ON "_pages_v_blocks_initiate_project" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_initiate_project_parent_id_idx" ON "_pages_v_blocks_initiate_project" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_initiate_project_path_idx" ON "_pages_v_blocks_initiate_project" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_reveal_text_order_idx" ON "_pages_v_blocks_reveal_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_reveal_text_parent_id_idx" ON "_pages_v_blocks_reveal_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_reveal_text_path_idx" ON "_pages_v_blocks_reveal_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_bio_order_idx" ON "_pages_v_blocks_home_bio" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_bio_parent_id_idx" ON "_pages_v_blocks_home_bio" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bio_path_idx" ON "_pages_v_blocks_home_bio" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_bio_portrait_idx" ON "_pages_v_blocks_home_bio" USING btree ("portrait_id");
  ALTER TABLE "lens" ADD CONSTRAINT "lens_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lens_rels" ADD CONSTRAINT "lens_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lens_series_idx" ON "lens" USING btree ("series_id");
  CREATE INDEX "lens_rels_categories_id_idx" ON "lens_rels" USING btree ("categories_id");
  ALTER TABLE "lens" DROP COLUMN "series";
  ALTER TABLE "lens_rels" DROP COLUMN "lens_id";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_initiate_project" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_reveal_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_home_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_initiate_project" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_reveal_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_home_bio" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_initiate_project" CASCADE;
  DROP TABLE "pages_blocks_reveal_text" CASCADE;
  DROP TABLE "pages_blocks_home_bio" CASCADE;
  DROP TABLE "_pages_v_blocks_initiate_project" CASCADE;
  DROP TABLE "_pages_v_blocks_reveal_text" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bio" CASCADE;
  ALTER TABLE "lens" DROP CONSTRAINT "lens_series_id_series_id_fk";
  
  ALTER TABLE "lens_rels" DROP CONSTRAINT "lens_rels_categories_fk";
  
  DROP INDEX "lens_series_idx";
  DROP INDEX "lens_rels_categories_id_idx";
  ALTER TABLE "lens" ADD COLUMN "series" varchar;
  ALTER TABLE "lens_rels" ADD COLUMN "lens_id" integer;
  UPDATE "lens" lens_document
  SET "series" = collection."name"
  FROM "series" collection
  WHERE lens_document."series_id" = collection."id";
  ALTER TABLE "lens_rels" ADD CONSTRAINT "lens_rels_lens_fk" FOREIGN KEY ("lens_id") REFERENCES "public"."lens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lens_rels_lens_id_idx" ON "lens_rels" USING btree ("lens_id");
  ALTER TABLE "pages_blocks_selected_projects" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_capabilities" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_selected_projects" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_capabilities" DROP COLUMN "intro";
  ALTER TABLE "lens" DROP COLUMN "series_id";
  ALTER TABLE "lens_rels" DROP COLUMN "categories_id";
  ALTER TABLE "series" DROP COLUMN "generate_slug";
  DROP TYPE "public"."enum_pages_blocks_initiate_project_cta_link_type";
  DROP TYPE "public"."enum_pages_blocks_initiate_project_cta_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_initiate_project_cta_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_initiate_project_cta_link_appearance";`)
}
