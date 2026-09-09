import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Scoped to only the new Projects showcase fields; unrelated schema drift from
// prior dev-mode DB pushes (about_protocol/disciplines/hero-stack) was already
// applied to the DB and is intentionally excluded here to avoid re-run conflicts.
// The columns/constraint/index below were already applied to this DB by an
// earlier (aborted) migration attempt, so up() is a no-op; down() still works.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" DROP CONSTRAINT "projects_showcase_icon_id_media_id_fk";
  DROP INDEX "projects_showcase_icon_idx";
  ALTER TABLE "projects" DROP COLUMN "showcase_icon_id";
  ALTER TABLE "projects" DROP COLUMN "showcase_title";
  ALTER TABLE "projects" DROP COLUMN "showcase_subtitle";
  ALTER TABLE "projects" DROP COLUMN "build_info";`)
}
