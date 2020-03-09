import {MigrationInterface, QueryRunner} from "typeorm";

export class addRechargeAndLabelFormatToUser1573659246282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "labelFormat" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "recharge" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recharge"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "labelFormat"`);
    }
}
