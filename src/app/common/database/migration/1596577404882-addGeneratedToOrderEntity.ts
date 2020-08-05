import {MigrationInterface, QueryRunner} from "typeorm";

export class addGeneratedToOrderEntity1596577404882 implements MigrationInterface {
    name = 'addGeneratedToOrderEntity1596577404882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "generatedLabel" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "generatedLabel"`, undefined);
    }

}
