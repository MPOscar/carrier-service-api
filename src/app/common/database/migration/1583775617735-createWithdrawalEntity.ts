import {MigrationInterface, QueryRunner} from "typeorm";

export class createWithdrawalEntity1583775617735 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "withdrawal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "admissionCode" character varying, "withdrawalCode" integer, "contact" character varying, "contactPhone" character varying, "date" TIMESTAMP, "horaDesde" TIME WITH TIME ZONE, "horaHasta" TIME WITH TIME ZONE, "rut" character varying, "address" character varying, "comuna" character varying, "region" character varying, "zip" character varying, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4"`);
        await queryRunner.query(`DROP TABLE "withdrawal"`);
    }

}
