import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleDeleteAt1748682471057 implements MigrationInterface {
    name = 'AddRoleDeleteAt1748682471057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "roles"
            ADD "deleted_at" TIMESTAMP WITH TIME ZONE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "roles" DROP COLUMN "deleted_at"
        `);
    }

}
