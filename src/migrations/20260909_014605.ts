import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_about_protocol" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_about_protocol" ADD COLUMN "description" varchar;

  UPDATE "pages_blocks_about_protocol"
  SET "description" = 'A practical framework for building reliable systems, navigating uncertainty, and knowing when conventions deserve to be challenged.'
  WHERE "description" IS NULL;

  UPDATE "_pages_v_blocks_about_protocol"
  SET "description" = 'A practical framework for building reliable systems, navigating uncertainty, and knowing when conventions deserve to be challenged.'
  WHERE "description" IS NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_about_protocol" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_about_protocol" DROP COLUMN "description";`)
}
