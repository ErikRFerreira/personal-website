import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_capabilities_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "pages_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_capabilities_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_id" integer,
  	"_uuid" varchar
  );

  UPDATE "pages_blocks_capabilities"
  SET "eyebrow" = COALESCE(NULLIF(BTRIM("eyebrow"), ''), NULLIF(BTRIM("label"), ''));

  UPDATE "_pages_v_blocks_capabilities"
  SET "eyebrow" = COALESCE(NULLIF(BTRIM("eyebrow"), ''), NULLIF(BTRIM("label"), ''));

  INSERT INTO "pages_blocks_capabilities"
    ("_order", "_parent_id", "_path", "id", "eyebrow", "block_name")
  SELECT
    "_order", "_parent_id", "_path", "id", "eyebrow", "block_name"
  FROM "pages_blocks_about_disciplines";

  WITH "ranked_capabilities" AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY "_parent_id" ORDER BY "_order", "id") AS "card_rank"
    FROM "pages_blocks_capabilities_capabilities"
  )
  INSERT INTO "pages_blocks_capabilities_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id")
  SELECT "_order", "_parent_id", "id", "name", "description", "icon_id"
  FROM "ranked_capabilities"
  WHERE "card_rank" <= 3;

  WITH "ranked_disciplines" AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY "_parent_id" ORDER BY "_order", "id") AS "card_rank"
    FROM "pages_blocks_about_disciplines_items"
  )
  INSERT INTO "pages_blocks_capabilities_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id")
  SELECT "_order", "_parent_id", "id", "title", "description", "icon_id"
  FROM "ranked_disciplines"
  WHERE "card_rank" <= 3;

  INSERT INTO "pages_blocks_capabilities_items_tags"
    ("_order", "_parent_id", "id", "tag")
  SELECT "tag"."_order", "tag"."_parent_id", "tag"."id", "tag"."tag"
  FROM "pages_blocks_about_disciplines_items_tags" AS "tag"
  INNER JOIN "pages_blocks_capabilities_items" AS "item"
    ON "item"."id" = "tag"."_parent_id";

  CREATE TEMP TABLE "_migration_about_capability_blocks" (
    "old_id" integer PRIMARY KEY,
    "new_id" integer NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO "_migration_about_capability_blocks" ("old_id", "new_id")
  SELECT
    "id",
    (SELECT COALESCE(MAX("id"), 0) FROM "_pages_v_blocks_capabilities")
      + ROW_NUMBER() OVER (ORDER BY "id")::integer
  FROM "_pages_v_blocks_about_disciplines";

  INSERT INTO "_pages_v_blocks_capabilities"
    ("_order", "_parent_id", "_path", "id", "eyebrow", "_uuid", "block_name")
  SELECT
    "source"."_order", "source"."_parent_id", "source"."_path", "mapping"."new_id",
    "source"."eyebrow", "source"."_uuid", "source"."block_name"
  FROM "_pages_v_blocks_about_disciplines" AS "source"
  INNER JOIN "_migration_about_capability_blocks" AS "mapping"
    ON "mapping"."old_id" = "source"."id";

  CREATE TEMP TABLE "_migration_capability_items" (
    "source" text NOT NULL,
    "old_id" integer NOT NULL,
    "new_id" integer NOT NULL,
    PRIMARY KEY ("source", "old_id")
  ) ON COMMIT DROP;

  INSERT INTO "_migration_capability_items" ("source", "old_id", "new_id")
  SELECT
    "source", "old_id", ROW_NUMBER() OVER (ORDER BY "source", "old_id")::integer
  FROM (
    SELECT "source", "old_id"
    FROM (
      SELECT
        'capabilities'::text AS "source",
        "id" AS "old_id",
        ROW_NUMBER() OVER (PARTITION BY "_parent_id" ORDER BY "_order", "id") AS "card_rank"
      FROM "_pages_v_blocks_capabilities_capabilities"
    ) AS "ranked_capabilities"
    WHERE "card_rank" <= 3
    UNION ALL
    SELECT "source", "old_id"
    FROM (
      SELECT
        'disciplines'::text AS "source",
        "id" AS "old_id",
        ROW_NUMBER() OVER (PARTITION BY "_parent_id" ORDER BY "_order", "id") AS "card_rank"
      FROM "_pages_v_blocks_about_disciplines_items"
    ) AS "ranked_disciplines"
    WHERE "card_rank" <= 3
  ) AS "kept_items";

  INSERT INTO "_pages_v_blocks_capabilities_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id", "_uuid")
  SELECT
    "source"."_order", "source"."_parent_id", "mapping"."new_id", "source"."name",
    "source"."description", "source"."icon_id", "source"."_uuid"
  FROM "_pages_v_blocks_capabilities_capabilities" AS "source"
  INNER JOIN "_migration_capability_items" AS "mapping"
    ON "mapping"."source" = 'capabilities' AND "mapping"."old_id" = "source"."id";

  INSERT INTO "_pages_v_blocks_capabilities_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id", "_uuid")
  SELECT
    "source"."_order", "block_mapping"."new_id", "item_mapping"."new_id", "source"."title",
    "source"."description", "source"."icon_id", "source"."_uuid"
  FROM "_pages_v_blocks_about_disciplines_items" AS "source"
  INNER JOIN "_migration_capability_items" AS "item_mapping"
    ON "item_mapping"."source" = 'disciplines' AND "item_mapping"."old_id" = "source"."id"
  INNER JOIN "_migration_about_capability_blocks" AS "block_mapping"
    ON "block_mapping"."old_id" = "source"."_parent_id";

  INSERT INTO "_pages_v_blocks_capabilities_items_tags"
    ("_order", "_parent_id", "id", "tag", "_uuid")
  SELECT
    "tag"."_order", "mapping"."new_id", "tag"."id", "tag"."tag", "tag"."_uuid"
  FROM "_pages_v_blocks_about_disciplines_items_tags" AS "tag"
  INNER JOIN "_migration_capability_items" AS "mapping"
    ON "mapping"."source" = 'disciplines' AND "mapping"."old_id" = "tag"."_parent_id";

  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_capabilities', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_capabilities"), 1), 1),
    true
  );
  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_capabilities_items', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_capabilities_items"), 1), 1),
    true
  );
  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_capabilities_items_tags', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_capabilities_items_tags"), 1), 1),
    true
  );
  
  ALTER TABLE "pages_blocks_capabilities_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_disciplines_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_disciplines_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_disciplines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capabilities_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_disciplines" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_capabilities_capabilities" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines_items_tags" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines_items" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines" CASCADE;
  DROP TABLE "_pages_v_blocks_capabilities_capabilities" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines_items" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines" CASCADE;
  ALTER TABLE "pages_blocks_capabilities" ALTER COLUMN "eyebrow" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_capabilities" ALTER COLUMN "eyebrow" DROP DEFAULT;
  ALTER TABLE "pages_blocks_capabilities_items_tags" ADD CONSTRAINT "pages_blocks_capabilities_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capabilities_items" ADD CONSTRAINT "pages_blocks_capabilities_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capabilities_items" ADD CONSTRAINT "pages_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capabilities_items_tags" ADD CONSTRAINT "_pages_v_blocks_capabilities_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capabilities_items" ADD CONSTRAINT "_pages_v_blocks_capabilities_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capabilities_items" ADD CONSTRAINT "_pages_v_blocks_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_capabilities_items_tags_order_idx" ON "pages_blocks_capabilities_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_capabilities_items_tags_parent_id_idx" ON "pages_blocks_capabilities_items_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capabilities_items_order_idx" ON "pages_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_capabilities_items_parent_id_idx" ON "pages_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capabilities_items_icon_idx" ON "pages_blocks_capabilities_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_capabilities_items_tags_order_idx" ON "_pages_v_blocks_capabilities_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capabilities_items_tags_parent_id_idx" ON "_pages_v_blocks_capabilities_items_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capabilities_items_order_idx" ON "_pages_v_blocks_capabilities_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capabilities_items_parent_id_idx" ON "_pages_v_blocks_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capabilities_items_icon_idx" ON "_pages_v_blocks_capabilities_items" USING btree ("icon_id");
  ALTER TABLE "pages_blocks_capabilities" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_capabilities" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_capabilities" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_capabilities" DROP COLUMN "intro";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_capabilities_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_about_disciplines_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "pages_blocks_about_disciplines_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_id" integer,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_about_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capabilities_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_disciplines_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_disciplines_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_id" integer,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_capabilities" ADD COLUMN "label" varchar DEFAULT 'What I Do';
  ALTER TABLE "pages_blocks_capabilities" ADD COLUMN "intro" varchar DEFAULT 'From polished interfaces to robust backend systems, I build thoughtful, reliable digital products from end to end.';
  ALTER TABLE "_pages_v_blocks_capabilities" ADD COLUMN "label" varchar DEFAULT 'What I Do';
  ALTER TABLE "_pages_v_blocks_capabilities" ADD COLUMN "intro" varchar DEFAULT 'From polished interfaces to robust backend systems, I build thoughtful, reliable digital products from end to end.';

  UPDATE "pages_blocks_capabilities"
  SET "label" = COALESCE(NULLIF(BTRIM("eyebrow"), ''), 'What I Do');
  UPDATE "_pages_v_blocks_capabilities"
  SET "label" = COALESCE(NULLIF(BTRIM("eyebrow"), ''), 'What I Do');

  INSERT INTO "pages_blocks_about_disciplines"
    ("_order", "_parent_id", "_path", "id", "eyebrow", "block_name")
  SELECT
    "block"."_order", "block"."_parent_id", "block"."_path", "block"."id",
    "block"."eyebrow", "block"."block_name"
  FROM "pages_blocks_capabilities" AS "block"
  INNER JOIN "pages" AS "page" ON "page"."id" = "block"."_parent_id"
  WHERE "page"."slug" = 'about';

  INSERT INTO "pages_blocks_about_disciplines_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id")
  SELECT
    "item"."_order", "item"."_parent_id", "item"."id", "item"."title",
    "item"."description", "item"."icon_id"
  FROM "pages_blocks_capabilities_items" AS "item"
  INNER JOIN "pages_blocks_about_disciplines" AS "block"
    ON "block"."id" = "item"."_parent_id";

  INSERT INTO "pages_blocks_about_disciplines_items_tags"
    ("_order", "_parent_id", "id", "tag")
  SELECT "tag"."_order", "tag"."_parent_id", "tag"."id", "tag"."tag"
  FROM "pages_blocks_capabilities_items_tags" AS "tag"
  INNER JOIN "pages_blocks_about_disciplines_items" AS "item"
    ON "item"."id" = "tag"."_parent_id";

  INSERT INTO "pages_blocks_capabilities_capabilities"
    ("_order", "_parent_id", "id", "name", "description", "icon_id")
  SELECT
    "item"."_order", "item"."_parent_id", "item"."id", "item"."title",
    "item"."description", "item"."icon_id"
  FROM "pages_blocks_capabilities_items" AS "item"
  INNER JOIN "pages_blocks_capabilities" AS "block" ON "block"."id" = "item"."_parent_id"
  INNER JOIN "pages" AS "page" ON "page"."id" = "block"."_parent_id"
  WHERE "page"."slug" <> 'about';

  INSERT INTO "_pages_v_blocks_about_disciplines"
    ("_order", "_parent_id", "_path", "id", "eyebrow", "_uuid", "block_name")
  SELECT
    "block"."_order", "block"."_parent_id", "block"."_path", "block"."id",
    "block"."eyebrow", "block"."_uuid", "block"."block_name"
  FROM "_pages_v_blocks_capabilities" AS "block"
  INNER JOIN "_pages_v" AS "version" ON "version"."id" = "block"."_parent_id"
  WHERE "version"."version_slug" = 'about';

  INSERT INTO "_pages_v_blocks_about_disciplines_items"
    ("_order", "_parent_id", "id", "title", "description", "icon_id", "_uuid")
  SELECT
    "item"."_order", "item"."_parent_id", "item"."id", "item"."title",
    "item"."description", "item"."icon_id", "item"."_uuid"
  FROM "_pages_v_blocks_capabilities_items" AS "item"
  INNER JOIN "_pages_v_blocks_about_disciplines" AS "block"
    ON "block"."id" = "item"."_parent_id";

  INSERT INTO "_pages_v_blocks_about_disciplines_items_tags"
    ("_order", "_parent_id", "id", "tag", "_uuid")
  SELECT "tag"."_order", "tag"."_parent_id", "tag"."id", "tag"."tag", "tag"."_uuid"
  FROM "_pages_v_blocks_capabilities_items_tags" AS "tag"
  INNER JOIN "_pages_v_blocks_about_disciplines_items" AS "item"
    ON "item"."id" = "tag"."_parent_id";

  INSERT INTO "_pages_v_blocks_capabilities_capabilities"
    ("_order", "_parent_id", "id", "name", "description", "icon_id", "_uuid")
  SELECT
    "item"."_order", "item"."_parent_id", "item"."id", "item"."title",
    "item"."description", "item"."icon_id", "item"."_uuid"
  FROM "_pages_v_blocks_capabilities_items" AS "item"
  INNER JOIN "_pages_v_blocks_capabilities" AS "block" ON "block"."id" = "item"."_parent_id"
  INNER JOIN "_pages_v" AS "version" ON "version"."id" = "block"."_parent_id"
  WHERE "version"."version_slug" <> 'about';

  DELETE FROM "pages_blocks_capabilities" AS "block"
  USING "pages" AS "page"
  WHERE "page"."id" = "block"."_parent_id" AND "page"."slug" = 'about';

  DELETE FROM "_pages_v_blocks_capabilities" AS "block"
  USING "_pages_v" AS "version"
  WHERE "version"."id" = "block"."_parent_id" AND "version"."version_slug" = 'about';

  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_capabilities_capabilities', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_capabilities_capabilities"), 1), 1),
    true
  );
  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_about_disciplines', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_about_disciplines"), 1), 1),
    true
  );
  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_about_disciplines_items', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_about_disciplines_items"), 1), 1),
    true
  );
  SELECT setval(
    pg_get_serial_sequence('_pages_v_blocks_about_disciplines_items_tags', 'id'),
    GREATEST(COALESCE((SELECT MAX("id") FROM "_pages_v_blocks_about_disciplines_items_tags"), 1), 1),
    true
  );
  
  ALTER TABLE "pages_blocks_capabilities_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capabilities_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capabilities_items_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capabilities_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_capabilities_items_tags" CASCADE;
  DROP TABLE "pages_blocks_capabilities_items" CASCADE;
  DROP TABLE "_pages_v_blocks_capabilities_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_capabilities_items" CASCADE;
  ALTER TABLE "pages_blocks_capabilities" ALTER COLUMN "eyebrow" SET DEFAULT '03 - Capabilities';
  ALTER TABLE "_pages_v_blocks_capabilities" ALTER COLUMN "eyebrow" SET DEFAULT '03 - Capabilities';
  ALTER TABLE "pages_blocks_capabilities_capabilities" ADD CONSTRAINT "pages_blocks_capabilities_capabilities_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capabilities_capabilities" ADD CONSTRAINT "pages_blocks_capabilities_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items_tags" ADD CONSTRAINT "pages_blocks_about_disciplines_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_disciplines_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines" ADD CONSTRAINT "pages_blocks_about_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capabilities_capabilities" ADD CONSTRAINT "_pages_v_blocks_capabilities_capabilities_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capabilities_capabilities" ADD CONSTRAINT "_pages_v_blocks_capabilities_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items_tags" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_disciplines_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_capabilities_capabilities_order_idx" ON "pages_blocks_capabilities_capabilities" USING btree ("_order");
  CREATE INDEX "pages_blocks_capabilities_capabilities_parent_id_idx" ON "pages_blocks_capabilities_capabilities" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capabilities_capabilities_icon_idx" ON "pages_blocks_capabilities_capabilities" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_tags_order_idx" ON "pages_blocks_about_disciplines_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_items_tags_parent_id_idx" ON "pages_blocks_about_disciplines_items_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_order_idx" ON "pages_blocks_about_disciplines_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_items_parent_id_idx" ON "pages_blocks_about_disciplines_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_icon_idx" ON "pages_blocks_about_disciplines_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_image_idx" ON "pages_blocks_about_disciplines_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_disciplines_order_idx" ON "pages_blocks_about_disciplines" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_parent_id_idx" ON "pages_blocks_about_disciplines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_path_idx" ON "pages_blocks_about_disciplines" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capabilities_capabilities_order_idx" ON "_pages_v_blocks_capabilities_capabilities" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capabilities_capabilities_parent_id_idx" ON "_pages_v_blocks_capabilities_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capabilities_capabilities_icon_idx" ON "_pages_v_blocks_capabilities_capabilities" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_tags_order_idx" ON "_pages_v_blocks_about_disciplines_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_tags_parent_id_idx" ON "_pages_v_blocks_about_disciplines_items_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_order_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_parent_id_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_icon_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_image_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_order_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_parent_id_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_path_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_path");`)
}
