import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages"
      ADD COLUMN "hero_enable_image_stack" boolean DEFAULT false,
      ADD COLUMN "hero_stack_primary_label" varchar DEFAULT '01 / DIVER',
      ADD COLUMN "hero_secondary_media_id" integer,
      ADD COLUMN "hero_stack_secondary_label" varchar DEFAULT '02 / DEVELOPER';

    ALTER TABLE "_pages_v"
      ADD COLUMN "version_hero_enable_image_stack" boolean DEFAULT false,
      ADD COLUMN "version_hero_stack_primary_label" varchar DEFAULT '01 / DIVER',
      ADD COLUMN "version_hero_secondary_media_id" integer,
      ADD COLUMN "version_hero_stack_secondary_label" varchar DEFAULT '02 / DEVELOPER';

    ALTER TABLE "pages"
      ADD CONSTRAINT "pages_hero_secondary_media_id_media_id_fk"
      FOREIGN KEY ("hero_secondary_media_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v"
      ADD CONSTRAINT "_pages_v_version_hero_secondary_media_id_media_id_fk"
      FOREIGN KEY ("version_hero_secondary_media_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX "pages_hero_hero_secondary_media_idx"
      ON "pages" USING btree ("hero_secondary_media_id");
    CREATE INDEX "_pages_v_version_hero_version_hero_secondary_media_idx"
      ON "_pages_v" USING btree ("version_hero_secondary_media_id");

    UPDATE "pages"
    SET
      "hero_enable_image_stack" = true,
      "hero_stack_primary_label" = '01 / DIVER',
      "hero_stack_secondary_label" = '02 / DEVELOPER'
    WHERE "slug" = 'home' AND "hero_type" = 'profileHero';

    UPDATE "_pages_v"
    SET
      "version_hero_enable_image_stack" = true,
      "version_hero_stack_primary_label" = '01 / DIVER',
      "version_hero_stack_secondary_label" = '02 / DEVELOPER'
    WHERE "version_slug" = 'home' AND "version_hero_type" = 'profileHero';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages"
      DROP CONSTRAINT "pages_hero_secondary_media_id_media_id_fk";
    ALTER TABLE "_pages_v"
      DROP CONSTRAINT "_pages_v_version_hero_secondary_media_id_media_id_fk";

    DROP INDEX "pages_hero_hero_secondary_media_idx";
    DROP INDEX "_pages_v_version_hero_version_hero_secondary_media_idx";

    ALTER TABLE "pages"
      DROP COLUMN "hero_enable_image_stack",
      DROP COLUMN "hero_stack_primary_label",
      DROP COLUMN "hero_secondary_media_id",
      DROP COLUMN "hero_stack_secondary_label";

    ALTER TABLE "_pages_v"
      DROP COLUMN "version_hero_enable_image_stack",
      DROP COLUMN "version_hero_stack_primary_label",
      DROP COLUMN "version_hero_secondary_media_id",
      DROP COLUMN "version_hero_stack_secondary_label";
  `)
}
