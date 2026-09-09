import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"block_name" varchar
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
  
  CREATE TABLE "pages_blocks_about_protocol_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"quote" varchar
  );
  
  CREATE TABLE "pages_blocks_about_protocol" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_timeline_milestones_metadata" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_about_timeline_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_about_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"image_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
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
  
  CREATE TABLE "_pages_v_blocks_about_protocol_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"quote" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_protocol" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_timeline_milestones_metadata" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_timeline_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_about_hero" ADD CONSTRAINT "pages_blocks_about_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_hero" ADD CONSTRAINT "pages_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_story" ADD CONSTRAINT "pages_blocks_about_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items_tags" ADD CONSTRAINT "pages_blocks_about_disciplines_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_disciplines_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines_items" ADD CONSTRAINT "pages_blocks_about_disciplines_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_disciplines" ADD CONSTRAINT "pages_blocks_about_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_protocol_principles" ADD CONSTRAINT "pages_blocks_about_protocol_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_protocol"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_protocol" ADD CONSTRAINT "pages_blocks_about_protocol_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_timeline_milestones_metadata" ADD CONSTRAINT "pages_blocks_about_timeline_milestones_metadata_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_timeline_milestones" ADD CONSTRAINT "pages_blocks_about_timeline_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_timeline_milestones" ADD CONSTRAINT "pages_blocks_about_timeline_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_timeline" ADD CONSTRAINT "pages_blocks_about_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD CONSTRAINT "_pages_v_blocks_about_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD CONSTRAINT "_pages_v_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_story" ADD CONSTRAINT "_pages_v_blocks_about_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items_tags" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_disciplines_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines_items" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_disciplines" ADD CONSTRAINT "_pages_v_blocks_about_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_protocol_principles" ADD CONSTRAINT "_pages_v_blocks_about_protocol_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_protocol"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_protocol" ADD CONSTRAINT "_pages_v_blocks_about_protocol_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_timeline_milestones_metadata" ADD CONSTRAINT "_pages_v_blocks_about_timeline_milestones_metadata_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_timeline_milestones" ADD CONSTRAINT "_pages_v_blocks_about_timeline_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_timeline_milestones" ADD CONSTRAINT "_pages_v_blocks_about_timeline_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_timeline" ADD CONSTRAINT "_pages_v_blocks_about_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_about_hero_order_idx" ON "pages_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_hero_parent_id_idx" ON "pages_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_hero_path_idx" ON "pages_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_hero_image_idx" ON "pages_blocks_about_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_story_order_idx" ON "pages_blocks_about_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_story_parent_id_idx" ON "pages_blocks_about_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_story_path_idx" ON "pages_blocks_about_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_disciplines_items_tags_order_idx" ON "pages_blocks_about_disciplines_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_items_tags_parent_id_idx" ON "pages_blocks_about_disciplines_items_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_order_idx" ON "pages_blocks_about_disciplines_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_items_parent_id_idx" ON "pages_blocks_about_disciplines_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_icon_idx" ON "pages_blocks_about_disciplines_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_about_disciplines_items_image_idx" ON "pages_blocks_about_disciplines_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_disciplines_order_idx" ON "pages_blocks_about_disciplines" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_disciplines_parent_id_idx" ON "pages_blocks_about_disciplines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_disciplines_path_idx" ON "pages_blocks_about_disciplines" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_protocol_principles_order_idx" ON "pages_blocks_about_protocol_principles" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_protocol_principles_parent_id_idx" ON "pages_blocks_about_protocol_principles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_protocol_order_idx" ON "pages_blocks_about_protocol" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_protocol_parent_id_idx" ON "pages_blocks_about_protocol" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_protocol_path_idx" ON "pages_blocks_about_protocol" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_timeline_milestones_metadata_order_idx" ON "pages_blocks_about_timeline_milestones_metadata" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_timeline_milestones_metadata_parent_id_idx" ON "pages_blocks_about_timeline_milestones_metadata" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_timeline_milestones_order_idx" ON "pages_blocks_about_timeline_milestones" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_timeline_milestones_parent_id_idx" ON "pages_blocks_about_timeline_milestones" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_timeline_milestones_image_idx" ON "pages_blocks_about_timeline_milestones" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_timeline_order_idx" ON "pages_blocks_about_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_timeline_parent_id_idx" ON "pages_blocks_about_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_timeline_path_idx" ON "pages_blocks_about_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_hero_order_idx" ON "_pages_v_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_hero_parent_id_idx" ON "_pages_v_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_hero_path_idx" ON "_pages_v_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_hero_image_idx" ON "_pages_v_blocks_about_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_story_order_idx" ON "_pages_v_blocks_about_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_story_parent_id_idx" ON "_pages_v_blocks_about_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_story_path_idx" ON "_pages_v_blocks_about_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_tags_order_idx" ON "_pages_v_blocks_about_disciplines_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_tags_parent_id_idx" ON "_pages_v_blocks_about_disciplines_items_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_order_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_parent_id_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_icon_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_items_image_idx" ON "_pages_v_blocks_about_disciplines_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_order_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_disciplines_parent_id_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_disciplines_path_idx" ON "_pages_v_blocks_about_disciplines" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_protocol_principles_order_idx" ON "_pages_v_blocks_about_protocol_principles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_protocol_principles_parent_id_idx" ON "_pages_v_blocks_about_protocol_principles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_protocol_order_idx" ON "_pages_v_blocks_about_protocol" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_protocol_parent_id_idx" ON "_pages_v_blocks_about_protocol" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_protocol_path_idx" ON "_pages_v_blocks_about_protocol" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_metadata_order_idx" ON "_pages_v_blocks_about_timeline_milestones_metadata" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_metadata_parent_id_idx" ON "_pages_v_blocks_about_timeline_milestones_metadata" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_order_idx" ON "_pages_v_blocks_about_timeline_milestones" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_parent_id_idx" ON "_pages_v_blocks_about_timeline_milestones" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_timeline_milestones_image_idx" ON "_pages_v_blocks_about_timeline_milestones" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_timeline_order_idx" ON "_pages_v_blocks_about_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_timeline_parent_id_idx" ON "_pages_v_blocks_about_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_timeline_path_idx" ON "_pages_v_blocks_about_timeline" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_about_hero" CASCADE;
  DROP TABLE "pages_blocks_about_story" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines_items_tags" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines_items" CASCADE;
  DROP TABLE "pages_blocks_about_disciplines" CASCADE;
  DROP TABLE "pages_blocks_about_protocol_principles" CASCADE;
  DROP TABLE "pages_blocks_about_protocol" CASCADE;
  DROP TABLE "pages_blocks_about_timeline_milestones_metadata" CASCADE;
  DROP TABLE "pages_blocks_about_timeline_milestones" CASCADE;
  DROP TABLE "pages_blocks_about_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_about_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_about_story" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines_items" CASCADE;
  DROP TABLE "_pages_v_blocks_about_disciplines" CASCADE;
  DROP TABLE "_pages_v_blocks_about_protocol_principles" CASCADE;
  DROP TABLE "_pages_v_blocks_about_protocol" CASCADE;
  DROP TABLE "_pages_v_blocks_about_timeline_milestones_metadata" CASCADE;
  DROP TABLE "_pages_v_blocks_about_timeline_milestones" CASCADE;
  DROP TABLE "_pages_v_blocks_about_timeline" CASCADE;`)
}
