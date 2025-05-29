import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDbInit1748522727557 implements MigrationInterface {
    name = 'CreateDbInit1748522727557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(50),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "bio" character varying NOT NULL DEFAULT '',
                "avatar" character varying NOT NULL DEFAULT '',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_username" ON "users" ("username")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_email" ON "users" ("email")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_post_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_post_user_id"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
