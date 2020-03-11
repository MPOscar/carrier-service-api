import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrderIdType1583953733736 implements MigrationInterface {
    name = 'changeOrderIdType1583953733736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" bigint`, undefined);
    }

}
