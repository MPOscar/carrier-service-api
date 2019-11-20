import {MigrationInterface, QueryRunner} from "typeorm";

export class modifyOrderIdFieldToBigint1574194891484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" integer`);
    }

}
