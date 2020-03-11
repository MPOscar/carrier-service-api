import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrderIdTypeToBigInt1583955486457 implements MigrationInterface {
    name = 'changeOrderIdTypeToBigInt1583955486457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" bigint`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" integer`, undefined);
    }

}
