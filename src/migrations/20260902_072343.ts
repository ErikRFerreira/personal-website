import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "hero_name" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_intro" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_name" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_intro" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_label" varchar;

  UPDATE "pages"
  SET
    "hero_name" = COALESCE("hero_headline", "hero_eyebrow"),
    "hero_intro" = COALESCE("hero_description", "hero_positioning_line", "hero_right_description")
  WHERE "hero_type" = 'portfolioHero';

  UPDATE "_pages_v"
  SET
    "version_hero_name" = COALESCE("version_hero_headline", "version_hero_eyebrow"),
    "version_hero_intro" = COALESCE("version_hero_description", "version_hero_positioning_line", "version_hero_right_description")
  WHERE "version_hero_type" = 'portfolioHero';

  WITH "about_profile" AS (
    SELECT
      "block"."name", "block"."intro", "block"."image_id", "block"."image_label"
    FROM "pages_blocks_about_hero" AS "block"
    INNER JOIN "pages" AS "source" ON "source"."id" = "block"."_parent_id"
    WHERE "source"."slug" = 'about'
    ORDER BY "block"."_order"
    LIMIT 1
  )
  UPDATE "pages" AS "target"
  SET
    "hero_name" = "about_profile"."name",
    "hero_intro" = "about_profile"."intro",
    "hero_media_id" = "about_profile"."image_id",
    "hero_image_label" = "about_profile"."image_label"
  FROM "about_profile"
  WHERE "target"."slug" IN ('home', 'about');

  WITH "about_profile" AS (
    SELECT
      "block"."name", "block"."intro", "block"."image_id", "block"."image_label"
    FROM "pages_blocks_about_hero" AS "block"
    INNER JOIN "pages" AS "source" ON "source"."id" = "block"."_parent_id"
    WHERE "source"."slug" = 'about'
    ORDER BY "block"."_order"
    LIMIT 1
  )
  UPDATE "_pages_v" AS "target"
  SET
    "version_hero_name" = "about_profile"."name",
    "version_hero_intro" = "about_profile"."intro",
    "version_hero_media_id" = "about_profile"."image_id",
    "version_hero_image_label" = "about_profile"."image_label"
  FROM "about_profile"
  WHERE "target"."version_slug" = 'home';

  WITH "version_about_profile" AS (
    SELECT DISTINCT ON ("_parent_id")
      "_parent_id", "name", "intro", "image_id", "image_label"
    FROM "_pages_v_blocks_about_hero"
    ORDER BY "_parent_id", "_order"
  )
  UPDATE "_pages_v" AS "target"
  SET
    "version_hero_name" = "version_about_profile"."name",
    "version_hero_intro" = "version_about_profile"."intro",
    "version_hero_media_id" = "version_about_profile"."image_id",
    "version_hero_image_label" = "version_about_profile"."image_label"
  FROM "version_about_profile"
  WHERE "target"."id" = "version_about_profile"."_parent_id"
    AND "target"."version_slug" = 'about';

  ALTER TABLE "pages_blocks_about_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_hero" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_about_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_about_hero" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_right_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_right_media_id_media_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  UPDATE "pages"
  SET "hero_type" = 'profileHero'
  WHERE "hero_type" = 'portfolioHero'
    OR ("slug" IN ('home', 'about') AND "hero_name" IS NOT NULL AND "hero_intro" IS NOT NULL);
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  UPDATE "_pages_v"
  SET "version_hero_type" = 'profileHero'
  WHERE "version_hero_type" = 'portfolioHero'
    OR ("version_slug" IN ('home', 'about') AND "version_hero_name" IS NOT NULL AND "version_hero_intro" IS NOT NULL);
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_right_media_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_right_media_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_headline";
  ALTER TABLE "pages" DROP COLUMN "hero_description";
  ALTER TABLE "pages" DROP COLUMN "hero_right_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_right_headline";
  ALTER TABLE "pages" DROP COLUMN "hero_right_description";
  ALTER TABLE "pages" DROP COLUMN "hero_positioning_line";
  ALTER TABLE "pages" DROP COLUMN "hero_video_url";
  ALTER TABLE "pages" DROP COLUMN "hero_right_media_id";
  ALTER TABLE "pages" DROP COLUMN "hero_right_video_url";
  ALTER TABLE "pages" DROP COLUMN "hero_scroll_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_headline";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_headline";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_positioning_line";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_video_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_media_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_video_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_scroll_label";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  INSERT INTO "pages_blocks_about_hero"
    ("_order", "_parent_id", "_path", "id", "name", "intro", "image_id", "image_label")
  SELECT
    0, "id", 'layout', 'profile-hero-' || "id"::text,
    "hero_name", "hero_intro", "hero_media_id", "hero_image_label"
  FROM "pages"
  WHERE "slug" = 'about' AND "hero_type" = 'profileHero';

  INSERT INTO "_pages_v_blocks_about_hero"
    ("_order", "_parent_id", "_path", "name", "intro", "image_id", "image_label", "_uuid")
  SELECT
    0, "id", 'layout', "version_hero_name", "version_hero_intro",
    "version_hero_media_id", "version_hero_image_label", md5('profile-hero-' || "id"::text)
  FROM "_pages_v"
  WHERE "version_slug" = 'about' AND "version_hero_type" = 'profileHero';
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  UPDATE "pages"
  SET "hero_type" = CASE WHEN "slug" = 'about' THEN 'none' ELSE 'portfolioHero' END
  WHERE "hero_type" = 'profileHero';
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'portfolioHero');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  UPDATE "_pages_v"
  SET "version_hero_type" = CASE WHEN "version_slug" = 'about' THEN 'none' ELSE 'portfolioHero' END
  WHERE "version_hero_type" = 'profileHero';
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'portfolioHero');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "pages" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_headline" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_right_eyebrow" varchar DEFAULT 'Software Engineer';
  ALTER TABLE "pages" ADD COLUMN "hero_right_headline" varchar DEFAULT 'Engineering Scale.';
  ALTER TABLE "pages" ADD COLUMN "hero_right_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_positioning_line" varchar DEFAULT 'Software engineering and visual storytelling shaped by depth, precision, and perspective.';
  ALTER TABLE "pages" ADD COLUMN "hero_video_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_right_media_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_right_video_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_scroll_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_headline" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_eyebrow" varchar DEFAULT 'Software Engineer';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_headline" varchar DEFAULT 'Engineering Scale.';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_positioning_line" varchar DEFAULT 'Software engineering and visual storytelling shaped by depth, precision, and perspective.';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_video_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_media_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_video_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_scroll_label" varchar;
  UPDATE "pages"
  SET
    "hero_headline" = "hero_name",
    "hero_description" = "hero_intro"
  WHERE "hero_type" = 'portfolioHero';
  UPDATE "_pages_v"
  SET
    "version_hero_headline" = "version_hero_name",
    "version_hero_description" = "version_hero_intro"
  WHERE "version_hero_type" = 'portfolioHero';
  ALTER TABLE "pages_blocks_about_hero" ADD CONSTRAINT "pages_blocks_about_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_hero" ADD CONSTRAINT "pages_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD CONSTRAINT "_pages_v_blocks_about_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD CONSTRAINT "_pages_v_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_about_hero_order_idx" ON "pages_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_hero_parent_id_idx" ON "pages_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_hero_path_idx" ON "pages_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_hero_image_idx" ON "pages_blocks_about_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_hero_order_idx" ON "_pages_v_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_hero_parent_id_idx" ON "_pages_v_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_hero_path_idx" ON "_pages_v_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_hero_image_idx" ON "_pages_v_blocks_about_hero" USING btree ("image_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_right_media_id_media_id_fk" FOREIGN KEY ("hero_right_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_right_media_id_media_id_fk" FOREIGN KEY ("version_hero_right_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_right_media_idx" ON "pages" USING btree ("hero_right_media_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_right_media_idx" ON "_pages_v" USING btree ("version_hero_right_media_id");
  ALTER TABLE "pages" DROP COLUMN "hero_name";
  ALTER TABLE "pages" DROP COLUMN "hero_intro";
  ALTER TABLE "pages" DROP COLUMN "hero_image_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_name";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_intro";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_label";`)
}
