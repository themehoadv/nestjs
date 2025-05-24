import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1748096039248 implements MigrationInterface {
    name = 'Init1748096039248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "blog" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_blog_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "lesson" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "order" integer NOT NULL DEFAULT '0',
                "description" character varying,
                "content" text,
                "chapter_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_lesson_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "chapter" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "order" integer NOT NULL,
                "description" character varying,
                "course_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_chapter_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "course" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "price" numeric(10, 2) NOT NULL,
                "old_price" numeric(10, 2),
                "description" character varying,
                "author_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "UQ_a101f48e5045bcf501540a4a5b8" UNIQUE ("slug"),
                CONSTRAINT "PK_course_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "session" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "hash" character varying(255) NOT NULL,
                "user_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(50),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "bio" character varying NOT NULL DEFAULT '',
                "image" character varying NOT NULL DEFAULT '',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_username" ON "user" ("username")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_email" ON "user" ("email")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_reference_type_enum" AS ENUM('blog', 'user')
        `);
        await queryRunner.query(`
            CREATE TABLE "media" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "original_name" character varying NOT NULL,
                "file_name" character varying NOT NULL,
                "path" character varying NOT NULL,
                "mime_type" character varying NOT NULL,
                "type" "public"."media_type_enum" NOT NULL,
                "size" bigint NOT NULL,
                "width" integer,
                "height" integer,
                "reference_type" "public"."media_reference_type_enum",
                "reference_id" uuid,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_media_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "blog"
            ADD CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lesson"
            ADD CONSTRAINT "FK_cda7676f5f73f9b60650dd405f8" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "chapter"
            ADD CONSTRAINT "FK_be4eebd798cc26bd6bded42f8c0" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "course"
            ADD CONSTRAINT "FK_907888662706db7def5705ef5d3" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "course" DROP CONSTRAINT "FK_907888662706db7def5705ef5d3"
        `);
        await queryRunner.query(`
            ALTER TABLE "chapter" DROP CONSTRAINT "FK_be4eebd798cc26bd6bded42f8c0"
        `);
        await queryRunner.query(`
            ALTER TABLE "lesson" DROP CONSTRAINT "FK_cda7676f5f73f9b60650dd405f8"
        `);
        await queryRunner.query(`
            ALTER TABLE "blog" DROP CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c"
        `);
        await queryRunner.query(`
            DROP TABLE "media"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_reference_type_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "session"
        `);
        await queryRunner.query(`
            DROP TABLE "course"
        `);
        await queryRunner.query(`
            DROP TABLE "chapter"
        `);
        await queryRunner.query(`
            DROP TABLE "lesson"
        `);
        await queryRunner.query(`
            DROP TABLE "blog"
        `);
    }

}
