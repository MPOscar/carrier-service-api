import {MigrationInterface, QueryRunner} from "typeorm";

export class addAdmisionCodeToManifest1572538035994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" ADD "admissionCode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" DROP COLUMN "admissionCode"`);
    }

}
