import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_lens_archive_format" AS ENUM(
      'auto',
      'portrait',
      'landscape',
      'square',
      'panorama'
    );
    ALTER TABLE "lens"
      ADD COLUMN "archive_format" "enum_lens_archive_format" DEFAULT 'auto' NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lens" DROP COLUMN "archive_format";
    DROP TYPE "public"."enum_lens_archive_format";
  `)
}
