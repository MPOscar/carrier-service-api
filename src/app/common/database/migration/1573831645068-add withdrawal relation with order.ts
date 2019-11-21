import {MigrationInterface, QueryRunner} from "typeorm";

export class addWithdrawalRelationWithOrder1573831645068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "admission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "extensionData" character varying NOT NULL, "cuartel" character varying NOT NULL, "sector" character varying NOT NULL, "SDP" character varying NOT NULL, "abreviaturaCentro" character varying NOT NULL, "codigoDelegacionDestino" character varying NOT NULL, "nombreDelegacionDestino" character varying NOT NULL, "direccionDestino" character varying NOT NULL, "codigoEncaminamiento" character varying NOT NULL, "grabarEnvio" character varying NOT NULL, "numeroEnvio" character varying NOT NULL, "comunaDestino" character varying NOT NULL, "abreviaturaServicio" character varying NOT NULL, "codigoAdmision" character varying NOT NULL, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "order_id" uuid, CONSTRAINT "REL_96c0aacf8fbcfe42e711ab7802" UNIQUE ("order_id"), CONSTRAINT "PK_6e91be345099f3da80fb2cc0d9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD "withdrawalId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admission" ADD CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "admission" DROP CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "withdrawalId"`);
        await queryRunner.query(`DROP TABLE "admission"`);
    }

}
