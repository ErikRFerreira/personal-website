import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_blocks_project_principles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_project_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "projects_blocks_project_principles_items" ADD CONSTRAINT "projects_blocks_project_principles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_project_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_project_principles" ADD CONSTRAINT "projects_blocks_project_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_blocks_project_principles_items_order_idx" ON "projects_blocks_project_principles_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_project_principles_items_parent_id_idx" ON "projects_blocks_project_principles_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_project_principles_order_idx" ON "projects_blocks_project_principles" USING btree ("_order");
  CREATE INDEX "projects_blocks_project_principles_parent_id_idx" ON "projects_blocks_project_principles" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_project_principles_path_idx" ON "projects_blocks_project_principles" USING btree ("_path");

  INSERT INTO "projects_blocks_project_principles" (
    "_order",
    "_parent_id",
    "_path",
    "id",
    "eyebrow",
    "title",
    "description"
  )
  SELECT
    0,
    "projects"."id",
    'detailBlocks',
    concat('project-principles-', "projects"."id"),
    'ENGINEERING APPROACH',
    'Built for clarity and reliability',
    'The interface is intentionally simple, while the underlying calculation logic is kept modular and independent from the presentation layer. The result is a fast, offline-first tool that remains easy to test, maintain and use in real diving workflows.'
  FROM "projects"
  WHERE
    "projects"."slug" = 'mod-calculator'
    AND "projects"."status" = 'published'
    AND NOT EXISTS (
      SELECT 1
      FROM "projects_blocks_project_principles"
      WHERE
        "projects_blocks_project_principles"."_parent_id" = "projects"."id"
        AND "projects_blocks_project_principles"."_path" = 'detailBlocks'
    );

  INSERT INTO "projects_blocks_project_principles_items" (
    "_order",
    "_parent_id",
    "id",
    "label",
    "title",
    "description"
  )
  SELECT
    "principle"."item_order",
    "blocks"."id",
    concat("blocks"."id", '-', "principle"."item_order"),
    "principle"."label",
    "principle"."title",
    "principle"."description"
  FROM "projects_blocks_project_principles" AS "blocks"
  INNER JOIN "projects" ON "projects"."id" = "blocks"."_parent_id"
  CROSS JOIN (
    VALUES
      (0, '01', 'Offline by Design', 'Core calculations, preferences and history remain available without an account or network connection.'),
      (1, '02', 'Reliable Calculation Layer', 'MOD, EAD, END and validation are handled separately from the UI, keeping critical gas-planning logic testable and predictable.'),
      (2, '03', 'Cross-Platform by Default', 'React Native and Expo provide a shared TypeScript codebase across mobile platforms.')
  ) AS "principle" ("item_order", "label", "title", "description")
  WHERE
    "projects"."slug" = 'mod-calculator'
    AND "blocks"."_path" = 'detailBlocks'
    AND NOT EXISTS (
      SELECT 1
      FROM "projects_blocks_project_principles_items"
      WHERE "projects_blocks_project_principles_items"."_parent_id" = "blocks"."id"
    );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_blocks_project_principles_items" CASCADE;
  DROP TABLE "projects_blocks_project_principles" CASCADE;`)
}
