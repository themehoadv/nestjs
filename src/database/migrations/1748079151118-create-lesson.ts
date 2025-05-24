import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLesson1748079151118 implements MigrationInterface {
    name = 'CreateLesson1748079151118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lesson" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "order" integer NOT NULL DEFAULT '0',
                "description" character varying,
                "content" text,
                "chapter_id" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "chapterId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_lesson_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "lesson"
            ADD CONSTRAINT "FK_6d69805e5bd546281aed4aee74e" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "lesson" DROP CONSTRAINT "FK_6d69805e5bd546281aed4aee74e"
        `);
        await queryRunner.query(`
            DROP TABLE "lesson"
        `);
    }

}
