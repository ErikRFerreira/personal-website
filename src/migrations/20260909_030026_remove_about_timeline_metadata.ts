import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_about_timeline_milestones_metadata" CASCADE;
  DROP TABLE "_pages_v_blocks_about_timeline_milestones_metadata" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_about_timeline_milestones_metadata" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_timeline_milestones_metadata" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_about_timeline_milestones_metadata" ADD CONSTRAINT "pages_blocks_about_timeline_milestones_metadata_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_timeline_milestones_metadata" ADD CONSTRAINT "_pages_v_blocks_about_timeline_milestones_metadata_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_about_timeline_milestones_metadata_order_idx" ON "pages_blocks_about_timeline_milestones_metadata" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_timeline_milestones_metadata_parent_id_idx" ON "pages_blocks_about_timeline_milestones_metadata" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_metadata_order_idx" ON "_pages_v_blocks_about_timeline_milestones_metadata" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_metadata_parent_id_idx" ON "_pages_v_blocks_about_timeline_milestones_metadata" USING btree ("_parent_id");`)
}
