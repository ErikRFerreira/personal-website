import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lens_digital_currency" AS ENUM('EUR', 'USD', 'GBP');
  ALTER TABLE "lens" ADD COLUMN "digital_purchase_enabled" boolean DEFAULT false;
  ALTER TABLE "lens" ADD COLUMN "digital_price" numeric;
  ALTER TABLE "lens" ADD COLUMN "digital_currency" "enum_lens_digital_currency" DEFAULT 'EUR';
  ALTER TABLE "lens" ADD COLUMN "digital_checkout_url" varchar;
  ALTER TABLE "lens" ADD COLUMN "digital_format" varchar;
  ALTER TABLE "lens" ADD COLUMN "digital_dimensions" varchar;
  ALTER TABLE "lens" ADD COLUMN "digital_file_size" varchar;
  ALTER TABLE "lens" ADD COLUMN "digital_license_type" varchar DEFAULT 'Personal use';
  ALTER TABLE "lens" ADD COLUMN "digital_license_description" varchar;
  ALTER TABLE "lens" ADD COLUMN "commercial_licensing_enabled" boolean DEFAULT true;
  ALTER TABLE "lens" ADD COLUMN "commercial_licensing_text" varchar;
  UPDATE "lens"
  SET
    "digital_purchase_enabled" = COALESCE("digital_download_available", false),
    "digital_price" = "digital_download_price",
    "digital_license_description" = "licensing_text";
  ALTER TABLE "lens" DROP COLUMN "digital_download_available";
  ALTER TABLE "lens" DROP COLUMN "digital_download_price";
  ALTER TABLE "lens" DROP COLUMN "licensing_text";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "lens" ADD COLUMN "digital_download_available" boolean DEFAULT false;
  ALTER TABLE "lens" ADD COLUMN "digital_download_price" numeric;
  ALTER TABLE "lens" ADD COLUMN "licensing_text" varchar;
  UPDATE "lens"
  SET
    "digital_download_available" = COALESCE("digital_purchase_enabled", false),
    "digital_download_price" = "digital_price",
    "licensing_text" = "digital_license_description";
  ALTER TABLE "lens" DROP COLUMN "digital_purchase_enabled";
  ALTER TABLE "lens" DROP COLUMN "digital_price";
  ALTER TABLE "lens" DROP COLUMN "digital_currency";
  ALTER TABLE "lens" DROP COLUMN "digital_checkout_url";
  ALTER TABLE "lens" DROP COLUMN "digital_format";
  ALTER TABLE "lens" DROP COLUMN "digital_dimensions";
  ALTER TABLE "lens" DROP COLUMN "digital_file_size";
  ALTER TABLE "lens" DROP COLUMN "digital_license_type";
  ALTER TABLE "lens" DROP COLUMN "digital_license_description";
  ALTER TABLE "lens" DROP COLUMN "commercial_licensing_enabled";
  ALTER TABLE "lens" DROP COLUMN "commercial_licensing_text";
  DROP TYPE "public"."enum_lens_digital_currency";`)
}
