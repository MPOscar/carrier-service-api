import {MigrationInterface, QueryRunner} from "typeorm";

export class setUpCascadeOnEntities1575406296068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4"`);
        await queryRunner.query(`ALTER TABLE "admission" DROP CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027"`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admission" ADD CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "admission" DROP CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);
        await queryRunner.query(`ALTER TABLE "manifest" DROP CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209"`);
        await queryRunner.query(`ALTER TABLE "admission" ADD CONSTRAINT "FK_96c0aacf8fbcfe42e711ab78027" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_046f3422eb3ad484005f74c9fc4" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manifest" ADD CONSTRAINT "FK_f42819c4ec27db7ae945e6ae209" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
