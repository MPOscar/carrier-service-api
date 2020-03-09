import {MigrationInterface, QueryRunner} from "typeorm";

export class addCorrelativeNumberToUser1572467873248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "correlativeNumber" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "correlativeNumber"`);
    }

}
