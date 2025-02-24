import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSizeCnameTusers1740094937824 implements MigrationInterface {
    name = 'ChangeSizeCnameTusers1740094937824'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query (
        `ALTER TABLE "users" ALTER COLUMN "name" TYPE character varying(120)`
      )

      await queryRunner.query (
        `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query (
            `ALTER TABLE "users" ALTER COLUMN "name" TYPE character varying(100)`
          )

          await queryRunner.query (
            `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`
          )
    }

}
