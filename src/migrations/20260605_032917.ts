import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_type" AS ENUM('web-app', 'mobile-app', 'open-source', 'design', 'other');
  CREATE TABLE "projects_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  ALTER TABLE "projects" ADD COLUMN "content" jsonb;
  ALTER TABLE "projects" ADD COLUMN "status" "enum_projects_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "type" "enum_projects_type";
  ALTER TABLE "projects" ADD COLUMN "year" numeric;
  ALTER TABLE "header_nav_items" ADD COLUMN "is_cta" boolean DEFAULT false;
  ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_links_order_idx" ON "projects_links" USING btree ("_order");
  CREATE INDEX "projects_links_parent_id_idx" ON "projects_links" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_links" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  ALTER TABLE "projects" DROP COLUMN "content";
  ALTER TABLE "projects" DROP COLUMN "status";
  ALTER TABLE "projects" DROP COLUMN "type";
  ALTER TABLE "projects" DROP COLUMN "year";
  ALTER TABLE "header_nav_items" DROP COLUMN "is_cta";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_projects_type";`)
}
