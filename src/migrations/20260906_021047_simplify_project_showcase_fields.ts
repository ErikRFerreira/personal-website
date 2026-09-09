import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_gallery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_gallery" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_showcase_icon_id_media_id_fk";
  
  DROP INDEX "projects_showcase_icon_idx";
  ALTER TABLE "projects" ADD COLUMN "showcase_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "showcase_caption" varchar;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_showcase_image_id_media_id_fk" FOREIGN KEY ("showcase_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_showcase_image_idx" ON "projects" USING btree ("showcase_image_id");
  ALTER TABLE "projects" DROP COLUMN "showcase_icon_id";
  ALTER TABLE "projects" DROP COLUMN "build_info";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_showcase_image_id_media_id_fk";
  
  DROP INDEX "projects_showcase_image_idx";
  ALTER TABLE "projects" ADD COLUMN "showcase_icon_id" integer;
  ALTER TABLE "projects" ADD COLUMN "build_info" varchar;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_showcase_icon_id_media_id_fk" FOREIGN KEY ("showcase_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_showcase_icon_idx" ON "projects" USING btree ("showcase_icon_id");
  ALTER TABLE "projects" DROP COLUMN "showcase_image_id";
  ALTER TABLE "projects" DROP COLUMN "showcase_caption";`)
}
