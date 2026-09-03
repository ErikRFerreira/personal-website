import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ALTER COLUMN "hero_type" DROP DEFAULT;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text USING "hero_type"::text;
    DROP TYPE "public"."enum_pages_hero_type";
    CREATE TYPE "public"."enum_pages_hero_type" AS ENUM(
      'none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero', 'aboutHero'
    );
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type"
      USING "hero_type"::"public"."enum_pages_hero_type";
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";

    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" DROP DEFAULT;
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text USING "version_hero_type"::text;
    DROP TYPE "public"."enum__pages_v_version_hero_type";
    CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM(
      'none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero', 'aboutHero'
    );
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type"
      SET DATA TYPE "public"."enum__pages_v_version_hero_type"
      USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type"
      SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";

    UPDATE "pages"
    SET
      "hero_type" = 'aboutHero',
      "hero_name" = CASE WHEN "hero_name" IN ('Erik Ferreira', 'ABOUT') THEN 'ABOUT ME' ELSE "hero_name" END,
      "hero_intro" = CASE
        WHEN "hero_intro" = 'Developer, diver, and photographer building digital products and documenting life underwater.'
          THEN 'Developer, diver and photographer working across software, underwater environments and visual documentation.'
        ELSE "hero_intro"
      END,
      "hero_image_label" = CASE WHEN "hero_image_label" = 'Profile image' THEN 'PROFILE / 01' ELSE "hero_image_label" END
    WHERE "slug" = 'about' AND "hero_type" = 'profileHero';

    UPDATE "_pages_v"
    SET
      "version_hero_type" = 'aboutHero',
      "version_hero_name" = CASE WHEN "version_hero_name" IN ('Erik Ferreira', 'ABOUT') THEN 'ABOUT ME' ELSE "version_hero_name" END,
      "version_hero_intro" = CASE
        WHEN "version_hero_intro" = 'Developer, diver, and photographer building digital products and documenting life underwater.'
          THEN 'Developer, diver and photographer working across software, underwater environments and visual documentation.'
        ELSE "version_hero_intro"
      END,
      "version_hero_image_label" = CASE WHEN "version_hero_image_label" = 'Profile image' THEN 'PROFILE / 01' ELSE "version_hero_image_label" END
    WHERE "version_slug" = 'about' AND "version_hero_type" = 'profileHero';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "pages"
    SET
      "hero_type" = 'profileHero',
      "hero_name" = CASE WHEN "hero_name" = 'ABOUT ME' THEN 'Erik Ferreira' ELSE "hero_name" END,
      "hero_intro" = CASE
        WHEN "hero_intro" = 'Developer, diver and photographer working across software, underwater environments and visual documentation.'
          THEN 'Developer, diver, and photographer building digital products and documenting life underwater.'
        ELSE "hero_intro"
      END,
      "hero_image_label" = CASE WHEN "hero_image_label" = 'PROFILE / 01' THEN 'Profile image' ELSE "hero_image_label" END
    WHERE "slug" = 'about' AND "hero_type" = 'aboutHero';

    UPDATE "_pages_v"
    SET
      "version_hero_type" = 'profileHero',
      "version_hero_name" = CASE WHEN "version_hero_name" = 'ABOUT ME' THEN 'Erik Ferreira' ELSE "version_hero_name" END,
      "version_hero_intro" = CASE
        WHEN "version_hero_intro" = 'Developer, diver and photographer working across software, underwater environments and visual documentation.'
          THEN 'Developer, diver, and photographer building digital products and documenting life underwater.'
        ELSE "version_hero_intro"
      END,
      "version_hero_image_label" = CASE WHEN "version_hero_image_label" = 'PROFILE / 01' THEN 'Profile image' ELSE "version_hero_image_label" END
    WHERE "version_slug" = 'about' AND "version_hero_type" = 'aboutHero';

    UPDATE "pages" SET "hero_type" = 'profileHero' WHERE "hero_type" = 'aboutHero';
    UPDATE "_pages_v" SET "version_hero_type" = 'profileHero' WHERE "version_hero_type" = 'aboutHero';

    ALTER TABLE "pages" ALTER COLUMN "hero_type" DROP DEFAULT;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text USING "hero_type"::text;
    DROP TYPE "public"."enum_pages_hero_type";
    CREATE TYPE "public"."enum_pages_hero_type" AS ENUM(
      'none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero'
    );
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type"
      USING "hero_type"::"public"."enum_pages_hero_type";
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";

    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" DROP DEFAULT;
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text USING "version_hero_type"::text;
    DROP TYPE "public"."enum__pages_v_version_hero_type";
    CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM(
      'none', 'highImpact', 'mediumImpact', 'lowImpact', 'profileHero'
    );
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type"
      SET DATA TYPE "public"."enum__pages_v_version_hero_type"
      USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type"
      SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  `)
}
