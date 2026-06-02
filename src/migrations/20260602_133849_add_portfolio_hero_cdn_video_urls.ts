import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "hero_video_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_right_video_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_video_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_right_video_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_video_url";
  ALTER TABLE "pages" DROP COLUMN "hero_right_video_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_video_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_right_video_url";`)
}
