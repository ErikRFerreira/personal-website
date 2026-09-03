import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_protocol" ADD COLUMN "quote" varchar;
    ALTER TABLE "_pages_v_blocks_about_protocol" ADD COLUMN "quote" varchar;

    UPDATE "pages_blocks_about_protocol" AS "protocol"
    SET "quote" = (
      SELECT "principle"."quote"
      FROM "pages_blocks_about_protocol_principles" AS "principle"
      WHERE
        "principle"."_parent_id" = "protocol"."id"
        AND NULLIF(BTRIM("principle"."quote"), '') IS NOT NULL
      ORDER BY "principle"."_order" DESC
      LIMIT 1
    );

    UPDATE "_pages_v_blocks_about_protocol" AS "protocol"
    SET "quote" = (
      SELECT "principle"."quote"
      FROM "_pages_v_blocks_about_protocol_principles" AS "principle"
      WHERE
        "principle"."_parent_id" = "protocol"."id"
        AND NULLIF(BTRIM("principle"."quote"), '') IS NOT NULL
      ORDER BY "principle"."_order" DESC
      LIMIT 1
    );

    ALTER TABLE "pages_blocks_about_protocol_principles" DROP COLUMN "quote";
    ALTER TABLE "_pages_v_blocks_about_protocol_principles" DROP COLUMN "quote";
    ALTER TABLE "pages_blocks_about_protocol" DROP COLUMN "eyebrow";
    ALTER TABLE "_pages_v_blocks_about_protocol" DROP COLUMN "eyebrow";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_protocol" ADD COLUMN "eyebrow" varchar;
    ALTER TABLE "_pages_v_blocks_about_protocol" ADD COLUMN "eyebrow" varchar;
    ALTER TABLE "pages_blocks_about_protocol_principles" ADD COLUMN "quote" varchar;
    ALTER TABLE "_pages_v_blocks_about_protocol_principles" ADD COLUMN "quote" varchar;

    UPDATE "pages_blocks_about_protocol_principles" AS "principle"
    SET "quote" = "protocol"."quote"
    FROM "pages_blocks_about_protocol" AS "protocol"
    WHERE "principle"."_parent_id" = "protocol"."id";

    UPDATE "_pages_v_blocks_about_protocol_principles" AS "principle"
    SET "quote" = "protocol"."quote"
    FROM "_pages_v_blocks_about_protocol" AS "protocol"
    WHERE "principle"."_parent_id" = "protocol"."id";

    ALTER TABLE "pages_blocks_about_protocol" DROP COLUMN "quote";
    ALTER TABLE "_pages_v_blocks_about_protocol" DROP COLUMN "quote";
  `)
}
