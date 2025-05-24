import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourse1748012825751 implements MigrationInterface {
    name = 'CreateCourse1748012825751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "chapter" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "order" integer NOT NULL,
                "description" character varying,
                "course_id" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "courseId" uuid,
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
                "oldPrice" numeric(10, 2),
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
            ALTER TABLE "chapter"
            ADD CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "course"
            ADD CONSTRAINT "FK_course_author_id" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "course" DROP CONSTRAINT "FK_course_author_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "chapter" DROP CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd"
        `);
        await queryRunner.query(`
            DROP TABLE "course"
        `);
        await queryRunner.query(`
            DROP TABLE "chapter"
        `);
    }

}
