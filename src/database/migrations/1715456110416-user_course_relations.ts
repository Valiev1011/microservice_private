import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCourseRelations1715456110416 implements MigrationInterface {
    name = 'UserCourseRelations1715456110416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_courses_course" ("usersId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_973760d1d0d77e6e4323720eafe" PRIMARY KEY ("usersId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4649aed42456e667716988af6" ON "users_courses_course" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e917312c3c1fb6807e67c95a8f" ON "users_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "users_courses_course" ADD CONSTRAINT "FK_e4649aed42456e667716988af62" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_courses_course" ADD CONSTRAINT "FK_e917312c3c1fb6807e67c95a8f8" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_courses_course" DROP CONSTRAINT "FK_e917312c3c1fb6807e67c95a8f8"`);
        await queryRunner.query(`ALTER TABLE "users_courses_course" DROP CONSTRAINT "FK_e4649aed42456e667716988af62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e917312c3c1fb6807e67c95a8f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4649aed42456e667716988af6"`);
        await queryRunner.query(`DROP TABLE "users_courses_course"`);
    }

}
