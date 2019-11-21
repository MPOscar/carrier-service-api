import {MigrationInterface, QueryRunner} from "typeorm";

export class modifySomeOrdersFieldsToDecimals1574196484712 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalWeight"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalWeight" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "kg"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "kg" numeric(3,2)`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "volumen"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "volumen" numeric(7,6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "volumen"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "volumen" integer`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "kg"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "kg" integer`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalWeight"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalWeight" integer`);
    }

}
