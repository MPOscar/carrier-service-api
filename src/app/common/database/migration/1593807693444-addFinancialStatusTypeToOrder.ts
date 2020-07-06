import {MigrationInterface, QueryRunner} from "typeorm";

export class addFinancialStatusTypeToOrder1593807693444 implements MigrationInterface {
    name = 'addFinancialStatusTypeToOrder1593807693444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "financialStatus"`, undefined);
        await queryRunner.query(`CREATE TYPE "order_financialstatus_enum" AS ENUM('pending', 'authorized', 'paid', 'voided')`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "financialStatus" "order_financialstatus_enum"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "financialStatus"`, undefined);
        await queryRunner.query(`DROP TYPE "order_financialstatus_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "financialStatus" character varying`, undefined);
    }

}
