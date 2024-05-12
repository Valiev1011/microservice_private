import { MigrationInterface, QueryRunner } from "typeorm";

export class File1715493409054 implements MigrationInterface {
    name = 'File1715493409054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "fileName" character varying(255) NOT NULL, "filePath" character varying(255) NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file_courses_course" ("fileId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_a91828a368c7ada2951c10a39d1" PRIMARY KEY ("fileId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16a243f239cabe420e93bbc87b" ON "file_courses_course" ("fileId") `);
        await queryRunner.query(`CREATE INDEX "IDX_92f6b57759243bdbb8b2ac6eb6" ON "file_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "file_courses_course" ADD CONSTRAINT "FK_16a243f239cabe420e93bbc87b0" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_courses_course" ADD CONSTRAINT "FK_92f6b57759243bdbb8b2ac6eb63" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_courses_course" DROP CONSTRAINT "FK_92f6b57759243bdbb8b2ac6eb63"`);
        await queryRunner.query(`ALTER TABLE "file_courses_course" DROP CONSTRAINT "FK_16a243f239cabe420e93bbc87b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_92f6b57759243bdbb8b2ac6eb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16a243f239cabe420e93bbc87b"`);
        await queryRunner.query(`DROP TABLE "file_courses_course"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
