import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAllExtensionData1574199537869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "admission" DROP COLUMN "extensionData"`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "cuartel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "sector" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "SDP" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "abreviaturaCentro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoDelegacionDestino" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "nombreDelegacionDestino" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "direccionDestino" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoEncaminamiento" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "grabarEnvio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "numeroEnvio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "comunaDestino" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "abreviaturaServicio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoAdmision" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoAdmision" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "abreviaturaServicio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "comunaDestino" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "numeroEnvio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "grabarEnvio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoEncaminamiento" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "direccionDestino" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "nombreDelegacionDestino" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "codigoDelegacionDestino" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "abreviaturaCentro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "SDP" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "sector" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ALTER COLUMN "cuartel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admission" ADD "extensionData" character varying NOT NULL`);
    }

}
