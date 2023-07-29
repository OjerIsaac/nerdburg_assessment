import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1690585150288 implements MigrationInterface {
  name = 'Users1690585150288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
                            id CHAR(36) NOT NULL,
                            firstName VARCHAR(100) NULL UNIQUE,
                            lastName VARCHAR(100) NULL UNIQUE,
                            email VARCHAR(100) NOT NULL UNIQUE,
                            role VARCHAR(50) NOT NULL,
                            password TEXT NOT NULL,
                            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            deletedAt TIMESTAMP NULL DEFAULT NULL,
                            PRIMARY KEY (id)
                          )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users" CASCADE`);
  }
}
