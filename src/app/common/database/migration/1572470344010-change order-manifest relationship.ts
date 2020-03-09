import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrderManifestRelationship1572470344010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "UQ_f42819c4ec27db7ae945e6ae209" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "UQ_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "manifest" DROP COLUMN "order_id"`);
    }

}
