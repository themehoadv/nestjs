import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1748132003612 implements MigrationInterface {
    name = 'Init1748132003612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."media_type_enum"
            RENAME TO "media_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'video', 'document', 'audio', 'other')
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ALTER COLUMN "type" TYPE "public"."media_type_enum" USING "type"::"text"::"public"."media_type_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_type_enum_old"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."media_reference_type_enum"
            RENAME TO "media_reference_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_reference_type_enum" AS ENUM('blog', 'user')
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ALTER COLUMN "reference_type" TYPE "public"."media_reference_type_enum" USING "reference_type"::"text"::"public"."media_reference_type_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_reference_type_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_reference_type_enum_old" AS ENUM('blog', 'user')
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ALTER COLUMN "reference_type" TYPE "public"."media_reference_type_enum_old" USING "reference_type"::"text"::"public"."media_reference_type_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_reference_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."media_reference_type_enum_old"
            RENAME TO "media_reference_type_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_type_enum_old" AS ENUM('image', 'video', 'document', 'audio', 'other')
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ALTER COLUMN "type" TYPE "public"."media_type_enum_old" USING "type"::"text"::"public"."media_type_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."media_type_enum_old"
            RENAME TO "media_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
