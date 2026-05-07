import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_right_eyebrow" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_right_headline" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_right_description" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_positioning_line" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_positioning_line";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_right_description";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_right_headline";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_right_eyebrow";
  `)
}
