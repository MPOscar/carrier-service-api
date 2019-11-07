import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCorrelativeNumberDefaultValue1572532733899 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "correlativeNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "correlativeNumber" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "correlativeNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "correlativeNumber" DROP NOT NULL`);
    }

}
