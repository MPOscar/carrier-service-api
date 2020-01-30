import {MigrationInterface, QueryRunner} from "typeorm";

export class addSucursalToOrder1580400092172 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "sucursal" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "sucursal"`);
    }

}
