import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lens" ALTER COLUMN "archive_format" DROP NOT NULL;
  ALTER TABLE "lens" ADD COLUMN "digital_download_available" boolean DEFAULT false;
  ALTER TABLE "lens" ADD COLUMN "digital_download_price" numeric;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "lens" SET "archive_format" = 'auto' WHERE "archive_format" IS NULL;
  ALTER TABLE "lens" ALTER COLUMN "archive_format" SET NOT NULL;
  ALTER TABLE "lens" DROP COLUMN "digital_download_available";
  ALTER TABLE "lens" DROP COLUMN "digital_download_price";`)
}
