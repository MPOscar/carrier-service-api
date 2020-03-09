import {MigrationInterface, QueryRunner} from "typeorm";

export class changeWithdrawalTimeType1583776007086 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "horaDesde"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "horaDesde" TIME WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "horaHasta"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "horaHasta" TIME WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "horaHasta"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "horaHasta" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "horaDesde"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "horaDesde" TIMESTAMP`);
    }

}
