import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia1747873447751 implements MigrationInterface {
    name = 'CreateMedia1747873447751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'video', 'document', 'audio', 'other')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_referencetype_enum" AS ENUM('blog', 'user')
        `);
        await queryRunner.query(`
            CREATE TABLE "media" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "originalName" character varying NOT NULL,
                "fileName" character varying NOT NULL,
                "path" character varying NOT NULL,
                "mimeType" character varying NOT NULL,
                "type" "public"."media_type_enum" NOT NULL,
                "size" bigint NOT NULL,
                "width" integer,
                "height" integer,
                "referenceType" "public"."media_referencetype_enum",
                "reference_id" character varying,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_media_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "media"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_referencetype_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_type_enum"
        `);
    }

}
