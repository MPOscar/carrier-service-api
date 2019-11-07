import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrderManifestRelationship1572470344010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_1de1fb8bcefd61e67dfda081b1c"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "UQ_1de1fb8bcefd61e67dfda081b1c"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "manifest_id"`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "UQ_f42819c4ec27db7ae945e6ae209" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "UQ_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "manifest" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "manifest_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "UQ_1de1fb8bcefd61e67dfda081b1c" UNIQUE ("manifest_id")`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_1de1fb8bcefd61e67dfda081b1c" FOREIGN KEY ("manifest_id") REFERENCES "manifest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
