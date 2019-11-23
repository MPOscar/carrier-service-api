import {MigrationInterface, QueryRunner} from "typeorm";

export class addReceiverCityToOrder1574532405551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "receiverCity" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "receiverCity"`);
    }

}
