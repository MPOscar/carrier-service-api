import {MigrationInterface, QueryRunner} from "typeorm";

export class addReceiverCityCodeToOrder1574533449230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "receiverCity" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "receiverCityCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "receiverCityCode"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "receiverCity"`);
    }

}
