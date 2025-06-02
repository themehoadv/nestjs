import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1748878478514 implements MigrationInterface {
    name = 'CreateDb1748878478514'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entity" character varying NOT NULL,
                "actions" "public"."permissions_actions_enum" array NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_permission_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "code" character varying(50) NOT NULL,
                "remark" text,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"),
                CONSTRAINT "PK_role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(50),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "bio" character varying NOT NULL DEFAULT '',
                "avatar" character varying NOT NULL DEFAULT '',
                "phone" character varying NOT NULL DEFAULT '',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "role_id" uuid NOT NULL,
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
            CREATE TABLE "role_permissions" (
                "permission_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("permission_id", "role_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_post_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_post_user_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"
        `);
        await queryRunner.query(`
            DROP TABLE "role_permissions"
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
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP TABLE "permissions"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
    }

}
