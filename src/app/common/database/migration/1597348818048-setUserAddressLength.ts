import {MigrationInterface, QueryRunner} from "typeorm";

export class setUserAddressLength1597348818048 implements MigrationInterface {
    name = 'setUserAddressLength1597348818048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(30)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`, undefined);
    }

}
