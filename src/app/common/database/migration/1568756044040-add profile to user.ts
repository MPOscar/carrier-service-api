import {MigrationInterface, QueryRunner} from "typeorm";

export class addProfileToUser1568756044040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "subtotal_price"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_weight"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_tax"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "taxes_included"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "financial_status"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_discounts"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_line_items_price"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "cart_token"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "buyer_accepts_marketing"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "referring_site"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "closed_at"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile" boolean`);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalPrice" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "subtotalPrice" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalWeight" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalTax" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "taxesIncluded" boolean`);
        await queryRunner.query(`ALTER TABLE "order" ADD "financialStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalDiscounts" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalLineItemsPrice" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "cartToken" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "buyerAcceptsMarketing" boolean`);
        await queryRunner.query(`ALTER TABLE "order" ADD "referringSite" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "closedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "createdAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updatedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "gateway" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "test" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "currency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "confirmed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "confirmed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "currency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "test" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "gateway" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "closedAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "referringSite"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "buyerAcceptsMarketing"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "cartToken"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalLineItemsPrice"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalDiscounts"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "financialStatus"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "taxesIncluded"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalTax"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalWeight"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "subtotalPrice"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updated_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "closed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "referring_site" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "buyer_accepts_marketing" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "cart_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_line_items_price" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_discounts" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "financial_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "taxes_included" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_tax" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_weight" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "subtotal_price" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_price" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "order_id" integer NOT NULL`);
    }

}
